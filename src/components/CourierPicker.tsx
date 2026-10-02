// src/components/CourierPicker.tsx
// Самостоятелен избор на доставка: куриер → офис/адрес → град (с автокомплийт и
// транслитерация лат→кир) → офис ИЛИ улица+номер → бележка.
// Зависи само от React + lucide-react. Един файл, копира се между фунии.
//
// ПОПРАВКИ (вж. коментарите с 🔧):
//  1. След избор на улица полето се ЗАКЛЮЧВА (чип като при града) — няма как
//     клиентът да продължи да пише и без да усети да размаже избора си.
//  2. След избор на улица фокусът скача автоматично в полето за номер.
//  3. Ако клиентът пише, но НЕ избере от списъка — вижда червено предупреждение.
//  4. Ако улицата я няма в базата на куриера — има ръчен вход, за да не се губи поръчка.
//  5. Смяна на града нулира улицата (иначе оставаше улица от предишния град).

import { useEffect, useRef, useState } from 'react';
import { Truck, MapPin, Building2, Home, Search, Check, Loader2, ChevronDown } from 'lucide-react';

const WORKER = 'https://naturino-couriers.bulgariaherbal.workers.dev';

// ---------- Типове ----------
type Courier = 'speedy' | 'econt';
type DeliveryType = 'office' | 'address';

interface CityHit { id: number | string; name: string; postCode: string; region: string; }
interface OfficeHit { id: number | string; name: string; city: string; postCode: string; address: string; isAutomat: boolean; }
interface StreetHit { id: number | string; name: string; type: string; }

export interface CourierSelection {
  courier: Courier | null;
  deliveryType: DeliveryType | null;
  cityId: number | string | null;
  cityName: string;
  region: string;
  postCode: string;
  officeId: number | string | null;
  officeName: string;
  isAutomat: boolean;
  streetId: number | string | null;
  streetName: string;
  streetNo: string;
  note: string;
  fullAddress: string;   // готов човекочетим адрес за таблицата
  isComplete: boolean;   // всичко нужно ли е избрано
}

// ---------- Транслитерация латиница → кирилица ----------
const TRANSLIT: [string, string][] = [
  ['sht', 'щ'], ['zh', 'ж'], ['ch', 'ч'], ['sh', 'ш'], ['ts', 'ц'],
  ['kh', 'х'], ['ou', 'у'],
  ['ya', 'я'], ['yu', 'ю'], ['ay', 'ай'],
  ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', 'г'], ['d', 'д'], ['e', 'е'],
  ['z', 'з'], ['i', 'и'], ['y', 'й'], ['k', 'к'], ['l', 'л'], ['m', 'м'],
  ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'], ['s', 'с'], ['t', 'т'],
  ['u', 'у'], ['f', 'ф'], ['h', 'х'], ['c', 'ц'], ['j', 'ж'], ['w', 'в'], ['x', 'х'], ['q', 'я'],
];

function translit(input: string): string {
  const s = input.toLowerCase();
  let out = '';
  let i = 0;
  const isLatConsonant = (c: string) => /[bcdfghjklmnpqrstvwxz]/.test(c);
  while (i < s.length) {
    // 🔧 "y" между две съгласни е "ъ" (Kazanlyk → Казанлък, Tyrnovo → Търново)
    if (s[i] === 'y' && isLatConsonant(s[i - 1] || '') && isLatConsonant(s[i + 1] || '')) {
      out += 'ъ'; i += 1; continue;
    }
    let matched = false;
    for (const [lat, cyr] of TRANSLIT) {
      if (s.startsWith(lat, i)) { out += cyr; i += lat.length; matched = true; break; }
    }
    if (!matched) { out += s[i]; i += 1; }
  }
  return out;
}

function toCyrillic(q: string): string {
  return /[a-z]/i.test(q) ? translit(q) : q;
}

// =====================================================================
// 🔧 УМНО РАЗПОЗНАВАНЕ НА НАСЕЛЕНО МЯСТО
// Целта: клиентът да не може да остане с „написан, но неизбран“ град.
//  • приема различни изписвания на латиница (Kazanlak / Kazanluk / Kazanlyk, Sofia / Sofiya)
//  • избира града автоматично, когато няма никакво съмнение кой е
//  • когато има няколко възможности — НЕ избира вместо клиента (за да не замине пратка в грешен град)
// =====================================================================

