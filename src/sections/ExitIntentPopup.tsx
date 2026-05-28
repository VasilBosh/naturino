import React, { useState, useEffect, useRef } from 'react';

export const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60); // 14 минути
  const [promoCode, setPromoCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  // Предпазител, който спира повторното отваряне при умишлено затваряне
  const isClosingRef = useRef(false);

  // Генериране на случаен код
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `NAT7-${result}`;
  };

  useEffect(() => {
    const isBuyer = localStorage.getItem('naturino_buyer');
    if (isBuyer) return;

    const initPopupData = () => {
      let savedCode = sessionStorage.getItem('naturino_promo_code');
      let savedExpiry = sessionStorage.getItem('naturino_promo_expiry');
      const now = Date.now();

      if (!savedCode || !savedExpiry || now > parseInt(savedExpiry)) {
        savedCode = generateUniqueCode();
        savedExpiry = (now + 14 * 60 * 1000).toString();
        
        sessionStorage.setItem('naturino_promo_code', savedCode);
        sessionStorage.setItem('naturino_promo_expiry', savedExpiry);
        setTimeLeft(14 * 60);
      } else {
        const remainingSeconds = Math.round((parseInt(savedExpiry) - now) / 1000);
        setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
      }
      
      setPromoCode(savedCode);
    };

    // --- ДЕСКТОП: Излизане с мишката ---
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) {
        initPopupData();
        setIsVisible(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // --- МОБИЛНИ: Бутон "Назад" ---
    window.history.pushState({ popupOnBack: true }, '');
    const handlePopState = () => {
      // Ако в момента затваряме умишлено чрез бутон, игнорираме popstate
      if (isClosingRef.current) return;

      initPopupData();
      setIsVisible(true);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Таймер
  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Сигурно копиране
  const copyToClipboard = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(promoCode)
        .then(() => triggerCopySuccess())
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = promoCode;
    textArea.style.position = "fixed"; 
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerCopySuccess();
    } catch (err) {
      console.error('Неуспешно копиране', err);
    }
    document.body.removeChild(textArea);
  };

  const triggerCopySuccess = () => {
    setHasCopied(true);
    window.dispatchEvent(new CustomEvent('NaturinoApplyDiscount', { detail: promoCode }));
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Функция при натискане на големия бутон - Активира отстъпката и затваря
  const handleApplyAndClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Изпращаме глобално събитие с кода към Checkout компонента
    window.dispatchEvent(new CustomEvent('NaturinoApplyDiscount', { detail: promoCode }));

    // 2. Вдигаме предпазителя и скриваме попъпа веднага
    isClosingRef.current = true;
    setIsVisible(false);
    
    if (window.history.state?.popupOnBack) {
      window.history.back();
    }

    // 3. Скролваме плавно до формата за поръчка и сваляме предпазителя след като историята се успокои
    setTimeout(() => {
      document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
      isClosingRef.current = false;
    }, 100);
  };

  const handleCloseOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    isClosingRef.current = true;
    setIsVisible(false);
    
    if (window.history.state?.popupOnBack) {
      window.history.back();
    }
    
    setTimeout(() => {
      isClosingRef.current = false;
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-emerald-500 relative text-center animate-bounceShort">
        
        {/* Х Бутон */}
        <button 
          type="button"
          onClick={handleCloseOnly}
          className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 font-bold text-2xl p-2 cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Заглавна Лента */}
        <div className="inline-flex items-center gap-2 bg-rose-500 text-white text-xs md:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 animate-pulse">
          🔥 ЕКСКЛУЗИВЕН БОНУС ОФЕРТА 🔥
        </div>
        
        {/* Заглавия */}
        <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight mb-3">
          Чакай малко! 🛑 <br />
          Вземи <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-black underline decoration-amber-400 decoration-4">7% ОТСТЪПКА</span> веднага! 🎁
        </h3>

        <p className="text-sm md:text-base text-slate-700 font-medium max-w-md mx-auto mb-5 leading-relaxed">
          Сложи край на кашлицата и безсънните нощи! Спести пари и осигури мощна натурална защита за твоето съкровище сега! 🧸✨
        </p>

        {/* Таймер */}
        {timeLeft > 0 ? (
          <div className="bg-amber-100/90 border border-amber-300 rounded-xl py-2 px-4 inline-flex items-center gap-2 mb-5">
            <span className="text-lg">⏳</span>
            <span className="text-xs md:text-sm font-bold text-slate-700">Офертата се саморазрушава след:</span>
            <span className="text-base font-black text-rose-600 font-mono">
              {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds} мин.
            </span>
          </div>
        ) : (
          <div className="bg-rose-100 border border-rose-300 rounded-xl py-2 px-4 inline-flex items-center gap-2 mb-5">
            <span className="text-sm font-black text-rose-700">⚠️ ВРЕМЕТО ИЗТЕЧЕ!</span>
          </div>
        )}

        {/* Секция Промокод */}
        {timeLeft > 0 && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-dashed border-emerald-400 rounded-2xl p-4 mb-5 relative">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2">👇 Твоят личен код за отстъпка 👇</p>
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 pl-4 shadow-inner">
              <span className="text-xl md:text-2xl font-mono font-black text-slate-800 tracking-widest select-all">
                {promoCode}
              </span>
              <button 
                type="button"
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs md:text-sm font-black py-3 px-5 rounded-lg transition-all shadow-md cursor-pointer active:scale-95 touch-manipulation"
              >
                {hasCopied ? 'Копиран! ✓' : 'Копирай 📋'}
              </button>
            </div>
          </div>
        )}

        {/* Секция за ФБ групата */}
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3.5 text-center mb-5 max-w-md mx-auto">
          <p className="text-xs md:text-sm text-emerald-950 font-medium leading-relaxed">
            📢 <strong>БОНУС:</strong> С поръчката днес получаваш и безплатен достъп до затворената ни <strong>ФБ общност на Naturino</strong>! Там стотици майки споделят съвети за детско здраве, имунитет и хранене! 👩‍👦‍👦
          </p>
        </div>

        {/* Голям Бутон */}
        <button 
          type="button"
          onClick={handleApplyAndClose}
          className="block w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:via-orange-600 hover:to-rose-600 text-white font-black text-base md:text-lg py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.01] active:scale-95 text-center cursor-pointer touch-manipulation"
        >
          ✅ АКТИВИРАЙ ОТСТЪПКАТА И ПРОДЪЛЖИ
        </button>
        
        {/* Долен линк за отказ */}
        <button 
          type="button"
          onClick={handleCloseOnly}
          className="text-xs text-slate-400 underline mt-4 block mx-auto hover:text-rose-500 font-bold transition-colors cursor-pointer"
        >
          Не, благодаря, ще купя на редовна цена 🥺
        </button>

      </div>

      <style>{`
        @keyframes bounceShort {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounceShort { animation: bounceShort 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ExitIntentPopup;