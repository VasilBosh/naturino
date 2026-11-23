import { useEffect, useId, useState } from 'react';
import { Check, Truck, Star, ShoppingCart, Gift, Clock } from 'lucide-react';
import {
  getPacks,
  priceFor,
  regularPriceFor,
  savingFor,
  hasFreeShipping,
  isPromoActive,
  PROMO_PACK,
  PROMO_END_MS,
  PROMO_END_LABEL,
  eur,
  SELECT_PACKAGE_EVENT,
} from '../utils/pricing';

/**
 * Секция „Пакетни предложения“ — ЕДИН компонент, показан на 3 места в App.tsx.
 * При избор на пакет:
 *   1) казва на чекаута колко шишенца е избрал клиентът (събитие NaturinoSelectPackage)
 *   2) скролва до формата за поръчка.
 * Нищо не записва и нищо не изпраща — поръчката се прави само от Checkout.
 * `id` трябва да е различно за всяко от трите места.
 *
 * 🎄 До PROMO_END (виж utils/pricing.ts) третата карта е коледната „4+1 ПОДАРЪК“.
 *    След това автоматично се връща обикновената карта „4 опаковки“.
 */

const BADGE: Record<number, string> = {
  2: '',
  3: '🚚 БЕЗПЛАТНА ДОСТАВКА',
  4: '⭐ НАЙ-ИЗГОДНО',
};

function selectPackage(qty: number) {
  window.dispatchEvent(new CustomEvent(SELECT_PACKAGE_EVENT, { detail: qty }));
  // Изчакваме чекаутът да обнови бройката, после скролваме до формата
  setTimeout(() => {
    const target = document.getElementById('order-form') || document.getElementById('checkout');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

/* ---------- 🎄 Анимации на коледната карта ---------- */
const XMAS_CSS = `
@keyframes xm_glow { 0%,100% { opacity:.55; transform:scale(1) } 50% { opacity:.95; transform:scale(1.03) } }
.xm-glow { animation: xm_glow 2.6s ease-in-out infinite }
@keyframes xm_bow { 0%,100% { transform:rotate(14deg) } 50% { transform:rotate(8deg) translateY(-2px) } }
.xm-bow { animation: xm_bow 3s ease-in-out infinite; transform-origin: 50% 45% }
@keyframes xm_twinkle { 0%,100% { opacity:.25; transform:scale(.8) } 50% { opacity:1; transform:scale(1.15) } }
.xm-twinkle { animation: xm_twinkle 2.2s ease-in-out infinite }
@keyframes xm_swing { 0%,100% { transform:rotate(-6deg) } 50% { transform:rotate(6deg) } }
.xm-swing { animation: xm_swing 3.4s ease-in-out infinite; transform-origin: 50% 0 }
@keyframes xm_shine { 0% { transform:translateX(-130%) } 100% { transform:translateX(230%) } }
.xm-shine { overflow:hidden } /* позицията идва от самия елемент (absolute/relative) */
.xm-shine::after { content:""; position:absolute; top:0; bottom:0; width:40%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.6),transparent);
  transform:translateX(-130%); animation:xm_shine 2.6s 1s infinite }
@media (prefers-reduced-motion: reduce) { .xm-glow,.xm-bow,.xm-twinkle,.xm-swing,.xm-shine::after { animation:none } }
`;

/** Панделка (собствен SVG) — в горния десен ъгъл на картата */
function Bow({ className = '' }: { className?: string }) {
  const gid = 'xmRibbon' + useId().replace(/[^a-zA-Z0-9]/g, ''); // уникално име (секцията се показва 3 пъти)
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f87171" />
          <stop offset=".5" stopColor="#dc2626" />
          <stop offset="1" stopColor="#991b1b" />
        </linearGradient>
      </defs>
      {/* опашки */}
      <path d="M57 52 L38 104 L49 98 L55 109 L67 56 Z" fill={`url(#${gid})`} stroke="#7f1d1d" strokeWidth="1.2" />
      <path d="M63 52 L92 101 L80 98 L77 109 L55 58 Z" fill={`url(#${gid})`} stroke="#7f1d1d" strokeWidth="1.2" />
      {/* бримки */}
      <path d="M60 50 C 40 18, 4 20, 9 46 C 13 66, 45 63, 60 50 Z" fill={`url(#${gid})`} stroke="#7f1d1d" strokeWidth="1.5" />
      <path d="M60 50 C 80 18, 116 20, 111 46 C 107 66, 75 63, 60 50 Z" fill={`url(#${gid})`} stroke="#7f1d1d" strokeWidth="1.5" />
      <path d="M57 50 C 45 37, 25 35, 22 45 C 22 53, 40 55, 57 50 Z" fill="#7f1d1d" opacity=".35" />
      <path d="M63 50 C 75 37, 95 35, 98 45 C 98 53, 80 55, 63 50 Z" fill="#7f1d1d" opacity=".35" />
      {/* възел */}
      <ellipse cx="60" cy="50" rx="10.5" ry="9.5" fill={`url(#${gid})`} stroke="#7f1d1d" strokeWidth="1.5" />
      {/* отблясъци */}
      <path d="M19 38 C 27 27, 42 27, 50 35" stroke="#fecaca" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
      <path d="M70 35 C 78 27, 93 27, 101 38" stroke="#fecaca" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
      <ellipse cx="57" cy="46" rx="3" ry="2" fill="#fecaca" opacity=".8" />
    </svg>
  );
}

/** Висяща коледна топка (собствен SVG) */
function Bauble({ color, className = '' }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 44" className={className} aria-hidden="true">
      <line x1="12" y1="0" x2="12" y2="16" stroke="#b45309" strokeWidth="1" />
      <rect x="9" y="14" width="6" height="4" rx="1" fill="#f59e0b" />
      <circle cx="12" cy="29" r="11" fill={color} />
      <ellipse cx="8" cy="25" rx="3" ry="2" fill="#fff" opacity=".55" />
    </svg>
  );
}

/** Колко остава до края на офертата (истинският краен срок, не рестартиращ се таймер) */
function useTimeLeft() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, PROMO_END_MS - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (days >= 1) return `Остават ${days} ${days === 1 ? 'ден' : 'дни'} и ${hours} ч.`;
  return `Остават само ${hours} ч. и ${mins} мин.`;
}

