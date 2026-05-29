import React, { useState, useEffect, useRef } from 'react';

export const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isClosingRef = useRef(false);
  const isSetupRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Проверка за размер на екрана (телефони и таблети под 1024px)
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // 2. Основна бизнес логика и улавяне на бутона "Назад"
  useEffect(() => {
    if (!isMobile || isSetupRef.current) return;
    isSetupRef.current = true;

    // --- ТОЧНИТЕ ТВОИ МАРКЕТИНГОВИ ПРОВЕРКИ ---
    const isBuyer = localStorage.getItem('naturino_buyer');
    const hasSeenReviews = localStorage.getItem('naturino_clicked_reviews');
    const hasRefusedInSession = sessionStorage.getItem('naturino_refused_exit_popup');
    
    // Ако е купувач, ако вече е гледал отзивите ИЛИ ако вече е отказал в СЕГАШНАТА сесия -> НЕ показваме
    if (isBuyer || hasSeenReviews || hasRefusedInSession) return;

    // Подсигуряване на историята на браузъра
    const setupHistory = () => {
      if (window.history.state?.popupId === 'active') return;
      window.history.pushState({ popupId: 'base' }, '');
      window.history.pushState({ popupId: 'active' }, '');
    };

    setupHistory();

    // Слушател за докосване (активира историята при първо събитие на мобилния)
    const handleTouch = () => {
      setupHistory();
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleTouch);
    };
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('click', handleTouch);

    // Слушател за хардуерния бутон "Назад"
    const handlePopState = () => {
      if (isClosingRef.current) return;

      // Потребителят се опитва да излезе -> показваме попъпа!
      setIsVisible(true);

      // Връщаме състоянието веднага, за да не се затвори таба директно
      window.history.pushState({ popupId: 'active' }, '');
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleTouch);
      isSetupRef.current = false;
    };
  }, [isMobile]);

  if (!isMobile) return null;
  if (!isVisible) return null;

  // ДЕЙСТВИЕ 1: Иска да види отзивите (БЛОКИРАН ЗАВИНАГИ)
  const handleScrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isClosingRef.current = true;
    setIsVisible(false);
    
    // Записваме ЗАВИНАГИ в паметта
    localStorage.setItem('naturino_clicked_reviews', 'true');
    
    // Изчистваме историята, която вкарахме, за да скролираме чисто
    if (window.history.length > 2) {
      window.history.go(-2);
    }

    setTimeout(() => {
      document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' });
      isClosingRef.current = false;
    }, 150);
  };

  // ДЕЙСТВИЕ 2: Натиска "Не, благодаря" или "✕" (БЛОКИРАН САМО ЗА ТЕКУЩАТА СЕСИЯ)
  const handleCloseAndExitSite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    isClosingRef.current = true;
    setIsVisible(false);
    
    // Записваме САМО за текущата сесия (sessionStorage). 
    // След като затвори браузъра/таба — този запис изчезва!
    sessionStorage.setItem('naturino_refused_exit_popup', 'true');
    
    // Пускаме браузъра да извърши излизането назад
    if (window.history.length > 2) {
      window.history.go(-2);
    }
    
    setTimeout(() => {
      isClosingRef.current = false;
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-white to-emerald-50/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 relative text-center">
        
        <span className="absolute -top-3 -left-3 text-2xl filter drop-shadow">🌿</span>
        <span className="absolute -bottom-3 -right-3 text-2xl filter drop-shadow">🍓</span>

        {/* Х Бутон - държи се точно като "Не, благодаря" (спира го само за сесията) */}
        <button 
          type="button"
          onClick={handleCloseAndExitSite}
          className="absolute top-4 right-4 text-emerald-400 hover:text-rose-500 font-bold text-xl p-1 cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div className="text-4xl mb-2 flex justify-center gap-1">
          <span>🌿</span><span>🛑</span><span>🍋</span>
        </div>
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-4">
          Чакай! Видя ли отзивите на майките?
        </h3>

        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-5">
          Над <span className="font-black text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md">4,760 семейства</span> вече забравиха за постоянните боледувания. Децата играят здрави в градината, а родителите са спокойни! 🧸✨
        </p>

        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 mb-6 shadow-sm text-xs sm:text-sm text-slate-600 leading-relaxed">
          Виж истинските истории на <strong>Елена Костова</strong>, <strong>Ивелина Станчева</strong>, <strong>Антония Николова</strong>... 💬
        </div>

        <button 
          type="button"
          onClick={handleScrollToReviews}
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm sm:text-base md:text-lg py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.01] active:scale-95 text-center cursor-pointer touch-manipulation uppercase tracking-wide"
        >
          ВИЖ ОТЗИВИТЕ СЕГА →
        </button>
        
        <button 
          type="button"
          onClick={handleCloseAndExitSite}
          className="text-xs sm:text-sm text-emerald-600/70 underline mt-4 block mx-auto hover:text-emerald-700 font-bold transition-colors cursor-pointer"
        >
          Не, благодаря
        </button>

      </div>
    </div>
  );
};

export default ExitIntentPopup;