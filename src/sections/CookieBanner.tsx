import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  needsConsentChoice,
  setConsent,
  setCookieBannerOpen,
  type ConsentChoice,
} from '../utils/googleAds';

/**
 * CookieBanner — лента за съгласие (само за Google Ads), от край до край на екрана.
 *
 * - Показва се ЕДВА СЛЕД като посетителят е подминал Hero секцията (първата <section>
 *   на страницата). Ако някога Hero спре да е първата секция — смени селектора в getHero().
 * - Заема поне 30% от височината на екрана (телефон и компютър), сив фон — да се забелязва.
 * - Докато лентата е отворена, StickyCTA се крие (заема неговото място).
 *   Щом човекът избере (каквото и да е) — лентата изчезва завинаги, стикито се връща.
 * - Отказът е реален и на един клик. Поръчката работи нормално и при отказ.
 */

// Hero е първата <section> на началната страница
const getHero = () => document.querySelector('#root section');

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!needsConsentChoice()) return;

    const onScroll = () => {
      const hero = getHero();
            const passedHero = hero ? hero.getBoundingClientRect().bottom <= window.innerHeight + 1500 : window.scrollY > 150;
      if (passedHero) {
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Казваме на StickyCTA дали лентата е отворена
  useEffect(() => {
    setCookieBannerOpen(visible);
    return () => setCookieBannerOpen(false);
  }, [visible]);

  if (!visible) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Бисквитки"
      className="fixed bottom-0 left-0 right-0 z-[60] min-h-[30vh] flex items-center bg-slate-100 border-t-2 border-slate-300 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] animate-fadeInUp"
    >
      <div className="container-custom w-full pt-5 md:pt-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl font-black text-slate-900 mb-2">
            🍪 Този сайт използва бисквитки
          </p>

          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            Използваме бисквитки, за да подобряваме работата на сайта, да разбираме кои от рекламите ни
            са полезни и да показваме по-подходящо съдържание. Част от тях се използват от наши партньори,
            като Google. Можете да промените избора си по всяко време от страницата{' '}
            <Link to="/privacy" className="underline font-semibold text-slate-800 hover:text-slate-950 whitespace-nowrap">
              „Поверителност“
            </Link>
            .
          </p>

          <div className="mt-5 md:mt-6 flex items-center justify-end gap-6">
            <button
              type="button"
              onClick={() => choose('denied')}
              className="text-sm md:text-base text-slate-500 hover:text-slate-700 hover:underline underline-offset-2 py-2 px-1"
            >
              Отказвам
            </button>
            <button
              type="button"
              onClick={() => choose('granted')}
              className="text-base font-black text-emerald-700 bg-white border-2 border-emerald-600 rounded-xl px-8 py-3 shadow-sm hover:bg-emerald-50 active:scale-[.98] transition"
            >
              Приемам
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