/* ---------- 🎄 Коледната карта „4+1 ПОДАРЪК“ ---------- */
function ChristmasCard() {
  const qty = PROMO_PACK;
  const price = priceFor(qty);
  const left = useTimeLeft();
  return (
    <div className="relative mt-4 md:mt-0">
      <style>{XMAS_CSS}</style>

      {/* сияние зад картата */}
      <div className="xm-glow pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-amber-300 via-red-400 to-amber-300 blur-xl" />

      <div className="relative flex flex-col items-center bg-gradient-to-b from-[#fff7ed] via-white to-[#fef2f2] rounded-3xl p-4 md:p-6 border-[3px] border-red-500 shadow-2xl shadow-red-300/60">
        {/* панделка в ъгъла */}
        {/* позиция за всеки размер: телефон | таблет (над ъгъла) | малък лаптоп | голям екран — никога извън страницата */}
        <Bow className="xm-bow absolute -top-10 -right-4 w-16 sm:-top-9 sm:-right-2 sm:w-20 md:-top-[76px] md:-right-4 md:w-16 lg:-top-12 lg:-right-8 lg:w-24 xl:-right-16 xl:w-28 drop-shadow-lg z-20" />

        {/* висящи топки и искрици */}
        <Bauble color="#dc2626" className="xm-swing hidden lg:block absolute top-0 left-3 w-6" />
        <Bauble color="#f59e0b" className="xm-swing hidden lg:block absolute top-0 left-10 w-5 [animation-delay:.8s]" />
        <span className="xm-twinkle absolute top-16 right-4 text-lg" aria-hidden="true">✨</span>
        <span className="xm-twinkle absolute bottom-24 left-3 text-base [animation-delay:1s]" aria-hidden="true">❄️</span>
        <span className="xm-twinkle absolute top-1/2 right-3 text-sm [animation-delay:1.6s]" aria-hidden="true">⭐</span>

        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 lg:px-4 py-1 rounded-full text-[12px] lg:text-[13px] font-black shadow-lg bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white ring-2 ring-white xm-shine">
          🎄 КОЛЕДЕН ПОДАРЪК
        </div>

        <img
          src="/images/packages/paket-4plus1.webp"
          alt="Naturino Kids — 4 опаковки + 1 подарък"
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-52 h-52 sm:w-56 sm:h-56 md:w-full md:h-auto md:max-w-[240px] rounded-2xl object-cover mt-3 ring-4 ring-amber-300/70 shadow-xl"
        />

        <div className="w-full text-center mt-4">
          <h3 className="text-[22px] sm:text-2xl md:text-lg lg:text-[22px] xl:text-[26px] font-black text-red-600 leading-none whitespace-nowrap">
            4 + 1 ПОДАРЪК 🎁
          </h3>
          <p className="text-[13px] md:text-sm font-bold text-slate-600 mt-1">5 опаковки на цената на 4</p>

          <div className="mt-2 flex items-baseline gap-2 justify-center flex-wrap">
            <span className="text-[34px] md:text-4xl font-black text-red-600 whitespace-nowrap leading-none">{eur(price)}</span>
            <span className="text-sm text-slate-400 line-through whitespace-nowrap">{eur(regularPriceFor(qty))}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">{eur(price / qty)} на брой</p>

          <ul className="mt-3 space-y-1 text-[13px] md:text-sm font-bold text-slate-700 inline-block text-left">
            <li className="flex items-center gap-1.5 text-red-600">
              <Gift className="w-4 h-4 flex-shrink-0" />
              5-тото шишенце е ПОДАРЪК
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              Спестявате {eur(savingFor(qty))}
            </li>
            <li className="flex items-center gap-1.5 text-emerald-700">
              <Truck className="w-4 h-4 flex-shrink-0" />
              Безплатна доставка
            </li>
          </ul>

          <div className="mt-3 rounded-2xl bg-red-50 ring-1 ring-red-200 px-3 py-2">
            <p className="flex items-center justify-center gap-1.5 text-[12.5px] md:text-[13px] font-black text-red-700">
              <Clock className="w-4 h-4 flex-shrink-0" /> Само до {PROMO_END_LABEL}
            </p>
            <p className="text-[11.5px] font-bold text-red-600/80">{left}</p>
          </div>

          <button
            type="button"
            onClick={() => selectPackage(qty)}
            className="xm-shine relative mt-4 w-full min-h-12 px-4 py-3 rounded-2xl font-black text-[15px] md:text-base flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-xl shadow-red-300/60 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
          >
            <Gift className="w-5 h-5 flex-shrink-0" />
            Взимам 4+1 ПОДАРЪК
          </button>
        </div>
      </div>
    </div>
  );
}

