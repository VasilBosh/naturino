// Отложено зареждане на Facebook Pixel и Microsoft Clarity.
//
// Как работи:
//  - Пикселът се "записва" ВЕДНАГА (fbq опашка) — всички събития (PageView, ViewContent,
//    AddToCart, Purchase...) се пазят и НИЩО не се губи.
//  - Тежкият код на Facebook (fbevents.js) и Clarity се теглят при първото действие на
//    човека (скрол, докосване, клик, клавиш) или най-късно след 3 сек.
//  - Щом се зареди fbevents.js, изпраща всичко от опашката към Facebook.
// Не се броят само хора, които са отворили и затворили страницата, без да пипнат нищо.

/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */

const FB_SRC = 'https://connect.facebook.net/en_US/fbevents.js';
const CLARITY_SRC = 'https://www.clarity.ms/tag/wd5vkf28a7';

/** Създава опашката fbq (същата като в официалния код на Facebook), без да тегли скрипта. */
export function installFbqQueue() {
  const w = window as any;
  if (w.fbq) return;
  const n: any = (w.fbq = function () {
    if (n.callMethod) n.callMethod.apply(n, arguments);
    else n.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
}

function addScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function loadClarity() {
  const w = window as any;
  if (!w.clarity) {
    w.clarity = function () {
      (w.clarity.q = w.clarity.q || []).push(arguments);
    };
  }
  addScript(CLARITY_SRC);
}

let started = false;

/** Тегли fbevents.js и Clarity при първото действие или след 3 сек. */
export function loadThirdPartyOnInteraction(withPixel: boolean) {
  if (started) return;
  const events = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'];

  const go = () => {
    if (started) return;
    started = true;
    events.forEach((e) => window.removeEventListener(e, go));
    clearTimeout(timer);
    if (withPixel) addScript(FB_SRC);
    loadClarity();
  };

  events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
  const timer = setTimeout(go, 3000);
}
