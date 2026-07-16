import { MessageCircle } from 'lucide-react';

const reviews = Array.from(
  { length: 14 },
  (_, index) => `/social/${index + 1}.jpg`
);

export function CheckoutSocialProof() {
  return (
    <section className="bg-slate-50 overflow-hidden py-12 md:py-20 w-full">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Заглавие - Запазено в същия стил за консистентност */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageCircle className="w-4 h-4" />
            <span>Още отзиви от групата на майките на Naturino</span>
          </div>
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-[1.15] tracking-tight">
            Още отзиви от затворената ни{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
              Facebook група и Viber
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Резултатите и споделените истории на родителите, които прекъснаха безкрайния цикъл на боледуване на децата им.
          </p>
        </div>

        {/* Мобилни устройства — Чисти скриншотове без "карти" и кутии */}
        <div className="mx-auto flex w-full max-w-md flex-col gap-5 lg:hidden">
          {reviews.map((review, index) => (
            <img
              key={review}
              src={review}
              alt={`Отзив от родител ${index + 1}`}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="block h-auto w-full object-contain rounded-xl shadow-sm border border-slate-200/60"
            />
          ))}
        </div>

        {/* Десктоп — Плавен авто-скрол на суровите скриншотове */}
        <div className="hidden lg:block relative mb-10">
          {/* Странично преливане за визуален баланс */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Плъзгащ се ред без рамки и бели контейнери */}
          <div className="flex gap-5 animate-scrollCheckout hover:[animation-play-state:paused] w-max py-2">
            {[...reviews, ...reviews].map((review, index) => (
              <div 
                key={index}
                className="w-[280px] md:w-[320px] flex-shrink-0"
              >
                <img
                  src={review}
                  alt={`Отзив от родител ${(index % reviews.length) + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-contain rounded-xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Анимация за плавно движение */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollCheckout {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); } /* 10px е половината от gap-5 */
        }
        .animate-scrollCheckout {
          animation: scrollCheckout 50s linear infinite;
        }
      `}} />
    </section>
  );
}