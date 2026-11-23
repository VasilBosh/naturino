// ==========================================================
// 💶 ЦЕНИ И ПАКЕТИ — ЕДИНСТВЕНОТО МЯСТО ВЪВ ФУНИЯТА, КЪДЕТО СЕ ПИШАТ
//
// ⚠️ Ако смениш цена тук — смени я и в Apps Script (PACK_PRICES / PROMO_...),
//    иначе поръчките ще отиват в „Карантина“.
//
// Правило: цената зависи САМО от общия брой шишенца.
// Брой > 4 → колкото може пакети по 4, остатъкът по цената на пакет 1/2/3:
//   5 = 4 + 1 → 86,90 + 23,90      6 = 4 + 2 → 86,90 + 45,90
//   7 = 4 + 3 → 86,90 + 68,80      8 = 4 + 4 → 86,90 + 86,90
// Безплатна доставка от 3 шишенца нагоре.
//
// 🎄 КОЛЕДНА ОФЕРТА „4+1 ПОДАРЪК“ (до PROMO_END): 5 шишенца = 86,90 €.
//   Тогава пакетите са по 5: 6 = 5 + 1, 7 = 5 + 2, 8 = 5 + 3, 10 = 5 + 5 ...
//   Бройки с остатък 4 (4, 9, 14 ...) се прескачат — на същата цена клиентът взима и 5-тото.
//   След PROMO_END всичко се връща САМО към горните цени — без deploy.
// ==========================================================

export const UNIT_PRICE = 23.9;          // редовна цена за 1 шише
export const MAX_QUANTITY = 50;          // най-много в една поръчка (10 пакета по 5)
export const FREE_SHIPPING_FROM_QTY = 3; // от толкова шишенца доставката е безплатна

// 🎄 КРАЙ НА КОЛЕДНАТА ОФЕРТА: 31.12.2026, 23:59:59 българско време (= 21:59:59 UTC)
// ⚠️ Същата дата е и в Apps Script (PROMO_END_MS). Ако я смениш — смени я и там.
export const PROMO_END_MS = Date.UTC(2026, 11, 31, 21, 59, 59);
export const PROMO_END_LABEL = '31.12.2026, 23:59 ч.';
export const PROMO_PACK = 5;             // 4 + 1 подарък

/** Тече ли коледната оферта в момента? (по часовника на устройството) */
export const isPromoActive = (now: number = Date.now()) => now <= PROMO_END_MS;

// Цени в стотинки (цели числа — без грешки от закръгляне)
const TIER_CENTS: Record<number, number> = { 1: 2390, 2: 4590, 3: 6880, 4: 8690 };
const PROMO_PACK_CENTS = 8690; // 5 бр. (4+1) = 86,90 €

/** Пакетите, които се показват в секциите с оферти: 2, 3 и 4 (или 4+1 по време на офертата) */
export const getPacks = (): number[] => (isPromoActive() ? [2, 3, PROMO_PACK] : [2, 3, 4]);

const clampQty = (qty: number) => {
  const q = Math.floor(Number(qty));
  if (!Number.isFinite(q) || q < 1) return 1;
  return Math.min(q, MAX_QUANTITY);
};

/** Разбивка на броя на пакети: 6 → [4, 2]; по време на офертата 6 → [5, 1], 15 → [5, 5, 5] */
export function packBreakdown(qty: number): number[] {
  let left = clampQty(qty);
  const big = isPromoActive() ? PROMO_PACK : 4;
  const parts: number[] = [];
  while (left > 0) {
    const k = left >= big ? big : left;
    parts.push(k);
    left -= k;
  }
  return parts;
}

const partCents = (k: number) => (k === PROMO_PACK ? PROMO_PACK_CENTS : TIER_CENTS[k]);

/** Цена в стотинки за даден брой */
export function priceCents(qty: number): number {
  return packBreakdown(qty).reduce((sum, k) => sum + partCents(k), 0);
}

/** Цена в евро за даден брой: 4 → 86.9 ; по време на офертата 5 → 86.9 */
export function priceFor(qty: number): number {
  return priceCents(qty) / 100;
}

/** Колко би струвало на редовна цена (за зачеркнатата цена): 4 → 95.6 */
export function regularPriceFor(qty: number): number {
  return (clampQty(qty) * Math.round(UNIT_PRICE * 100)) / 100;
}

