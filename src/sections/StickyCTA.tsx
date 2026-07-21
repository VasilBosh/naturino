import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StickyCTA() {
  const [scrolledEnough, setScrolledEnough] = useState(false);   // скролнали ли сме > 500px
  const [checkoutInView, setCheckoutInView] = useState(false);   // вижда ли се чек аутът
  const [commentsVisible, setCommentsVisible] = useState(false); // вижда ли се секцията с коментари поне 20%
  const [isClosedByUser, setIsClosedByUser] = useState(false);   // затворен ли е ръчно с X

  // 1. Скрол прагът от 500px
  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2. Чек аут — следим само дали се вижда изобщо
  useEffect(() => {
    const checkout = document.getElementById('checkout');
    if (!checkout) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCheckoutInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(checkout);
    return () => observer.disconnect();
  }, []);

  // 3. Коментари — показваме бутона щом 20% от секцията са видими
  useEffect(() => {
    const comments = document.getElementById('CheckoutSocialProof'); // <-- id на секцията с коментари
    if (!comments) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCommentsVisible(entry.isIntersecting),
      { threshold: 0.02} // 20%
    );
    observer.observe(comments);
    return () => observer.disconnect();
  }, []);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ЛОГИКА ЗА ПОКАЗВАНЕ:
  // - не е затворен ръчно
  // - скролнали сме поне 500px
  // - НЕ сме на чек аута  ИЛИ  коментарите са 20% видими
  const shouldShow =
    !isClosedByUser && scrolledEnough && (!checkoutInView || commentsVisible);

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl animate-fadeInUp">
      <div className="container-custom py-3 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Left - Price Info */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:block">
              <p className="text-slate-500 text-xs md:text-sm">Naturino Kids</p>
              <p className="font-bold text-slate-900 text-sm md:text-base">100% Билков екстракт</p>
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
              onClick={() => setIsClosedByUser(true)}
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