// Маха „гр.“, „с.“, „град“, „село“ отпред и всичко след запетая (идва от автоматично попълване)
function cleanCityInput(raw: string): string {
  let s = String(raw || '').split(',')[0].trim();
  s = s.replace(/^(?:(?:гр|с|gr|s)\.\s*|(?:град|село|grad|selo|гр|с)\s+)/i, '');
  return s.trim();
}

// „Скелет“ на името: изравнява буквите, които хората бъркат (я/иа, ю/иу, й/и, щ/шт, ъ/а/у)
function foldCity(name: string, hard: 'а' | 'у'): string {
  return name
    .toLowerCase()
    .replace(/[.\-–—'’"`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/щ/g, 'шт')
    .replace(/ь/g, 'й')
    .replace(/я/g, 'иа')
    .replace(/ю/g, 'иу')
    .replace(/й/g, 'и')
    .replace(/ъ/g, hard)
    .replace(/и{2,}/g, 'и');
}

// Съвпада ли името на града с написаното (вече на кирилица)
function cityMatches(name: string, cyrInput: string): { prefix: boolean; exact: boolean } {
  const nA = foldCity(name, 'а'), qA = foldCity(cyrInput, 'а');
  const nU = foldCity(name, 'у'), qU = foldCity(cyrInput, 'у');
  return {
    prefix: nA.startsWith(qA) || nU.startsWith(qU),
    exact: nA === qA || nU === qU,
  };
}

// Други възможни изписвания, които да пробваме, ако точното не намери нищо
function cityQueryVariants(cyr: string): string[] {
  const base = cyr.toLowerCase();
  const out: string[] = [];
  const add = (v: string) => { if (v !== base && v.length >= 2 && out.indexOf(v) === -1) out.push(v); };
  const isCons = (c: string) => /[бвгджзклмнпрстфхцчшщ]/.test(c);

  // София ← „софиа“, Смолян ← „смолиан“, Кюстендил ← „киустендил“
  add(base.replace(/[ий]а/g, 'ия'));
  add(base.replace(/[ий]а/g, 'я'));
  add(base.replace(/[ий]у/g, 'ю'));

  // „ъ“, написано като „а“ или „у“ (Казанлък ← „казанлак“, Търново ← „турново“)
  const between: number[] = [];
  const others: number[] = [];
  for (let i = 0; i < base.length; i++) {
    if (base[i] !== 'а' && base[i] !== 'у') continue;
    const prev = base[i - 1] || '';
    const next = base[i + 1] || '';
    if (isCons(prev) && (next === '' || isCons(next))) between.push(i);
    else others.push(i);
  }
  const withHard = (idx: number[]) => {
    const chars = base.split('');
    idx.forEach((i) => { chars[i] = 'ъ'; });
    return chars.join('');
  };
  between.forEach((i) => add(withHard([i])));
  if (between.length > 1) add(withHard(between)); // Гълъбово ← „галабово“
  others.forEach((i) => add(withHard([i])));

  return out.slice(0, 8);
}

// Кой град да изберем автоматично (или null = клиентът трябва да избере сам)
function pickCityAuto(hits: CityHit[], raw: string, focused: boolean): CityHit | null {
  if (hits.length === 0) return null;
  const cyr = toCyrillic(cleanCityInput(raw)).toLowerCase();
  if (cyr.length < 2) return null;
  const exact = hits.filter((h) => cityMatches(h.name, cyr).exact);
  if (focused) {
    // Докато пише: само ако това е ЕДИНСТВЕНАТА възможност и е изписана цялата
    return hits.length === 1 && exact.length === 1 ? hits[0] : null;
  }
  // Излязъл е от полето / автоматично попълване:
  if (exact.length === 1) return exact[0];   // написал е цялото име и то е само едно
  if (exact.length > 1) return null;         // няколко села/града с това име → избира клиентът
  return hits.length === 1 ? hits[0] : null; // написал е началото и има само един такъв
}

// ---------- Тръба към Worker-а (с кеш) ----------
let econtCitiesCache: CityHit[] | null = null;
const officesCache = new Map<string, OfficeHit[]>();

async function getJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

async function searchCities(courier: Courier, raw: string): Promise<CityHit[]> {
  const cyr = toCyrillic(cleanCityInput(raw)).toLowerCase();
  if (cyr.length < 2) return [];

  // Точните съвпадения (цялото име) излизат най-отгоре
  const exactFirst = (list: CityHit[]) => {
    const ex = list.filter((c) => cityMatches(c.name, cyr).exact);
    const rest = list.filter((c) => !cityMatches(c.name, cyr).exact);
    return ex.concat(rest);
  };

  if (courier === 'econt') {
    if (!econtCitiesCache) {
      const d = await getJSON(`${WORKER}/econt/cities`);
      econtCitiesCache = (d.cities || []) as CityHit[];
    }
    return exactFirst(econtCitiesCache.filter((c) => cityMatches(c.name, cyr).prefix)).slice(0, 25);
  }

  const fetchSpeedy = async (name: string) => {
    const d = await getJSON(`${WORKER}/speedy/cities?name=${encodeURIComponent(name)}`);
    return (d.cities || []) as CityHit[];
  };

  // 1) Както е написано
  const first = await fetchSpeedy(cyr);
  if (first.length > 0) return first;

  // 2) Нищо не излезе → пробваме другите възможни изписвания (ъ/а/у, ия/иа, ю/иу)
  const variants = cityQueryVariants(cyr);
  if (variants.length === 0) return [];
  const lists = await Promise.all(variants.map((v) => fetchSpeedy(v).catch(() => [] as CityHit[])));
  const seen = new Set<string>();
  const merged: CityHit[] = [];
  for (const list of lists) {
    for (const c of list) {
      const key = String(c.id);
      if (seen.has(key) || !cityMatches(c.name, cyr).prefix) continue;
      seen.add(key);
      merged.push(c);
    }
  }
  return exactFirst(merged).slice(0, 25);
}

async function getOffices(courier: Courier, cityId: number | string): Promise<OfficeHit[]> {
  const key = `${courier}:${cityId}`;
  if (officesCache.has(key)) return officesCache.get(key)!;
  const param = courier === 'econt' ? `cityID=${cityId}` : `siteId=${cityId}`;
  const d = await getJSON(`${WORKER}/${courier}/offices?${param}`);
  const list = (d.offices || []) as OfficeHit[];
  officesCache.set(key, list);
  return list;
}

async function searchStreets(courier: Courier, cityId: number | string, raw: string): Promise<StreetHit[]> {
  const cyr = toCyrillic(raw.trim());
  if (cyr.length < 2) return [];
  const param = courier === 'econt' ? `cityID=${cityId}` : `siteId=${cityId}`;
  try {
    const d = await getJSON(`${WORKER}/${courier}/streets?${param}&name=${encodeURIComponent(cyr)}`);
    const list = (d.streets || []) as StreetHit[];
    // Ако името вече започва с типа (напр. "ул. Розова долина" + type "ул.") → махаме типа, за да не се дублира
    return list.map((s) => {
      const t = (s.type || '').trim();
      const n = (s.name || '').trim();
      if (t && n.toLowerCase().startsWith(t.toLowerCase())) {
        return { ...s, type: '', name: n };
      }
      return { ...s, name: n };
    });
  } catch {
    return [];
  }
}

async function searchQuarters(courier: Courier, cityId: number | string, raw: string): Promise<StreetHit[]> {
  const cyr = toCyrillic(raw.trim());
  if (cyr.length < 2) return [];
  const param = courier === 'econt' ? `cityID=${cityId}` : `siteId=${cityId}`;
  try {
    const d = await getJSON(`${WORKER}/${courier}/quarters?${param}&name=${encodeURIComponent(cyr)}`);
    const list = (d.quarters || []) as StreetHit[];
    return list.map((s) => {
      const n = (s.name || '').trim();
      // Чистим дублиран тип отпред (напр. "ж.к. Изток" + type "жк.")
      const nClean = n.replace(/^ж\.?\s*к\.?\s*/i, '').trim();
      return { ...s, type: 'жк.', name: nClean || n };
    });
  } catch {
    return [];
  }
}

// Обединено търсене: улици + квартали заедно, маркирани с kind
export interface AddressHit extends StreetHit { kind: 'street' | 'quarter'; }

async function searchStreetsAndQuarters(courier: Courier, cityId: number | string, raw: string): Promise<AddressHit[]> {
  const [streets, quarters] = await Promise.all([
    searchStreets(courier, cityId, raw),
    searchQuarters(courier, cityId, raw),
  ]);
  return [
    ...quarters.map((q) => ({ ...q, kind: 'quarter' as const })),
    ...streets.map((s) => ({ ...s, kind: 'street' as const })),
  ];
}

// ---------- Компонент ----------
export function CourierPicker({ onChange }: { onChange: (s: CourierSelection) => void }) {
  const [courier, setCourier] = useState<Courier>('speedy');            // Speedy по подразбиране
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('office'); // До офис по подразбиране

  const [cityQuery, setCityQuery] = useState('');
  const [cityHits, setCityHits] = useState<CityHit[]>([]);
  const [city, setCity] = useState<CityHit | null>(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearched, setCitySearched] = useState(false); // 🔧 приключило ли е търсенето за текущия текст
  const [cityFocused, setCityFocused] = useState(false);   // 🔧 курсорът в полето за град ли е
  const [cityNudge, setCityNudge] = useState(false);       // 🔧 клиентът е натиснал офис/улица без избран град

  const [offices, setOffices] = useState<OfficeHit[]>([]);
  const [office, setOffice] = useState<OfficeHit | null>(null);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);

  const [streetQuery, setStreetQuery] = useState('');
  const [streetHits, setStreetHits] = useState<AddressHit[]>([]);
  const [street, setStreet] = useState<AddressHit | null>(null);
  const [streetOpen, setStreetOpen] = useState(false);
  const [streetNo, setStreetNo] = useState('');
  const [streetSearched, setStreetSearched] = useState(false); // търсили ли сме вече за текущия текст
  const [manualStreet, setManualStreet] = useState(false);     // 🔧 ръчен вход, ако улицата я няма

  const [note, setNote] = useState('');

  const cityBoxRef = useRef<HTMLDivElement>(null);
  const officeBoxRef = useRef<HTMLDivElement>(null);
  const streetBoxRef = useRef<HTMLDivElement>(null);

  // 🔧 помощни за полето за град
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityFocusedRef = useRef(false);
  const cityListPressRef = useRef(false); // в момента натиска ред от списъка
  const cityStateRef = useRef({ city, cityHits, cityQuery, citySearched });
  cityStateRef.current = { city, cityHits, cityQuery, citySearched };

  const focusCityInput = () => setTimeout(() => cityInputRef.current?.focus(), 60);

  // Клиентът натиска „офис“ или „улица“, без да е избрал град → водим го обратно в полето за град
  const nudgeCity = () => {
    setCityNudge(true);
    const el = cityInputRef.current;
    if (el) {
      el.focus();
      try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch { /* стари браузъри */ }
    }
    if (cityHits.length > 0) setCityOpen(true);
  };

  // Излизане от полето за град: ако е ясно кой град е — избираме го; иначе показваме предупреждение
  const handleCityBlur = () => {
    cityFocusedRef.current = false;
    setTimeout(() => {
      if (cityFocusedRef.current) return;      // върнал се е в полето
      setCityFocused(false);
      if (cityListPressRef.current) return;    // точно натиска ред от списъка
      const st = cityStateRef.current;
      if (st.city || !st.citySearched) return; // търсенето още върви → то ще реши само
      const pick = pickCityAuto(st.cityHits, st.cityQuery, false);
      if (pick) { setCity(pick); setCityOpen(false); }
    }, 180);
  };

  const focusStreetNo = () => setTimeout(() => document.getElementById('street-no')?.focus(), 60);
  const focusStreetInput = () => setTimeout(() => document.getElementById('street-input')?.focus(), 60);

  // Смяна на куриер → нулираме всичко надолу (типът остава "office")
  useEffect(() => {
    setCityQuery(''); setCity(null); setCityHits([]);
    setCitySearched(false); setCityNudge(false);
    setOffices([]); setOffice(null); setOfficeOpen(false);
    setStreetQuery(''); setStreet(null); setStreetNo('');
    setStreetHits([]); setStreetSearched(false); setManualStreet(false);
  }, [courier]);

  // Смяна на тип → нулираме избора надолу (пазим града)
  useEffect(() => {
    setOffice(null); setOfficeOpen(false);
    setStreet(null); setStreetQuery(''); setStreetNo('');
    setStreetHits([]); setStreetSearched(false); setManualStreet(false);
  }, [deliveryType]);

  // 🔧 5. Смяна на града → улицата от стария град става невалидна
  useEffect(() => {
    setStreet(null); setStreetQuery(''); setStreetHits([]);
    setStreetSearched(false); setManualStreet(false);
  }, [city]);

  // Търсене на град (debounce 300ms)
  useEffect(() => {
    if (city) return;
    const q = cityQuery;
    setCitySearched(false);
    if (toCyrillic(cleanCityInput(q)).length < 2) { setCityHits([]); setCityLoading(false); return; }
    setCityLoading(true);
    let alive = true; // 🔧 по-стар отговор не може да презапише по-нов
    const t = setTimeout(async () => {
      let hits: CityHit[] = [];
      try { hits = await searchCities(courier, q); } catch { hits = []; }
      if (!alive) return;
      setCityHits(hits);
      setCitySearched(true);
      setCityLoading(false);
      // 🔧 ако е ясно кой град е — избираме го автоматично
      const pick = pickCityAuto(hits, q, cityFocusedRef.current);
      if (pick) { setCity(pick); setCityOpen(false); }
      else if (cityFocusedRef.current) setCityOpen(true);
    }, 300);
    return () => { alive = false; clearTimeout(t); };
  }, [cityQuery, courier, city]);

  // Избран град + тип офис → зареждаме офисите
  useEffect(() => {
    if (!city || deliveryType !== 'office') return;
    setOfficesLoading(true);
    setOfficeOpen(true);
    getOffices(courier, city.id)
      .then(setOffices)
      .catch(() => setOffices([]))
      .finally(() => setOfficesLoading(false));
  }, [courier, city, deliveryType]);

  // Търсене на улица + квартал (debounce 300ms)
  useEffect(() => {
    if (!city || deliveryType !== 'address' || street || manualStreet) return;
    const q = streetQuery;
    setStreetSearched(false);
    if (toCyrillic(q.trim()).length < 2) { setStreetHits([]); return; }
    const t = setTimeout(async () => {
      try { setStreetHits(await searchStreetsAndQuarters(courier, city.id, q)); setStreetOpen(true); }
      catch { setStreetHits([]); }
      finally { setStreetSearched(true); }
    }, 300);
    return () => clearTimeout(t);
  }, [streetQuery, courier, city, deliveryType, street, manualStreet]);

  // Затваряне на падащите при клик навън
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) setCityOpen(false);
      if (officeBoxRef.current && !officeBoxRef.current.contains(e.target as Node)) setOfficeOpen(false);
      if (streetBoxRef.current && !streetBoxRef.current.contains(e.target as Node)) setStreetOpen(false);
    };
    const up = () => setTimeout(() => { cityListPressRef.current = false; }, 0);
    document.addEventListener('mousedown', h);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
    };
  }, []);

  // Емит нагоре при всяка промяна
  useEffect(() => {
    // 🔧 4. Ръчно въведената улица е също толкова валидна, колкото избраната от списъка
    const manualOk = manualStreet && streetQuery.trim().length >= 3;
    const streetFull = street
      ? `${street.type} ${street.name}`.trim()
      : (manualOk ? streetQuery.trim() : '');

    let fullAddress = '';
    if (deliveryType === 'office' && office) {
      fullAddress = `Офис ${office.name} — ${office.address}, ${office.city} ${office.postCode}`;
    } else if (deliveryType === 'address' && streetFull && streetNo.trim()) {
      fullAddress = `${streetFull} №${streetNo}, ${city?.name || ''} ${city?.postCode || ''}`.trim();
      if (manualOk) fullAddress += ' (ръчно въведен адрес — да се потвърди по телефон)';
    }

    const isComplete =
      !!city &&
      ((deliveryType === 'office' && !!office) ||
       (deliveryType === 'address' && !!streetFull && streetNo.trim() !== ''));

    onChange({
      courier,
      deliveryType,
      cityId: city?.id ?? null,
      cityName: city?.name ?? '',
      region: city?.region ?? '',
      postCode: (office?.postCode || city?.postCode || '') as string,
      officeId: office?.id ?? null,
      officeName: office?.name ?? '',
      isAutomat: office?.isAutomat ?? false,
      streetId: street?.id ?? null,
      streetName: streetFull,
      streetNo,
      note,
      fullAddress,
      isComplete,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courier, deliveryType, city, office, street, streetQuery, manualStreet, streetNo, note]);


  // 🔧 Състояния на полето за град
  const cityTyped = !city && toCyrillic(cleanCityInput(cityQuery)).length >= 2;
  const cityNoHits = cityTyped && citySearched && !cityLoading && cityHits.length === 0;
  const cityNeedsPick = cityTyped && citySearched && cityHits.length > 0;
  const cityWarn = !city && ((cityNudge && !cityTyped) || cityNoHits || (cityNeedsPick && !cityFocused));

  // ---------- UI ----------
  return (
    <div className="space-y-4 min-w-0 w-full">
      {/* Куриер */}
      <div>
        <label className="text-amber-900 text-sm font-bold mb-2 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-amber-600" /> Изберете куриер <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <CourierCard active={courier === 'speedy'} onClick={() => setCourier('speedy')} emoji="🚚" label="Speedy" />
          <CourierCard active={courier === 'econt'} onClick={() => setCourier('econt')} emoji="📦" label="ЕКОНТ" />
        </div>
      </div>

      {/* Тип доставка */}
      <div>
        <label className="text-amber-900 text-sm font-bold mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-600" /> Начин на доставка <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <TypeCard active={deliveryType === 'office'} onClick={() => setDeliveryType('office')} icon={<Building2 className="w-5 h-5" />} label="До офис" />
          <TypeCard active={deliveryType === 'address'} onClick={() => setDeliveryType('address')} icon={<Home className="w-5 h-5" />} label="До адрес" />
        </div>
      </div>

      {/* Град с автокомплийт — ВИНАГИ видим */}
      <div ref={cityBoxRef} className="relative">
        <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-600" /> Населено място <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          {city ? (
            <button
              type="button"
              onClick={() => { setCity(null); setOffice(null); setCityQuery(''); focusCityInput(); }}
              title={`${city.name} (${city.region}) — ${city.postCode}`}
              className="w-full min-w-0 flex items-center justify-between gap-2 bg-white border border-emerald-300 ring-2 ring-emerald-400 h-12 text-base rounded-xl px-3 shadow-sm outline-none text-left"
            >
              <span className="text-slate-800 font-medium truncate min-w-0">{city.name} ({city.region}) — {city.postCode}</span>
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </button>
          ) : (
            <>
              <input
                id="city-input"
                ref={cityInputRef}
                value={cityQuery}
                onChange={(e) => { setCity(null); setOffice(null); setCityNudge(false); setCityQuery(e.target.value); }}
                onFocus={() => { cityFocusedRef.current = true; setCityFocused(true); if (cityHits.length > 0) setCityOpen(true); }}
                onBlur={handleCityBlur}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  e.preventDefault(); // 🔧 Enter в това поле не изпраща поръчката
                  const pick = pickCityAuto(cityHits, cityQuery, false);
                  if (pick) { setCity(pick); setCityOpen(false); }
                }}
                placeholder="Напишете град или село"
                autoComplete="new-password"
                className={`w-full min-w-0 bg-white h-12 text-base rounded-xl px-3 pr-9 focus:ring-2 shadow-sm outline-none ${
                  cityWarn
                    ? 'border border-red-300 ring-2 ring-red-200 focus:ring-red-300 focus:border-red-300'
                    : 'border border-amber-200 focus:ring-amber-500 focus:border-amber-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                {cityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </span>
            </>
          )}
        </div>

        {cityOpen && !city && cityHits.length > 0 && (
          <ul
            onPointerDown={() => { cityListPressRef.current = true; }}
            className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-amber-200 bg-white shadow-xl"
          >
            {cityHits.map((c) => (
              <li key={`${c.id}`}>
                <button
                  type="button"
                  onClick={() => { cityListPressRef.current = false; setCity(c); setCityOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center justify-between gap-2"
                >
                  <span className="font-medium text-slate-800">{c.name} <span className="text-slate-400 text-sm">({c.region})</span></span>
                  <span className="text-xs text-slate-400">{c.postCode}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 🔧 Подсказки под полето за град — клиентът винаги знае какво се очаква */}
        {!city && (
          cityNudge && !cityTyped ? (
            <p className="text-[11px] text-red-500 font-bold mt-1 ml-1 leading-snug">
              ⚠️ Първо напишете населеното място тук и го изберете от списъка.
            </p>
          ) : cityNoHits ? (
            <p className="text-[11px] text-red-500 font-bold mt-1 ml-1 leading-snug">
              Не намираме такова населено място. Проверете изписването или напишете само първите 3–4 букви и изберете от списъка.
            </p>
          ) : cityNeedsPick ? (
            cityFocused ? (
              <p className="text-[11px] text-amber-700 font-semibold mt-1 ml-1 leading-snug">
                👇 Изберете населеното място от списъка.
              </p>
            ) : (
              <p className="text-[11px] text-red-500 font-bold mt-1 ml-1 leading-snug">
                ⚠️ Изберете населеното място от списъка — само писането не е достатъчно. Натиснете полето, за да се покаже списъкът.
              </p>
            )
          ) : (
            <p className="text-[11px] text-slate-400 font-normal italic mt-1 ml-1 leading-tight">
              Напишете първите 2–3 букви и изберете от списъка (може и на латиница).
            </p>
          )
        )}
      </div>

      {/* До офис → поле за офис (ВИНАГИ видимо, отваря се като падащо) */}
      {deliveryType === 'office' && (
        <div ref={officeBoxRef} className="relative">
          <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-600" /> Изберете офис <span className="text-red-500">*</span>
          </label>

          <button
            id="office-input"
            type="button"
            // 🔧 без избран град не „мълчи“, а връща клиента в полето за град
            onClick={() => { if (!city) { nudgeCity(); return; } setOfficeOpen((v) => !v); }}
            title={office ? office.name : ''}
            className={`w-full min-w-0 flex items-center justify-between gap-2 bg-white border border-amber-200 h-12 text-base rounded-xl px-3 shadow-sm outline-none text-left ${
              !city ? 'opacity-60' : 'hover:border-amber-300'
            } ${office ? 'ring-2 ring-emerald-400 border-emerald-300' : ''}`}
          >
            <span className={`min-w-0 truncate ${office ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
              {office ? office.name : (city ? 'Изберете офис от списъка' : 'Първо изберете населено място')}
            </span>
            {office ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
          </button>

          {officeOpen && city && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-amber-200 bg-white shadow-xl overflow-hidden">
              {officesLoading ? (
                <p className="text-sm text-slate-400 flex items-center gap-2 px-4 py-3"><Loader2 className="w-4 h-4 animate-spin" /> Зареждане на офисите…</p>
              ) : offices.length === 0 ? (
                <p className="text-sm text-slate-400 px-4 py-3">Няма намерени офиси за този град.</p>
              ) : (
                <ul className="max-h-64 overflow-y-auto divide-y divide-amber-50">
                  {offices.map((o) => (
                    <li key={`${o.id}`}>
                      <button
                        type="button"
                        onClick={() => { setOffice(o); setOfficeOpen(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-amber-50 flex flex-col ${office?.id === o.id ? 'bg-emerald-50' : ''}`}
                      >
                        <span className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                          {o.name} {o.isAutomat && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">автомат</span>}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">{o.address}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* До адрес → улица (автокомплийт) + номер на ръка */}
      {deliveryType === 'address' && (
        <div className="space-y-4">
          <div ref={streetBoxRef} className="relative">

            <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-amber-600" /> Улица или квартал <span className="text-red-500">*</span>
            </label>

            {street ? (
              // 🔧 1. ЗАКЛЮЧЕНО поле — в него НЕ може да се пише.
              // Клик = изчистване и ново търсене (точно както при града).
              <button
                type="button"
                onClick={() => { setStreet(null); setStreetQuery(''); setStreetHits([]); setStreetOpen(false); focusStreetInput(); }}
                title="Натиснете, за да изберете друга улица"
                className="w-full min-w-0 flex items-center justify-between gap-2 bg-white border border-emerald-300 ring-2 ring-emerald-400 h-12 text-base rounded-xl px-3 shadow-sm outline-none text-left"
              >
                <span className="text-slate-800 font-medium truncate min-w-0">{street.type} {street.name}</span>
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </button>
            ) : (
              <div className="relative">
                <input
                  id="street-input"
                  value={streetQuery}
                  readOnly={!city}
                  onChange={(e) => setStreetQuery(e.target.value)}
                  onFocus={() => {
                    if (!city) { nudgeCity(); return; } // 🔧 няма град → обратно в полето за град
                    if (!manualStreet && streetHits.length > 0) setStreetOpen(true);
                  }}
                  placeholder={
                    !city ? 'Първо изберете населено място'
                    : manualStreet ? 'Напишете улица/квартал (само името, без номер)'
                    : 'Улица или квартал (напр. Ivan, Mladost)'
                  }
                  autoComplete="new-password"
                  className={`w-full min-w-0 truncate bg-white h-12 text-base rounded-xl px-3 pr-9 shadow-sm outline-none focus:ring-2 ${
                    !city ? 'opacity-60 border border-amber-200'
                    : manualStreet ? 'border border-blue-300 ring-2 ring-blue-200 focus:ring-blue-400 focus:border-blue-400'
                    : streetSearched && streetQuery.trim().length >= 2
                      ? 'border border-red-300 ring-2 ring-red-200 focus:ring-red-300 focus:border-red-300'
                      : 'border border-amber-200 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
              </div>
            )}

            {streetOpen && !street && !manualStreet && streetHits.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-amber-200 bg-white shadow-xl">
                {streetHits.map((s) => (
                  <li key={`${s.kind}-${s.id}`}>
                    <button
                      type="button"
                      // 🔧 2. След избор фокусът сам отива на полето за номер
                      onClick={() => { setStreet(s); setStreetOpen(false); setStreetHits([]); focusStreetNo(); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50 min-w-0"
                    >
                      <span className="font-medium text-slate-800 truncate block min-w-0">{s.type} {s.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* ---- Подсказки под полето ---- */}
            {street ? (
              <p className="text-[11px] text-emerald-600 font-bold mt-1 ml-1 leading-snug">
                ✓ Улицата е избрана. Напишете номера/блока в полето по-долу 👇
              </p>
            ) : manualStreet ? (
              <p className="text-[11px] text-blue-700 font-semibold mt-1 ml-1 leading-snug">
                Пишете ръчно — ще потвърдим адреса по телефона.{' '}
                <button
                  type="button"
                  onClick={() => { setManualStreet(false); setStreetQuery(''); setStreetHits([]); focusStreetInput(); }}
                  className="underline font-bold"
                >
                  Върни търсенето
                </button>
              </p>
            ) : streetHits.length > 0 ? (
              // 🔧 3. Пише, има резултати, но не е избрал нищо
              <p className="text-[11px] text-red-500 font-bold mt-1 ml-1 leading-snug">
                ⚠️ Изберете улицата от списъка — само писането не е достатъчно.
              </p>
            ) : streetSearched && streetQuery.trim().length >= 2 ? (
              // 🔧 4. Няма намерена улица → ръчен вход, за да не изгубим поръчката
              <p className="text-[11px] text-amber-700 font-semibold mt-1 ml-1 leading-snug">
                Няма намерена улица с това име. Проверете изписването или{' '}
                <button
                  type="button"
                  onClick={() => { setManualStreet(true); setStreetHits([]); setStreetOpen(false); focusStreetInput(); }}
                  className="underline font-bold text-emerald-700"
                >
                  напишете адреса ръчно
                </button>.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 font-normal italic mt-1 ml-1 leading-tight">
                Напишете 2–3 букви и изберете от списъка. Номерът се пише в полето отдолу.
              </p>
            )}

          </div>

          <div>
            <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" /> № / блок / вход / ап. <span className="text-red-500">*</span>
            </label>
            <input
              id="street-no"
              value={streetNo}
              readOnly={!city}
              onFocus={() => { if (!city) nudgeCity(); }}
              onChange={(e) => setStreetNo(e.target.value)}
              placeholder="напр. 12, бл. 3, вх. Б, ап. 15"
              autoComplete="new-password"
              className={`w-full bg-white border border-amber-200 h-12 text-base rounded-xl px-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm outline-none ${!city ? 'opacity-60' : ''}`}
            />
          </div>
        </div>
      )}

      {/* Допълнителна информация */}
      <div>
        <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-600" /> Допълнителна информация за доставката
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Специфични указания за куриера (по желание)"
          className="w-full bg-white border border-amber-200 text-base rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm outline-none resize-none"
        />
      </div>
    </div>
  );
}

// ---------- Малки под-компоненти ----------
function CourierCard({ active, onClick, emoji, label }: { active: boolean; onClick: () => void; emoji: string; label: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
        active ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/40 scale-[1.02]' : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
      }`}
    >
      {active && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-300 animate-in">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
      <span className="text-2xl">{emoji}</span>
      <span className={`font-bold text-sm ${active ? 'text-amber-900' : ''}`}>{label}</span>
    </button>
  );
}

function TypeCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 transition-all duration-300 ${
        active ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/40 text-amber-900 scale-[1.02]' : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
      }`}
    >
      {active && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-300">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
