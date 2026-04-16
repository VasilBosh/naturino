import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react'; // 1. Добавихме useEffect

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false); // 2. Първоначално е false
  const [isAtCheckout, setIsAtCheckout] = useState(false); // 3. Следим дали сме на чек аута
  const [isClosedByUser, setIsClosedByUser] = useState(false); // 4. Ако потребителят го затвори ръчно

  useEffect(() => {
    const handleScroll = () => {
      if (isClosedByUser) return; // Ако е затворен от X, не прави нищо

      // 5. Проверка за появяване (след 500px скрол)
      const shouldShow = window.scrollY > 500;

      // 6. Проверка за изчезване (дали чек аута е на екрана)
      const checkoutSection = document.getElementById('checkout');
      if (checkoutSection) {
        const rect = checkoutSection.getBoundingClientRect();
        // Ако горният край на чек аута влезе в изгледа на браузъра
        const atCheckout = rect.top < window.innerHeight - 100; 
        setIsAtCheckout(atCheckout);
      }

      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClosedByUser]);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ЛОГИКА ЗА СКРИВАНЕ: 
  // Ако е затворен от потребителя ИЛИ още не сме скролнали достатъчно ИЛИ вече сме на чек аута
  if (isClosedByUser || !isVisible || isAtCheckout) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl animate-fadeInUp">
      <div className="container-custom py-3 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Left - Price Info */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <p className="text-slate-500 text-xs md:text-sm">Naturino Kids</p>
              <p className="font-bold text-slate-900 text-sm md:text-base">Имуностимулатор</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-sm md:text-base">39.80€</span>
              <span className="text-emerald-600 font-black text-lg md:text-2xl">19.90€</span>
            </div>
          </div>

          {/* Right - CTA */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={scrollToCheckout}
              className="btn-cta-sticky flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">ПОРЪЧАЙ СЕГА</span>
              <span className="sm:hidden">ПОРЪЧАЙ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsClosedByUser(true)} // Променихме това, за да не се появява пак
              className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}