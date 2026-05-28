import React, { useState, useEffect, useRef } from 'react';

export const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isClosingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Проверяваме размера на екрана още при зареждане
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkSize(); // Изпълняваме веднага
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // 2. Основна логика за попъпа (изпълнява се само ако сме на мобилно устройство)
  useEffect(() => {
    if (!isMobile) return;

    const isBuyer = localStorage.getItem('naturino_buyer');
    const hasSeenReviews = localStorage.getItem('naturino_clicked_reviews');
    const hasRefusedInSession = sessionStorage.getItem('naturino_refused_exit_popup');
    
    if (isBuyer || hasSeenReviews || hasRefusedInSession) return;

    // Слагаме състоянието в историята чисто
    window.history.pushState({ popupOnBack: true }, '');
    
    const handlePopState = () => {
      if (isClosingRef.current) return;
      setIsVisible(true);
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMobile]);

  // АКО Е ДЕСКТОП (компютър), кодът спира дотук и не прави нищо!
  if (!isMobile) return null;
  if (!isVisible) return null;

  // Клик на големия бутон: Праща към отзивите и БЛОКИРА попъпа ЗАВИНАГИ
  const handleScrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isClosingRef.current = true;
    setIsVisible(false);
    
    localStorage.setItem('naturino_clicked_reviews', 'true');
    
    if (window.history.state?.popupOnBack) {
      window.history.back();
    }

    setTimeout(() => {
      document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' });
      isClosingRef.current = false;
    }, 150); // Леко увеличих времето за по-сигурна реакция на телефона
  };

  // Клик на "Не, благодаря": Излиза от сайта, блокира САМО за сесията
  const handleCloseAndExitSite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    isClosingRef.current = true;
    setIsVisible(false);
    
    sessionStorage.setItem('naturino_refused_exit_popup', 'true');
    
    if (window.history.state?.popupOnBack) {
      window.history.back();
    }
    
    setTimeout(() => {
      isClosingRef.current = false;
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-white to-emerald-50/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 relative text-center">
        
        {/* Декоративни свежи елементи */}
        <span className="absolute -top-3 -left-3 text-2xl filter drop-shadow">🌿</span>
        <span className="absolute -bottom-3 -right-3 text-2xl filter drop-shadow">🍓</span>

        {/* Х Бутон */}
        <button 
          type="button"
          onClick={handleCloseAndExitSite}
          className="absolute top-4 right-4 text-emerald-400 hover:text-rose-500 font-bold text-xl p-1 cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Приветлив стоп сигнал */}
        <div className="text-4xl mb-2 flex justify-center gap-1">
          <span>🌿</span><span>🛑</span><span>🍋</span>
        </div>
        
        {/* Заглавие */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-4">
          Чакай! Видя ли отзивите на майките?
        </h3>

        {/* Основно послание */}
        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-5">
          Над <span className="font-black text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md">4,760 семейства</span> вече забравиха за постоянните боледувания. Децата играят здрави в градината, а родителите са спокойни! 🧸✨
        </p>

        {/* Социално доказателство */}
        <div className="bg-white/90 border border-emerald-100 rounded-2xl p-4 mb-6 shadow-sm text-xs sm:text-sm text-slate-600 leading-relaxed">
          Виж истинските истории на <strong>Елена Костова</strong>, <strong>Ивелина Станчева</strong>, <strong>Антония Николова</strong> и как те спряха омагьосания кръг с антибиотиците. 💬
        </div>

        {/* Бутон за отзивите */}
        <button 
          type="button"
          onClick={handleScrollToReviews}
          className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm sm:text-base md:text-lg py-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.01] active:scale-95 text-center cursor-pointer touch-manipulation uppercase tracking-wide"
        >
          ВИЖ ОТЗИВИТЕ СЕГА →
        </button>
        
        {/* Бутон "Не, благодаря" */}
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