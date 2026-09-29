// ==========================================================
// FACEBOOK PIXEL + CLARITY
// Инициализират се ВЕДНЪЖ (от main.tsx), преди страницата да се покаже — така и
// събитията от секциите (напр. ViewContent в Checkout) винаги тръгват СЛЕД init.
// Пиксел ID-то идва от .env (VITE_FB_PIXEL_ID), както досега.
// ==========================================================
import ReactPixel from 'react-facebook-pixel';
import { installFbqQueue, loadThirdPartyOnInteraction } from './thirdParty';

export function initTracking() {
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
  if (pixelId) {
    // Опашката на пиксела се създава веднага (събитията се пазят), а тежкият код на
    // Facebook и Clarity се теглят при първото действие на човека или след 3 сек.
    installFbqQueue();
    ReactPixel.init(pixelId, undefined, {
      autoConfig: true,
      debug: false,
    });
    ReactPixel.pageView();
  }
  loadThirdPartyOnInteraction(!!pixelId);
}
