import ReactPixel from 'react-facebook-pixel';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Phone, User, Check, Truck, Shield, Mail, Package, ArrowRight, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpsellFlow } from './UpsellFlow';
import { CourierPicker, type CourierSelection } from '../components/CourierPicker';

/* ============================================================================
   ПАКЕТНИ ОФЕРТИ (заместват стария брояч за количество и промокода)
   1 бр = 23,90 € · 2 бр = 45,90 € · 3 бр = 64,90 € · 4 бр = 84,90 €
   Изборът е ТВЪРД (една карта), сумата се смята директно от пакета.
   ========================================================================== */
type Pkg = { qty: number; total: number };

const eur = (n: number) => n.toFixed(2).replace('.', ',');

// Пълни class низове по тема (Tailwind purge иска литерали, затова са изписани цели)
const THEMES: Record<string, {
  stripe: string; badge: string; badgeText: string; price: string;
  light: string; ic: string; btn: string; glow: string; ring: string;
}> = {
  sky: {
    stripe: 'from-sky-600 to-sky-400', badge: 'from-sky-600 to-sky-400', badgeText: 'text-white',
    price: 'text-slate-900', light: 'bg-sky-50', ic: 'bg-sky-100 text-sky-700',
    btn: 'from-sky-600 to-sky-400', glow: 'shadow-sky-500/40', ring: 'ring-sky-500',
  },
  amber: {
    stripe: 'from-amber-500 to-amber-300', badge: 'from-amber-500 to-amber-300', badgeText: 'text-amber-950',
    price: 'text-slate-900', light: 'bg-amber-50', ic: 'bg-amber-100 text-amber-700',
    btn: 'from-amber-500 to-amber-300', glow: 'shadow-amber-500/40', ring: 'ring-amber-500',
  },
  emerald: {
    stripe: 'from-emerald-600 to-emerald-400', badge: 'from-emerald-600 to-emerald-400', badgeText: 'text-white',
    price: 'text-emerald-700', light: 'bg-emerald-50', ic: 'bg-emerald-100 text-emerald-700',
    btn: 'from-emerald-600 to-emerald-400', glow: 'shadow-emerald-500/50', ring: 'ring-emerald-500',
  },
  rose: {
    stripe: 'from-rose-600 to-rose-400', badge: 'from-rose-600 to-rose-400', badgeText: 'text-white',
    price: 'text-slate-900', light: 'bg-rose-50', ic: 'bg-rose-100 text-rose-700',
    btn: 'from-rose-600 to-rose-400', glow: 'shadow-rose-500/40', ring: 'ring-rose-500',
  },
};

const PACKAGES = [
  {
    qty: 1, total: 23.90, theme: 'sky', badge: 'Стартов', sub: 'за деца 18м+', save: 0,
    img: '/offers/pack-1.png', emoji: '🧴',
    supply: <><span className="font-black text-sky-700">Пълни 20 дни</span> защита за едно дете — идеална за първо запознаване с продукта.</>,
    feats: ['100% натурален билков екстракт', 'Плащаш при получаване'],
  },
  {
    qty: 2, total: 45.90, theme: 'emerald', badge: 'По-изгоден', sub: 'за деца 18м+', save: 1.90,
    img: '/offers/pack-2.png', emoji: '🧴🧴',
    supply: <><span className="font-black text-emerald-700">Месец и половина</span> без прекъсване за едно дете — без притеснение, че ще свърши.</>,
    feats: ['По-ниска цена на брой', 'Плащаш при получаване'],
  },
  {
    qty: 3, total: 64.90, theme: 'amber', badge: 'Най-предпочитан', sub: 'Избор №1 на мамите', save: 6.80, featured: true,
    img: '/offers/pack-3.png', emoji: '🧴🧴🧴',
    supply: <><span className="font-black text-amber-700">Пълен 2-месечен курс</span> за едно дете — точно колкото трябва за истински, устойчив резултат.</>,
    feats: ['Най-балансирана цена и количество', 'Пълна имунна подкрепа', 'Плащаш при получаване'],
  },
  {
    qty: 4, total: 84.90, theme: 'rose', badge: 'Най-добра стойност', sub: 'за 2 деца · семеен пакет', save: 10.70,
    img: '/offers/pack-4.png', emoji: '🧴🧴🧴🧴',
    supply: <><span className="font-black text-rose-700">За две деца едновременно</span> — по месец и половина на всяко. Най-ниска цена на брой.</>,
    feats: ['Най-ниска цена на опаковка', 'Достатъчно за цялото семейство', 'Плащаш при получаване'],
  },
] as const;

