// ==========================================================
// 💶 ЦЕНИ И ПАКЕТИ — ЕДИНСТВЕНОТО МЯСТО ВЪВ ФУНИЯТА, КЪДЕТО СЕ ПИШАТ
//
// ⚠️ Ако смениш цена тук — смени я и в Apps Script (PACK_PRICES),
//    иначе поръчките ще отиват в „Карантина“.
//
// Правило: цената зависи САМО от общия брой шишенца.
// Брой > 4 → колкото може пакети по 4, остатъкът по цената на пакет 1/2/3.
//   5 = 4 + 1 → 86,90 + 23,90      6 = 4 + 2 → 86,90 + 45,90
//   7 = 4 + 3 → 86,90 + 68,80      8 = 4 + 4 → 86,90 + 86,90
// Безплатна доставка от 3 шишенца нагоре.
// ==========================================================

export const UNIT_PRICE = 23.9;          // редовна цена за 1 шише
export const MAX_QUANTITY = 12;          // най-много в една поръчка (3 пакета по 4)
export const FREE_SHIPPING_FROM_QTY = 3; // от толкова шишенца доставката е безплатна

// Цени в стотинки (цели числа — без грешки от закръгляне)
const TIER_CENTS: Record<number, number> = { 1: 2390, 2: 4590, 3: 6880, 4: 8690 };

// Пакетите, които се показват в секциите с оферти
export const PACKS = [2, 3, 4] as const;
export type PackQty = (typeof PACKS)[number];

const clampQty = (qty: number) => {
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 1) return 1;
  return Math.min(q, MAX_QUANTITY);
};

/** Разбивка на броя на пакети: 6 → [4, 2], 9 → [4, 4, 1] */
export function packBreakdown(qty: number): number[] {
  let left = clampQty(qty);
  const parts: number[] = [];
  while (left > 0) {
    const k = left >= 4 ? 4 : left;
    parts.push(k);
    left -= k;
  }
  return parts;
}

/** Цена в стотинки за даден брой */
export function priceCents(qty: number): number {
  return packBreakdown(qty).reduce((sum, k) => sum + TIER_CENTS[k], 0);
}

/** Цена в евро за даден брой: 4 → 86.9 */
export function priceFor(qty: number): number {
  return priceCents(qty) / 100;
}

/** Колко би струвало на редовна цена (за зачеркнатата цена): 4 → 95.6 */
export function regularPriceFor(qty: number): number {
  return (clampQty(qty) * Math.round(UNIT_PRICE * 100)) / 100;
}

/** Спестено спрямо редовната цена: 4 → 8.7 */
export function savingFor(qty: number): number {
  return (clampQty(qty) * Math.round(UNIT_PRICE * 100) - priceCents(qty)) / 100;
}

export const hasFreeShipping = (qty: number) => clampQty(qty) >= FREE_SHIPPING_FROM_QTY;

/** Текст на разбивката: [4, 2] → "Пакет 4 бр. + Пакет 2 бр."; [1] → "1 бр." */
export function breakdownLabel(qty: number): string {
  const parts = packBreakdown(qty);
  if (parts.length === 1 && parts[0] === 1) return '1 бр.';
  return parts.map((k) => (k === 1 ? '1 бр.' : `Пакет ${k} бр.`)).join(' + ');
}

/**
 * Upsell след поръчка — винаги води ЕДНО НИВО НАГОРЕ, до следващия пакет:
 *   1 бр. → +2 = пакет 3 (+44,90)    2 бр. → +2 = пакет 4 (+41,00)    3 бр. → +1 = пакет 4 (+18,10)
 *   4+ бр. → няма upsell (показва се направо downsell-ът)
 * Сумата е точно разликата между цените на двата пакета.
 * ⚠️ Същото правило е и в Apps Script (upsellTargetQty_).
 */
export function upsellFor(qty: number): { targetQty: number; addQty: number; addPrice: number; wasPrice: number } | null {
  const q = clampQty(qty);
  const targetQty = q <= 2 ? q + 2 : q === 3 ? 4 : 0;
  if (!targetQty) return null;
  const addQty = targetQty - q;
  return {
    targetQty,
    addQty,
    addPrice: (priceCents(targetQty) - priceCents(q)) / 100,
    wasPrice: (addQty * Math.round(UNIT_PRICE * 100)) / 100,
  };
}

/** Downsell: 1 опаковка за възрастни, фиксирана цена (същата като в Apps Script и worker-а) */
export const DOWNSELL_PRICE = 24.9;

/** 23.9 -> "23,90 €" */
export const eur = (n: number) => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €';

/** Събитие, с което секциите с пакети казват на чекаута колко шишенца е избрал клиентът */
export const SELECT_PACKAGE_EVENT = 'NaturinoSelectPackage';