export function Packages({ id }: { id: string }) {
  const promo = isPromoActive();
  return (
    <section id={id} className="py-10 md:py-16 bg-gradient-to-b from-white via-emerald-50/60 to-white overflow-x-clip">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-bold mb-3 md:mb-4">
            🎁 Пакетни предложения
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            Вземете повече и <span className="text-emerald-600">спестете</span>
          </h2>
          <p className="mt-2 md:mt-3 text-sm md:text-lg text-slate-600">
            От 3 опаковки нагоре — <strong className="text-emerald-700">безплатна доставка</strong>
          </p>
          {promo && (
            <p className="mt-2 inline-flex items-center gap-1.5 bg-red-600 text-white text-[12.5px] md:text-sm font-black px-3 py-1 rounded-full">
              🎄 Коледна оферта 4+1 — само до {PROMO_END_LABEL}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-5xl mx-auto md:items-center">
          {getPacks().map((qty) => {
            if (promo && qty === PROMO_PACK) return <ChristmasCard key="xmas" />;
            const best = qty === 4;
            const price = priceFor(qty);
            const saving = savingFor(qty);
            const free = hasFreeShipping(qty);
            return (
              <div
                key={qty}
                className={`relative flex md:flex-col items-center gap-4 md:gap-0 bg-white rounded-3xl p-4 md:p-6 border-2 shadow-lg transition-transform md:hover:-translate-y-1 ${
                  best ? 'border-emerald-500 shadow-emerald-200/60 ring-4 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                {BADGE[qty] && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] md:text-xs font-black shadow-md ${
                      best ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-amber-950'
                    }`}
                  >
                    {BADGE[qty]}
                  </div>
                )}

                <img
                  src={`/images/packages/paket-${qty}.webp`}
                  alt={`Naturino Kids — пакет ${qty} опаковки`}
                  width={600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-full md:h-auto md:max-w-[240px] rounded-2xl object-cover flex-shrink-0 md:mt-2"
                />

                <div className="min-w-0 flex-1 md:w-full md:text-center md:mt-4">
                  <h3 className="text-lg md:text-xl font-black text-slate-900">{qty} опаковки</h3>

                  <div className="mt-1 flex items-baseline gap-2 md:justify-center flex-wrap">
                    <span className="text-2xl md:text-3xl font-black text-emerald-600 whitespace-nowrap">{eur(price)}</span>
                    <span className="text-sm text-slate-400 line-through whitespace-nowrap">{eur(regularPriceFor(qty))}</span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-500 font-semibold">{eur(price / qty)} на брой</p>

                  <ul className="mt-2 space-y-1 text-xs md:text-sm font-semibold text-slate-700 md:inline-block md:text-left">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      Спестявате {eur(saving)}
                    </li>
                    <li className={`flex items-center gap-1.5 ${free ? 'text-emerald-700' : 'text-slate-500'}`}>
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      {free ? 'Безплатна доставка' : 'Доставка по тарифа'}
                    </li>
                    {best && (
                      <li className="flex items-center gap-1.5 text-emerald-700">
                        <Star className="w-4 h-4 flex-shrink-0" />
                        Най-ниска цена на брой
                      </li>
                    )}
                  </ul>

                  <button
                    type="button"
                    onClick={() => selectPackage(qty)}
                    className={`mt-3 md:mt-5 w-full min-h-12 px-4 py-3 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg ${
                      best
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-amber-100'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                    Избирам {qty} опаковки
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs md:text-sm text-slate-500 font-semibold mt-5 md:mt-8">
          В поръчката можете да добавите и още опаковки • Плащане при получаване
        </p>
      </div>
    </section>
  );
}