/** Спестено спрямо редовната цена: 4 → 8.7 ; 4+1 → 32.6 */
export function savingFor(qty: number): number {
  return (clampQty(qty) * Math.round(UNIT_PRICE * 100) - priceCents(qty)) / 100;
}

export const hasFreeShipping = (qty: number) => clampQty(qty) >= FREE_SHIPPING_FROM_QTY;

/** По време на офертата бройки с остатък 4 (4, 9, 14 ...) не се ползват — на същата цена е и 5-тото */
const isSkipped = (q: number) => isPromoActive() && q % PROMO_PACK === 4;

/** Бутон „+“: следващата позволена бройка (по време на офертата 3 → 5) */
export function nextQty(qty: number): number {
  let n = clampQty(qty) + 1;
  if (isSkipped(n)) n += 1;
  return Math.min(n, MAX_QUANTITY);
}

/** Бутон „−“: предишната позволена бройка (по време на офертата 5 → 3) */
export function prevQty(qty: number): number {
  let n = clampQty(qty) - 1;
  if (isSkipped(n)) n -= 1;
  return Math.max(1, n);
}

/** Позволена бройка: по време на офертата 4 → 5 (подаръкът се добавя сам) */
export function normalizeQty(qty: number): number {
  let n = clampQty(qty);
  if (isSkipped(n)) n = Math.min(n + 1, MAX_QUANTITY);
  return n;
}

const packName = (k: number) => (k === PROMO_PACK && isPromoActive() ? 'Пакет 4+1 🎁' : k === 1 ? '1 бр.' : `Пакет ${k} бр.`);

/** Текст на разбивката: [5, 5, 2] → "2 × Пакет 4+1 🎁 + Пакет 2 бр."; [1] → "1 бр." */
export function breakdownLabel(qty: number): string {
  const parts = packBreakdown(qty);
  const groups: { k: number; n: number }[] = [];
  parts.forEach((k) => {
    const last = groups[groups.length - 1];
    if (last && last.k === k) last.n += 1;
    else groups.push({ k, n: 1 });
  });
  return groups.map(({ k, n }) => (n > 1 ? `${n} × ${packName(k)}` : packName(k))).join(' + ');
}

/** Колко подаръчни шишенца има в поръчката (по време на офертата): 5 → 1, 15 → 3 */
export function giftCount(qty: number): number {
  if (!isPromoActive()) return 0;
  return packBreakdown(qty).filter((k) => k === PROMO_PACK).length;
}

/**
 * Upsell след поръчка — винаги води ЕДНО НИВО НАГОРЕ, до следващия пакет:
 *   1 бр. → +2 = пакет 3 (+44,90)    2 бр. → +2 = пакет 4 (+41,00)    3 бр. → +1 = пакет 4 (+18,10)
 *   🎄 по време на офертата: 2 бр. → +3 = 4+1 (+41,00)   3 бр. → +2 = 4+1 (+18,10)
 *   4+ бр. (или 5+ по време на офертата) → няма upsell (показва се направо downsell-ът)
 * Сумата е точно разликата между цените на двата пакета.
 * ⚠️ Същото правило е и в Apps Script (upsellOptions_).
 */
export function upsellFor(qty: number): { targetQty: number; addQty: number; addPrice: number; wasPrice: number } | null {
  const q = clampQty(qty);
  const top = isPromoActive() ? PROMO_PACK : 4;
  const targetQty = q === 1 ? 3 : q < top ? top : 0;
  if (!targetQty) return null;
  const addQty = targetQty - q;
  const addCents = priceCents(targetQty) - priceCents(q);
  if (addCents <= 0) return null; // няма смисъл от оферта за 0 €
  return {
    targetQty,
    addQty,
    addPrice: addCents / 100,
    wasPrice: (addQty * Math.round(UNIT_PRICE * 100)) / 100,
  };
}

/** Downsell: 1 опаковка за възрастни, фиксирана цена (същата като в Apps Script и worker-а) */
export const DOWNSELL_PRICE = 24.9;

/** 23.9 -> "23,90 €" */
export const eur = (n: number) => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €';

/** Събитие, с което секциите с пакети казват на чекаута колко шишенца е избрал клиентът */
export const SELECT_PACKAGE_EVENT = 'NaturinoSelectPackage';