/* Продуктова снимка със сигурен fallback към емоджи (сложи файловете в public/offers/) */
function PackImg({ src, emoji, theme }: { src: string; emoji: string; theme: string }) {
  const [failed, setFailed] = useState(false);
  const t = THEMES[theme];
  return (
    <div className={`flex-shrink-0 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] lg:w-[110px] lg:h-[110px] rounded-2xl ${t.light} overflow-hidden flex items-center justify-center`}>
      {!failed && src ? (
        <img src={src} alt="" onError={() => setFailed(true)} className="w-full h-full object-contain" />
      ) : (
        <span className="text-2xl tracking-tighter">{emoji}</span>
      )}
    </div>
  );
}

/* Секцията с 4-те карти */
function OfferCards({ selected, onSelect }: { selected: Pkg | null; onSelect: (p: Pkg) => void }) {
  return (
    <>
      {/* локални keyframes за пулса и проблясъка на водещата карта */}
      <style>{`
        @keyframes nkPulse{0%,100%{box-shadow:0 34px 64px -26px rgba(217,119,6,.45),0 0 0 0 rgba(217,119,6,.42)}50%{box-shadow:0 34px 64px -26px rgba(217,119,6,.45),0 0 0 10px rgba(217,119,6,0)}}
        .nk-pulse{animation:nkPulse 2.6s ease-in-out infinite}
        @keyframes nkSweep{0%{left:-60%}55%{left:130%}100%{left:130%}}
        .nk-shimmer::before{content:"";position:absolute;top:0;bottom:0;width:38%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:nkSweep 2.8s infinite}
      `}</style>

      <div id="offer-cards" className="max-w-6xl mx-auto scroll-mt-24">
        <div className="text-center mb-8 md:mb-10">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight max-w-3xl mx-auto">
            Спри безкрайния цикъл на боледуване <span className="text-emerald-600">един път завинаги!</span> Вземи най-добрия пакет за твоето дете и му подари здраве още днес.
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
          {PACKAGES.map((p) => {
            const t = THEMES[p.theme];
            const isSel = selected?.qty === p.qty;
            const featured = 'featured' in p && p.featured;
            return (
              <button
                key={p.qty}
                type="button"
                onClick={() => onSelect({ qty: p.qty, total: p.total })}
                aria-pressed={isSel}
                className={[
                  'relative text-left bg-white rounded-3xl p-5 pt-6 flex flex-col transition-all duration-200 outline-none',
                  'border-2 hover:-translate-y-1',
                  featured ? 'border-amber-500 bg-gradient-to-b from-amber-50 to-white lg:scale-[1.04] z-10 nk-pulse !p-0' : 'border-slate-100 shadow-lg shadow-slate-900/5',
                  isSel && !featured ? `${t.ring} ring-2 border-transparent` : '',
                ].join(' ')}
              >
                {/* Лента за водещата карта */}
                {featured && (
                  <div className="relative overflow-hidden nk-shimmer flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 text-white font-black text-xs uppercase tracking-wide py-3 px-2 rounded-t-3xl">
                    <span className="text-[15px]">👑</span> Най-предпочитан · Хит №1 <span className="text-[15px]">🔥</span>
                  </div>
                )}

                <div className={featured ? 'p-5 pt-4 flex flex-col flex-1' : 'contents'}>
                  {/* Значка (не за водещата — тя има лента) */}
                  {!featured && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r ${t.badge} ${t.badgeText} text-[11px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg`}>
                      {p.qty === 4 ? '★ ' : ''}{p.badge}
                    </span>
                  )}

                  <div className={`font-black text-slate-900 ${featured ? 'text-lg' : 'text-base'} mt-1`}>{p.qty} {p.qty === 1 ? 'опаковка' : 'опаковки'}</div>
                  <div className={`text-xs font-bold ${featured ? 'text-amber-600' : 'text-slate-500'} mb-2`}>{p.sub}</div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-end gap-1">
                        <span className={`text-[32px] leading-none font-black ${featured ? 'text-amber-600' : 'text-slate-900'}`}>{eur(p.total)}</span>
                        <span className="text-base font-black text-slate-600 pb-0.5">€</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold mt-1">Цена с вкл. ДДС</div>
                      <div className="text-xs text-slate-500 font-semibold mt-1.5">
                        {p.save > 0 && <span className="line-through text-slate-300 mr-1">23,90</span>}
                        <span className={featured ? 'text-amber-600 font-bold' : 'font-bold'}>{eur(p.total / p.qty)} € / брой</span>
                      </div>
                    </div>
                    <PackImg src={p.img} emoji={p.emoji} theme={p.theme} />
                  </div>

                  {p.save > 0 ? (
                    <span className="inline-flex items-center gap-1 self-start mt-3 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black px-2.5 py-1 rounded-full">
                      💚 Спестяваш {eur(p.save)} €
                    </span>
                  ) : (
                    <span className="mt-3 h-[26px]" aria-hidden />
                  )}

                  <div className={`mt-3 ${t.light} rounded-2xl p-3 text-[12.5px] text-slate-700 font-semibold leading-snug`}>
                    {p.supply}
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5 flex-1">
                    {p.feats.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-[12.5px] text-slate-600 font-semibold">
                        <span className={`w-[18px] h-[18px] rounded-md ${t.ic} flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5`}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* KILLER бутон */}
                  <div className={[
                    'relative overflow-hidden nk-shimmer mt-4 w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wide text-center flex items-center justify-center gap-2 transition-all',
                    isSel
                      ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/40'
                      : `bg-gradient-to-r ${t.btn} ${t.badgeText} shadow-lg ${t.glow}`,
                  ].join(' ')}>
                    {isSel ? '✓ Избран пакет' : <>Избери пакета <span>→</span></>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function Checkout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedPkg, setSelectedPkg] = useState<Pkg | null>(null);
  const [pkgError, setPkgError] = useState(false);
  const [delivery, setDelivery] = useState<CourierSelection | null>(null);
  const [deliveryError, setDeliveryError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    officeAddress: '',
    notes: '',
  });
  const [flowOrder, setFlowOrder] = useState<{ eventId: string; quantity: number; total: number } | null>(null);
  const [addToCartFired, setAddToCartFired] = useState(false);
  const touchedCountRef = useRef(0);

  const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;

  // Стойности за пиксела: идват от избрания пакет (fallback към входната цена преди избор)
  const pxValue = selectedPkg ? selectedPkg.total : 23.90;
  const pxItems = selectedPkg ? selectedPkg.qty : 1;

  const applyAdvancedMatching = () => {
    // Четем на живо от полетата (хваща и autofill, не само ръчно писане)
    const liveEmail = (document.getElementById('email') as HTMLInputElement)?.value || formData.email;
    const livePhone = (document.getElementById('phone') as HTMLInputElement)?.value || formData.phone;
    const liveName = (document.getElementById('fullName') as HTMLInputElement)?.value || formData.fullName;

    const am: Record<string, string> = {};
    if (liveEmail) am.em = liveEmail.toLowerCase().trim();
    if (livePhone) {
      let ph = livePhone.replace(/\D/g, '');
      if (ph.startsWith('0')) ph = '359' + ph.slice(1);
      am.ph = ph;
    }
    if (liveName) {
      const parts = liveName.trim().toLowerCase().split(/\s+/);
      am.fn = parts[0] || '';
      if (parts.length > 1) am.ln = parts.slice(1).join(' ');
    }
    if (Object.keys(am).length > 0 && PIXEL_ID) {
      ReactPixel.init(PIXEL_ID, am as any, { autoConfig: true, debug: false });
      return true;
    }
    return false;
  };

  const handleFocus = () => {
    if (touchedCountRef.current === 0) {
      touchedCountRef.current = 1;
      ReactPixel.track('InitiateCheckout', {
        content_name: 'Naturino Kids',
        content_type: 'product',
        value: pxValue,
        currency: 'EUR',
        num_items: pxItems,
      });
    }
  };

  const handleFieldTouch = () => {
    if (addToCartFired) return;

    // Палим AddToCart едва когато реално има имейл ИЛИ телефон (работи и при autofill)
    const hasData = formData.email.trim() !== '' || formData.phone.trim() !== '';
    if (!hasData) return;

    setAddToCartFired(true);
    setTimeout(() => {
      applyAdvancedMatching();
      ReactPixel.track('AddToCart', {
        content_name: 'Naturino Kids',
        content_type: 'product',
        value: pxValue,
        currency: 'EUR',
        num_items: pxItems,
      });
    }, 800);
  };

  useEffect(() => {
    // По желание на клиента: ViewContent праща фиксирано 23.90
    ReactPixel.track('ViewContent', {
      content_name: 'Naturino Kids',
      content_type: 'product',
      value: 23.90,
      currency: 'EUR',
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Избор на пакет → задаваме сумата и плавно превъртаме към формата
  const handleSelectPackage = (p: Pkg) => {
    setSelectedPkg(p);
    setPkgError(false);
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const totalPrice = selectedPkg ? selectedPkg.total.toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка 1: избран пакет
    if (!selectedPkg) {
      setPkgError(true);
      document.getElementById('offer-cards')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Проверка 2: доставката трябва да е напълно избрана
    if (!delivery || !delivery.isComplete) {
      setDeliveryError(true);
      setTimeout(() => setDeliveryError(false), 5000);
      document.getElementById('delivery-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const quantity = selectedPkg.qty;
    const currentTotal = selectedPkg.total;
    const eventId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Оптимизиран Тракинг с филтър за тестови поръчки
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const isTestOrder = formData.fullName.toLowerCase().includes('test');

      if (isTestOrder) {
        console.log('⚠️ Тестова поръчка засечена в Checkout! Прескачаме браузърния Facebook Pixel Event за Purchase.');
      } else {
        const liveEmail = (document.getElementById('email') as HTMLInputElement)?.value || formData.email;
        const livePhone = (document.getElementById('phone') as HTMLInputElement)?.value || formData.phone;
        const liveName = (document.getElementById('fullName') as HTMLInputElement)?.value || formData.fullName;

        const am: Record<string, string> = {};
        if (liveEmail) am.em = liveEmail.toLowerCase().trim();
        if (livePhone) {
          let ph = livePhone.replace(/\D/g, '');
          if (ph.startsWith('0')) ph = '359' + ph.slice(1);
          am.ph = ph;
        }
        if (liveName) {
          const parts = liveName.trim().toLowerCase().split(/\s+/);
          am.fn = parts[0] || '';
          if (parts.length > 1) am.ln = parts.slice(1).join(' ');
        }
        if (Object.keys(am).length > 0 && PIXEL_ID) {
          ReactPixel.init(PIXEL_ID, am as any, { autoConfig: true, debug: false });
        }

        (window as any).fbq('track', 'Purchase', {
          value: currentTotal,
          currency: 'EUR',
          content_name: 'Naturino Kids',
          content_type: 'product',
          num_items: quantity,
        }, { eventID: eventId });
      }
    }

    localStorage.setItem('naturino_buyer', 'true');
    const orderData = {
      ...formData,
      // Стари полета — пълним ги от новия избор, за да е таблицата съвместима:
      city: delivery.cityName,
      officeAddress: delivery.fullAddress,
      notes: delivery.note,
      phone: formData.phone.replace(/\s+/g, ''),
      quantity: quantity,
      total: currentTotal,
      courier: delivery.courier === 'speedy' ? 'Speedy' : 'ЕКОНТ',
      currency: 'EUR',
      eventId: eventId,
      SK: 'id:9307307573',
      promoApplied: 'NO',
      packageName: `${quantity} ${quantity === 1 ? 'опаковка' : 'опаковки'}`,
      // НОВИ структурирани полета (за пощ. код и точност):
      deliveryType: delivery.deliveryType === 'office' ? 'До офис' : 'До адрес',
      postCode: delivery.postCode,
      region: delivery.region,
      officeName: delivery.officeName,
      officeId: String(delivery.officeId ?? ''),
      streetName: delivery.streetName,
      streetNo: delivery.streetNo,
      isAutomat: delivery.isAutomat ? 'Да' : 'Не',
    };

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOwqXeF_u9MKXtJVkYDnTKHCDfuzZLIEs45dwAiFdcv4YJFJ6UsBeRlzsVo5GlUSUU/exec';
    const BACKUP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKKvDPfL63m5k8XdrA9gwwI6Bp93i4YZAo_8sLIO1hqCwagTBWQssymHlwkZBun9zQsg/exec';

    // Основен запис (жив, недокоснат)
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(orderData),
    }).catch(error => console.error('Background sync error:', error));

    // Бекъп запис (независим — ако гръмне, не пипа основния)
    fetch(BACKUP_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(orderData),
    }).catch(error => console.error('Backup sync error:', error));

    // Отваряме Upsell след записа (поръчката вече е записана по-горе, с eventId)
    setFlowOrder({ eventId: eventId, quantity: quantity, total: currentTotal });

    setFormData({
      fullName: '',
      phone: '',
      email: '',
      city: '',
      officeAddress: '',
      notes: '',
    });
    setDelivery(null);
    setSelectedPkg(null);
  };

  return (
    <section
      ref={sectionRef}
      id="checkout"
      className="section-padding bg-white relative"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <ShoppingCart className="w-4 h-4" />
            <span>Поръчай сега</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
            Готови ли сте да помогнете на <span className="text-emerald-600">детето си</span>?
          </h2>
          <div className="reveal opacity-0 text-base md:text-lg text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">

            <div className="mt-2 bg-gradient-to-br from-rose-50 to-white rounded-3xl border border-rose-200 p-5 shadow-lg">

              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-black text-sm mb-5">
                🎁 ДВОЕН БОНУС ЗА ВСЯКА МАЙКА
              </div>

              <div className="space-y-4">
                {/* Консултация */}
                <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                  <h4 className="font-black text-lg text-emerald-700">
                    💬 10-минутна консултация с Пламена
                  </h4>
                  <p className="text-slate-600 mt-2 text-sm md:text-base">
                    Лични насоки и отговори на всички ваши въпроси.
                  </p>
                </div>

                {/* Facebook група */}
                <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                  <h4 className="font-black text-lg text-[#1877F2]">
                    👩‍👩‍👧 Затворена общност за родители
                  </h4>
                  <div className="mt-3 space-y-2 text-sm font-medium text-slate-700">
                    <p>✔ Съвети и подкрепа от други майки</p>
                    <p>✔ Бързи решения при вируси и боледуване</p>
                    <p>✔ Идеи за хранене и силен имунитет</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <p className="text-center font-bold text-rose-600 leading-relaxed">
                  ❤️ Няма да сте сами в най-трудните моменти.
                  <br />
                  Покана в затворената група става на имейл посочен при поръчката.
                </p>
              </div>
            </div>

            {/* Финалният призив за действие */}
            <p className="mt-8 text-base md:text-lg font-bold text-green-700 animate-pulse border-t border-slate-100 pt-6 transition-all duration-10000">
              Изберете своя пакет и попълнете формата, за да завършите поръчката 👇<div>Ще се свържем с вас за потвърждение ✅</div>
            </p>

          </div>
        </div>

        {/* ===== ПАКЕТНИ ОФЕРТИ ===== */}
        <div className="reveal opacity-0 mb-10 md:mb-16">
          <OfferCards selected={selectedPkg} onSelect={handleSelectPackage} />
          {pkgError && (
            <p className="text-center text-sm text-red-500 font-bold mt-4 animate-bounce">
              Моля, изберете пакет, за да продължите с поръчката ☝️
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto min-w-0">
          {/* Order Form */}
          <div className="reveal opacity-0 min-w-0">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="bg-amber-50/50 rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-2xl shadow-amber-900/10 relative overflow-hidden min-w-0 scroll-mt-24"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-bl-full -mr-12 -mt-12"></div>

              <h3 className="text-xl md:text-2xl font-black text-amber-900 text-center mb-6 uppercase tracking-tight relative z-10">
                Детайли за доставка
              </h3>

              <div className="space-y-4 md:space-y-5 relative z-10">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    Име и Фамилия <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Име и фамилия"
                    value={formData.fullName}
                    onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); handleFieldTouch(); }}
                    className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm"
                    onFocus={handleFocus}
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-600" />
                      Телефон <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="08xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); handleFieldTouch(); }}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFocus}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-600" />
                      Имейл
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); handleFieldTouch(); }}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFocus}
                    />
                    <p className="text-[11px] text-slate-400 font-normal italic mt-1 ml-1 leading-tight">
                      За промоции и статус на поръчката
                    </p>
                  </div>
                </div>

                {/* избор на куриер + доставка (CourierPicker) */}
                <div
                  id="delivery-block"
                  className={`min-w-0 rounded-2xl transition-all duration-300 ${
                    deliveryError ? 'ring-2 ring-red-400 ring-offset-2 bg-red-50/40 p-3 -m-0.5' : ''
                  }`}
                >
                  <CourierPicker onChange={setDelivery} />
                  {deliveryError && (
                    <p className="text-[11px] text-red-500 font-bold mt-2 ml-1 animate-bounce">
                      Моля, изберете куриер, град и офис/адрес за доставка!
                    </p>
                  )}
                </div>

                {/* ИЗБРАН ПАКЕТ (заменя стария брояч за количество) */}
                <div className="flex flex-col gap-2 p-4 bg-white/60 rounded-2xl border border-amber-100 mt-2">
                  <Label className="text-amber-900 text-sm font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" /> Избран пакет:
                  </Label>
                  {selectedPkg ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-lg text-slate-800">{selectedPkg.qty} {selectedPkg.qty === 1 ? 'опаковка' : 'опаковки'}</p>
                        <p className="text-xs text-slate-500 font-semibold">{eur(selectedPkg.total / selectedPkg.qty)} € на брой · с ДДС</p>
                      </div>
                      <a href="#offer-cards" className="text-xs font-bold text-emerald-600 underline underline-offset-2">Смени пакета</a>
                    </div>
                  ) : (
                    <a href="#offer-cards" className="text-sm font-bold text-emerald-600">
                      ☝️ Изберете пакет отгоре, за да продължите
                    </a>
                  )}
                </div>

                {/* Total Summary Box */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-inner mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600 font-medium">Общо (с ДДС):</span>
                    <span className="text-2xl font-black text-amber-600">{selectedPkg ? `${totalPrice} €` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    <Check className="w-3 h-3" /> Наложен платеж (при преглед) · доставка по тарифа на куриера
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-16 px-4 md:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 md:gap-3 group mt-4"
                >
                  <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                  <span className="flex flex-col items-center justify-center leading-tight text-center">
                    <span className="text-base md:text-xl tracking-tight">
                      ПОРЪЧАЙ СЕГА
                    </span>
                    <span className="text-xs md:text-sm font-bold opacity-95">
                      плащаш при получаване
                    </span>
                  </span>
                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[12px] md:text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                  Преглед преди плащане • Ще ви се обадим за потвърждение
                </p>

              </div>
            </form>
          </div>

          {/* Right Side - Benefits & Product Info */}
          <div className="reveal opacity-0 space-y-4 md:space-y-6">

            {/* КУРИЕР ЛОГА */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <img src="/logo/speedy-logo.png" alt="Speedy" className="h-12 md:h-16 w-auto object-contain" />
                <img src="/logo/ekont-logo.png" alt="Еконт" className="h-11 md:h-16 w-auto object-contain" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm">
              <h3 className="text-emerald-900 font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Защо да ни се доверите?
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Експресна доставка</p>
                    <p className="text-slate-600 text-sm">Доставяме с Еконт и Спиди в рамките на 1-2 работни дни.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Сигурност</p>
                    <p className="text-slate-600 text-sm">Плащате чак когато пратката е в ръцете ви и сте я прегледали.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0 shadow-inner">
                <Package className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Naturino Kids</h4>
                <p className="text-slate-500 text-sm italic">100% Натурален билков екстракт</p>
                <p className="text-emerald-600 font-bold text-xl mt-1">от 23.90 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPSELL / DOWNSELL / БЛАГОДАРЯ */}
      {flowOrder && (
        <UpsellFlow order={flowOrder} onClose={() => setFlowOrder(null)} />
      )}
    </section>
  );
}
