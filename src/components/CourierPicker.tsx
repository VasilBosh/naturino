// src/components/CourierPicker.tsx
// Самостоятелен избор на доставка: куриер → офис/адрес → град (с автокомплийт и
// транслитерация лат→кир) → офис ИЛИ улица+номер → бележка.
// Зависи само от React + lucide-react. Един файл, копира се между фунии.

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
  ['ya', 'я'], ['yu', 'ю'], ['ay', 'ай'],
  ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', 'г'], ['d', 'д'], ['e', 'е'],
  ['z', 'з'], ['i', 'и'], ['y', 'й'], ['k', 'к'], ['l', 'л'], ['m', 'м'],
  ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'], ['s', 'с'], ['t', 'т'],
  ['u', 'у'], ['f', 'ф'], ['h', 'х'], ['c', 'ц'], ['j', 'ж'], ['w', 'в'], ['x', 'х'], ['q', 'я'],
];

function translit(input: string): string {
  let s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
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

// ---------- Тръба към Worker-а (с кеш) ----------
let econtCitiesCache: CityHit[] | null = null;
const officesCache = new Map<string, OfficeHit[]>();

async function getJSON(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

async function searchCities(courier: Courier, raw: string): Promise<CityHit[]> {
  const cyr = toCyrillic(raw.trim());
  if (cyr.length < 2) return [];
  const pref = cyr.toLowerCase();

  if (courier === 'econt') {
    if (!econtCitiesCache) {
      const d = await getJSON(`${WORKER}/econt/cities`);
      econtCitiesCache = (d.cities || []) as CityHit[];
    }
    return econtCitiesCache
      .filter((c) => c.name.toLowerCase().startsWith(pref) || c.name.toLowerCase().startsWith(raw.trim().toLowerCase()))
      .slice(0, 25);
  }
  const d = await getJSON(`${WORKER}/speedy/cities?name=${encodeURIComponent(cyr)}`);
  return (d.cities || []) as CityHit[];
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

  const [offices, setOffices] = useState<OfficeHit[]>([]);
  const [office, setOffice] = useState<OfficeHit | null>(null);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officeOpen, setOfficeOpen] = useState(false);

  const [streetQuery, setStreetQuery] = useState('');
  const [streetHits, setStreetHits] = useState<AddressHit[]>([]);
  const [street, setStreet] = useState<AddressHit | null>(null);
  const [streetOpen, setStreetOpen] = useState(false);
  const [streetNo, setStreetNo] = useState('');

  const [note, setNote] = useState('');

  const cityBoxRef = useRef<HTMLDivElement>(null);
  const officeBoxRef = useRef<HTMLDivElement>(null);
  const streetBoxRef = useRef<HTMLDivElement>(null);

  // Смяна на куриер → нулираме всичко надолу (типът остава "office")
  useEffect(() => {
    setCityQuery(''); setCity(null); setCityHits([]);
    setOffices([]); setOffice(null); setOfficeOpen(false);
    setStreetQuery(''); setStreet(null); setStreetNo('');
  }, [courier]);

  // Смяна на тип → нулираме избора надолу (пазим града)
  useEffect(() => {
    setOffice(null); setOfficeOpen(false);
    setStreet(null); setStreetQuery(''); setStreetNo('');
  }, [deliveryType]);

  // Търсене на град (debounce 300ms)
  useEffect(() => {
    if (city) return;
    const q = cityQuery;
    if (toCyrillic(q.trim()).length < 2) { setCityHits([]); return; }
    setCityLoading(true);
    const t = setTimeout(async () => {
      try { setCityHits(await searchCities(courier, q)); setCityOpen(true); }
      catch { setCityHits([]); }
      finally { setCityLoading(false); }
    }, 300);
    return () => clearTimeout(t);
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
    if (!city || deliveryType !== 'address' || street) return;
    const q = streetQuery;
    if (toCyrillic(q.trim()).length < 2) { setStreetHits([]); return; }
    const t = setTimeout(async () => {
      try { setStreetHits(await searchStreetsAndQuarters(courier, city.id, q)); setStreetOpen(true); }
      catch { setStreetHits([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [streetQuery, courier, city, deliveryType, street]);

  // Затваряне на падащите при клик навън
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) setCityOpen(false);
      if (officeBoxRef.current && !officeBoxRef.current.contains(e.target as Node)) setOfficeOpen(false);
      if (streetBoxRef.current && !streetBoxRef.current.contains(e.target as Node)) setStreetOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Емит нагоре при всяка промяна
  useEffect(() => {
    const streetFull = street ? `${street.type} ${street.name}`.trim() : '';
    let fullAddress = '';
    if (deliveryType === 'office' && office) {
      fullAddress = `Офис ${office.name} — ${office.address}, ${office.city} ${office.postCode}`;
    } else if (deliveryType === 'address' && street && streetNo) {
      fullAddress = `${streetFull} №${streetNo}, ${city?.name || ''} ${city?.postCode || ''}`.trim();
    }
    const isComplete =
      !!city &&
      ((deliveryType === 'office' && !!office) ||
       (deliveryType === 'address' && !!street && streetNo.trim() !== ''));

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
  }, [courier, deliveryType, city, office, street, streetNo, note]);


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
              onClick={() => { setCity(null); setOffice(null); setCityQuery(''); }}
              title={`${city.name} (${city.region}) — ${city.postCode}`}
              className="w-full min-w-0 flex items-center justify-between gap-2 bg-white border border-emerald-300 ring-2 ring-emerald-400 h-12 text-base rounded-xl px-3 shadow-sm outline-none text-left"
            >
              <span className="text-slate-800 font-medium truncate min-w-0">{city.name} ({city.region}) — {city.postCode}</span>
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </button>
          ) : (
            <>
              <input
                value={cityQuery}
                onChange={(e) => { setCity(null); setOffice(null); setCityQuery(e.target.value); }}
                onFocus={() => cityHits.length && setCityOpen(true)}
                placeholder="Напишете град или село"
                autoComplete="new-password"
                className="w-full min-w-0 bg-white border border-amber-200 h-12 text-base rounded-xl px-3 pr-9 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                {cityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </span>
            </>
          )}
        </div>

        {cityOpen && !city && cityHits.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-amber-200 bg-white shadow-xl">
            {cityHits.map((c) => (
              <li key={`${c.id}`}>
                <button
                  type="button"
                  onClick={() => { setCity(c); setCityOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 flex items-center justify-between gap-2"
                >
                  <span className="font-medium text-slate-800">{c.name} <span className="text-slate-400 text-sm">({c.region})</span></span>
                  <span className="text-xs text-slate-400">{c.postCode}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* До офис → поле за офис (ВИНАГИ видимо, отваря се като падащо) */}
      {deliveryType === 'office' && (
        <div ref={officeBoxRef} className="relative">
          <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-600" /> Изберете офис <span className="text-red-500">*</span>
          </label>
         
          <button
            type="button"
            disabled={!city}
            onClick={() => setOfficeOpen((v) => !v)}
            title={office ? office.name : ''}
            className={`w-full min-w-0 flex items-center justify-between gap-2 bg-white border border-amber-200 h-12 text-base rounded-xl px-3 shadow-sm outline-none text-left ${
              !city ? 'opacity-60 cursor-not-allowed' : 'hover:border-amber-300'
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

            <div className="relative">
              <input
                value={street ? `${street.type} ${street.name}` : streetQuery}
                disabled={!city}
                onChange={(e) => { if (street) setStreet(null); setStreetQuery(e.target.value); }}
                onFocus={() => streetHits.length && setStreetOpen(true)}
                placeholder={city ? 'Улица или квартал (напр. Ivan, Mladost)' : 'Първо изберете населено място'}
                autoComplete="new-password"
                className={`w-full min-w-0 truncate bg-white border border-amber-200 h-12 text-base rounded-xl px-3 pr-9 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm outline-none ${!city ? 'opacity-60' : ''}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500">
                {street ? <Check className="w-4 h-4 text-emerald-500" /> : <Search className="w-4 h-4" />}
              </span>
            </div>
            
            {streetOpen && !street && streetHits.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-amber-200 bg-white shadow-xl">
                {streetHits.map((s) => (
                  <li key={`${s.kind}-${s.id}`}>
                    <button type="button" onClick={() => { setStreet(s); setStreetOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-amber-50 min-w-0">
                      <span className="font-medium text-slate-800 truncate block min-w-0">{s.type} {s.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>

          <div>
            <label className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" /> № / блок / вход / ап. <span className="text-red-500">*</span>
            </label>
            <input
              value={streetNo}
              disabled={!city}
              onChange={(e) => setStreetNo(e.target.value)}
              placeholder="напр. ул.№ , бл. , вх. , ап. "
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