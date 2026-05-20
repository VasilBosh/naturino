import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

export function Story() {
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
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="story"
      ref={sectionRef}
      className="section-padding bg-slate-50"
    >
      <div className="container-custom">
        <div className="reveal opacity-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8 items-center">
            
            {/* Текст */}
            <div className="md:col-span-3 text-center md:text-left order-2 md:order-1">
              <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">
                <Heart className="w-3 h-3 md:w-4 md:h-4" />
                <span>Нашата история</span>
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-900 mb-4 md:mb-6">
                От безпомощност към решение
              </h2>

              <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed mb-4 italic">
                "Ние сме семейство от Казанлък с две деца, което премина през едно от най-трудните изпитания за всеки родител – <strong className="text-emerald-700">постоянно боледуващо дете и безкрайни притеснения</strong>. Опитахме всичко – сиропи, витамини, различни подходи, но резултатите бяха временни или липсваха."
              </p>
              <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed italic">
                "Това ни подтикна да потърсим по-дълбоко решение и да създадем <strong className="text-emerald-700">натурален продукт</strong>, на който истински вярваме и който днес помага на много други семейства."
              </p>
              <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shrink-0">
                  НК
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm md:text-base">Екипът на Naturino Kids</p>
                  <p className="text-xs md:text-sm text-slate-500">Казанлък, България</p>
                </div>
              </div>
            </div>

            {/* Снимка */}
            <div className="md:col-span-2 order-1 md:order-2 flex justify-center">
              <div className="relative p-2 bg-white rounded-2xl shadow-md border border-slate-100 max-w-[280px] sm:max-w-[320px] md:max-w-none transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img 
                  src="/images/plami.webp" 
                  alt="Семейството зад Naturino Kids" 
                  className="rounded-xl w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}