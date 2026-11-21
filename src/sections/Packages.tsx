import { Check, Truck, Star, ShoppingCart } from 'lucide-react';
import {
  PACKS,
  priceFor,
  regularPriceFor,
  savingFor,
  hasFreeShipping,
  eur,
  SELECT_PACKAGE_EVENT,
  type PackQty,
} from '../utils/pricing';

/**
 * Секция „Пакетни предложения“ — ЕДИН компонент, показан на 3 места в App.tsx.
 * При избор на пакет:
 *   1) казва на чекаута колко шишенца е избрал клиентът (събитие NaturinoSelectPackage)
 *   2) скролва до формата за поръчка.
 * Нищо не записва и нищо не изпраща — поръчката се прави само от Checkout.
 * `id` трябва да е различно за всяко от трите места.
 */

const BADGE: Record<PackQty, string> = {
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

export function Packages({ id }: { id: string }) {
  return (
    <section id={id} className="py-10 md:py-16 bg-gradient-to-b from-white via-emerald-50/60 to-white">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {PACKS.map((qty) => {
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
