import { useState } from 'react';
import { UpsellFlow } from '../sections/UpsellFlow';
import { priceFor, MAX_QUANTITY } from '../utils/pricing';

/**
 * 🧪 ТЕСТОВ ПРЕГЛЕД НА UPSELL / DOWNSELL — работи САМО в `npm run dev`.
 * В сайта след build/deploy този файл НЕ се включва (виж App.tsx).
 *
 * Адреси (на компютъра или на телефона през --host):
 *   /?upsell=1   → все едно е поръчано 1 бр.   (upsell +2 → downsell)
 *   /?upsell=2   → 2 бр.                       (upsell +2 → downsell)
 *   /?upsell=3   → 3 бр.                       (upsell +1 → downsell)
 *   /?upsell=4   → 4 бр.                       (направо downsell)
 *   &ship=automat | office | address           → вид доставка (по подразбиране office)
 *
 * Нищо не се изпраща към таблиците, имейлите или Tradefy (UpsellFlow е в режим preview).
 */
const SHIP: Record<string, { fee: number; label: string }> = {
  automat: { fee: 2.5, label: 'Доставка до автомат' },
  office: { fee: 3.75, label: 'Доставка до офис' },
  address: { fee: 4.5, label: 'Доставка до адрес' },
};

export default function OfferPreview() {
  const params = new URLSearchParams(window.location.search);
  const qty = Math.floor(Number(params.get('upsell')));
  const ship = SHIP[params.get('ship') || 'office'] || SHIP.office;
  const [run, setRun] = useState(0);

  if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QUANTITY) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-yellow-300 text-yellow-950 text-[11px] font-black py-1">
        🧪 ТЕСТОВ РЕЖИМ ({qty} бр.) — нищо не се изпраща
        <button onClick={() => setRun((r) => r + 1)} className="underline">↻ отначало</button>
      </div>
      <UpsellFlow
        key={run}
        preview
        order={{
          eventId: 'preview',
          quantity: qty,
          total: priceFor(qty),
          base: { city: 'София' },
          shippingFee: ship.fee,
          shippingLabel: ship.label,
        }}
        onClose={() => setRun((r) => r + 1)}
      />
    </>
  );
}
