import { useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, Award, ThumbsUp, FileCheck, BadgeCheck, ShoppingCart } from 'lucide-react';

export function Guarantee() {
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

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="container-custom">
        <div className="reveal opacity-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl md:rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="p-6 md:p-8 lg:p-12 xl:p-16">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
                <Award className="w-4 h-4" />
                <span>Гаранция за качество</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 md:mb-6">
                100% Гаранция за <span className="text-amber-300">удовлетворение</span>
              </h2>
              
              <p className="text-emerald-100 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                Вярваме в продукта си и искаме вие и вашето дете да сте напълно доволни. 
                Ако по някаква причина не сте удовлетворени, ние сме тук, за да помогнем.
              </p>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1">Удостоверение за качество</h3>
                    <p className="text-emerald-200 text-sm md:text-base">Продуктът притежава удостоверение за качество и отговаря на всички изисквания</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1">Регистриран в БАБХ</h3>
                    <p className="text-emerald-200 text-sm md:text-base">Рег.№ БАБХ - Т242506848 / 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1">Качествен продукт</h3>
                    <p className="text-emerald-200 text-sm md:text-base">Произведено по най-високи стандарти в България</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1">Лесно връщане</h3>
                    <p className="text-emerald-200 text-sm md:text-base">Ако имате проблем, свържете се с нас за решение</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ThumbsUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1">Доверие от родители</h3>
                    <p className="text-emerald-200 text-sm md:text-base">4000+ доволни семейства вече избраха Naturino Kids</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={scrollToCheckout}
                className="btn-cta-primary flex items-center justify-start gap-1 w-full sm:w-auto text-sm sm:text-base"
>
                <ShoppingCart className="w-10 h-10" /> {/* По-малка икона */}
                <span className="font-bold">ПОРЪЧАЙ СЕГА</span>
                <span className="cta-price text-xl px-2 px-1">19.90€</span>
                
            </button>

            </div>

            {/* Right Content - Badge */}
            <div className="relative flex items-center justify-center p-6 md:p-8 lg:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent" />
              <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-center shadow-2xl max-w-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3">
                  Гаранция за качество
                </h3>
                <p className="text-slate-600 text-sm md:text-base mb-4 md:mb-6">
                  Ние стоим зад продукта си с пълно доверие в неговото качество и ефективност.
                </p>
                
                {/* BABH Badge */}
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm md:text-base mb-1">
                    <BadgeCheck className="w-5 h-5" />
                    <span>Регистриран в БАБХ</span>
                  </div>
                  <p className="text-emerald-600 text-xs md:text-sm font-mono">Т242506848 / 2025</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm md:text-base">
                  <Award className="w-5 h-5" />
                  <span>Препоръчан от фармацевти</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
