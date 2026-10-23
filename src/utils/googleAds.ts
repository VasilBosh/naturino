// ==========================================================
// GOOGLE ADS — таг, Consent Mode v2 (съгласие за бисквитки) и покупка
//
// Как работи:
//  - Опашката gtag се създава ВЕДНАГА, а тежкият скрипт на Google се тегли при
//    първото действие на човека (скрол, докосване, клик) или най-късно след 3 сек.
//    Така страницата НЕ става по-бавна — същата логика като при пиксела.
//  - По подразбиране съгласието е "отказано". Google праща само анонимни сигнали
//    без бисквитки, докато човекът не натисне „Приемам“ в банера.
//  - Изборът се помни (localStorage). Ако е недостъпен (Safari частен режим) —
//    помни се само до затваряне на страницата. Нищо тук не може да спре поръчка.
//
// ⚠️ ПОПЪЛНИ ДВАТА КОДА ПО-ДОЛУ от Google Ads → Цели → Реализации → „Покупка“.
//    И двата са ПУБЛИЧНИ (виждат се в браузъра) — безопасно е да стоят в кода.
//    Докато са XXX, нищо от Google не се зарежда и банерът НЕ се показва.
// ==========================================================

/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */

const GADS_ID: string = 'AW-18532388999';           // ← ID на тага (от Google Ads)
const PURCHASE_LABEL: string = 'qe2WCLLC4qYdEIeh94RF'; // ← етикет на реализацията „Покупка“

const PLACEHOLDER_ID = 'AW-XXXXXXXXXX';
const PLACEHOLDER_LABEL = 'XXXXXXXXXXXXXXXX';

const CONSENT_KEY = 'naturino_consent_v1';
export const CONSENT_EVENT = 'NaturinoConsentChanged';

export type ConsentChoice = 'granted' | 'denied';

const isConfigured = () =>
  GADS_ID.startsWith('AW-') && GADS_ID !== PLACEHOLDER_ID && PURCHASE_LABEL !== PLACEHOLDER_LABEL;

// ----------------------------------------------------------
// Съгласие
// ----------------------------------------------------------

let memoryChoice: ConsentChoice | null = null;

/** Какво е избрал човекът досега (или null, ако още не е избрал). */
export function readConsent(): ConsentChoice | null {
  if (memoryChoice) return memoryChoice;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'granted' || v === 'denied') return v;
  } catch {
    /* localStorage недостъпен — няма проблем */
  }
  return null;
}

/** true = банерът трябва да се покаже (Google е настроен и човекът още не е избрал). */
export function needsConsentChoice(): boolean {
  return isConfigured() && readConsent() === null;
}

const consentState = (c: ConsentChoice) => ({
  ad_storage: c,
  ad_user_data: c,
  ad_personalization: c,
  analytics_storage: c,
});

/** Вика се от банера при „Приемам“ / „Отказвам“. */
export function setConsent(choice: ConsentChoice) {
  memoryChoice = choice;
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* няма проблем — помним само за тази сесия */
  }
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', consentState(choice));
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// ----------------------------------------------------------
// Видим ли е банерът в момента (StickyCTA се крие САМО докато банерът е отворен)
// ----------------------------------------------------------

export const BANNER_EVENT = 'NaturinoCookieBanner';
let bannerOpen = false;

export function isCookieBannerOpen(): boolean {
  return bannerOpen;
}

export function setCookieBannerOpen(open: boolean) {
  if (bannerOpen === open) return;
  bannerOpen = open;
  window.dispatchEvent(new Event(BANNER_EVENT));
}

// ----------------------------------------------------------
// Таг
// ----------------------------------------------------------

function gtag(..._args: any[]) {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(arguments);
}

let initialized = false;

/** Вика се ВЕДНЪЖ в App.tsx, преди страницата да се нарисува. */
export function initGoogleAds() {
  if (initialized || typeof window === 'undefined' || !isConfigured()) return;
  initialized = true;

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') w.gtag = gtag;

  // 1) Съгласието по подразбиране — ПРЕДИ всичко останало
  const stored = readConsent();
  w.gtag('consent', 'default', {
    ...consentState(stored === 'granted' ? 'granted' : 'denied'),
    wait_for_update: 500,
  });
  // Помага да не се губи откъде е дошъл човекът, когато бисквитките са отказани
  w.gtag('set', 'url_passthrough', true);

  w.gtag('js', new Date());
  w.gtag('config', GADS_ID, { allow_enhanced_conversions: true });

  // 2) Тежкият скрипт — при първото действие или след 3 сек.
  const events = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'];
  let loaded = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const load = () => {
    if (loaded) return;
    loaded = true;
    events.forEach((e) => window.removeEventListener(e, load));
    if (timer) clearTimeout(timer);
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GADS_ID;
    document.head.appendChild(s);
  };

  events.forEach((e) => window.addEventListener(e, load, { passive: true, once: true }));
  timer = setTimeout(load, 3000);
}

// ----------------------------------------------------------
// Покупка
// ----------------------------------------------------------

// 0894748101 -> +359894748101 ; +44 7946 095812 -> +447946095812
const toE164 = (raw: string): string => {
  let d = String(raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '359' + d.slice(1);
  return d.length >= 10 ? '+' + d : '';
};

/**
 * Праща покупката към Google Ads. Вика се от Checkout на същото място като
 * fbq('track', 'Purchase'), със СЪЩИЯ eventId → Google не брои една поръчка два пъти.
 * Имейлът и телефонът се ползват за „подобрени реализации“ (аналог на CAPI) —
 * Google ги кодира, преди да ги изпрати, и ги ползва само при дадено съгласие.
 */
export function trackGoogleAdsPurchase(p: {
  value: number;
  transactionId: string;
  email?: string;
  phone?: string;
}) {
  if (!isConfigured() || typeof window === 'undefined') return;
  const w = window as any;
  if (typeof w.gtag !== 'function') return;

  try {
    const userData: Record<string, string> = {};
    const email = String(p.email || '').trim().toLowerCase();
    if (email) userData.email = email;
    const phone = toE164(p.phone || '');
    if (phone) userData.phone_number = phone;
    if (Object.keys(userData).length > 0) {
      w.gtag('set', 'user_data', userData);
    }

    w.gtag('event', 'conversion', {
      send_to: GADS_ID + '/' + PURCHASE_LABEL,
      value: p.value,
      currency: 'EUR',
      transaction_id: p.transactionId,
    });
  } catch (error) {
    console.warn('Google Ads Purchase грешка:', error);
  }
}