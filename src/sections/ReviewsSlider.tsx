import { useEffect, useRef } from 'react';

const reviews = Array.from(
  { length: 9 },
  (_, index) => `/social/${index + 1}.jpg`
);

export function ReviewsSlider() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1, rootMargin: '300px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reviews-slider"
      className="bg-slate-50 overflow-hidden py-10 md:py-14"
    >
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Testimonials Slider (Auto-marquee с автентични картинки) */}
        <div className="reveal opacity-0 relative">
          {/* Странично избледняване за визуален баланс */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 animate-scroll hover:[animation-play-state:paused] w-max py-2">
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={index}
                className="w-[260px] sm:w-[280px] md:w-[320px] flex-shrink-0"
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

          {/* Инструкция за мобилни устройства */}
          <p className="block md:hidden text-center text-[11px] font-bold text-rose-500 italic mt-3 px-4 leading-relaxed animate-pulse">
            Ако искате да спрете на даден отзив, просто го натиснете. За да преминете на следващ, натиснете на този текст.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 10px)); } /* 10px е половината от gap-5 */
        }
        .animate-scroll {
          animation: scroll 50s linear infinite;
        }
      `}} />
    </section>
  );
}