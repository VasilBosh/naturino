import { useEffect, useRef } from 'react';
import { Check, Sparkles, Shield, Leaf, Award, Baby, ArrowRight, Heart } from 'lucide-react';

export function Solution() {
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

  const benefits = [
    'Подсилва имунитета естествено',
    'Защитава от вируси и бактерии',
    'Подходящ за целогодишна употреба',
    'Без странични ефекти',
    'Лесен за прием от деца',
    'Резултати още от първата седмица',
  ];

  const features = [
    {
      icon: <Leaf className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,
      title: '100% Натурален',
      description: 'Само билки и плодове',
    },
    {
      icon: <Baby className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      title: 'За деца над 18м',
      description: 'Безопасен за малките',
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,
      title: 'Без консерванти',
      description: 'Чиста формула',
    },
    {
      icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      title: 'Препоръчан',
      description: 'От лекари и фармацевти',
    },
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>Решението, което търсите</span>
          </div>

          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Naturino Kids —<br className="hidden sm:block" />
            <span className="gradient-text">Натуралният щит на детето</span>
          </h2>

          <p className="reveal opacity-0 text-base md:text-lg text-slate-600 leading-relaxed">
            Уникална комбинация от <strong>10 български билки и плодове</strong>,
            която подсилва имунната система по естествен начин.
            Без химия, без странични ефекти.
          </p>

          {/* BioHerb Mechanism */}
          <div className="reveal opacity-0 mt-7 md:mt-10 relative overflow-hidden rounded-[28px] border border-emerald-200 bg-white p-1 shadow-2xl shadow-emerald-100/70">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-amber-100" />
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-300/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-16 w-44 h-44 bg-amber-300/40 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10 rounded-[24px] bg-white/90 backdrop-blur-xl p-5 sm:p-6 md:p-8">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white text-xs sm:text-sm font-black tracking-wide shadow-lg shadow-emerald-300/50">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  УНИКАЛЕН МЕХАНИЗЪМ
                </div>
              </div>

              <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-slate-950 mb-3">
                BioHerb™-10
              </h3>

              <p className="text-center text-sm sm:text-base md:text-lg font-semibold text-slate-600 mb-6">
                системата зад Naturino Kids
              </p>

              <div className="space-y-4 text-left">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 md:p-5">
                  <p className="text-[15px] md:text-base leading-7 text-slate-700">
                    Naturino Kids е изграден на базата на уникалния механизъм на системата
                    <strong className="text-emerald-700"> BioHerb™-10</strong>.
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 md:p-5">
                  <p className="text-[15px] md:text-base leading-7 text-slate-700">
                    Тази система е уникална заради изключително редкия
                    <strong className="text-amber-700"> планински лимон (Chaenomeles maulei)</strong> —
                    плод, съдържащ до <strong>5 пъти повече витамин C</strong> от обикновения лимон
                    и до <strong>10 пъти повече витамин P</strong> от ябълките.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white border border-emerald-100 p-4 text-center shadow-sm">
                    <div className="text-3xl font-black text-emerald-600">5x</div>
                    <p className="text-xs font-bold text-slate-600 mt-1">повече витамин C</p>
                  </div>

                  <div className="rounded-2xl bg-white border border-amber-100 p-4 text-center shadow-sm">
                    <div className="text-3xl font-black text-amber-600">10x</div>
                    <p className="text-xs font-bold text-slate-600 mt-1">повече витамин P</p>
                  </div>

                  <div className="rounded-2xl bg-white border border-emerald-100 p-4 text-center shadow-sm">
                    <div className="text-3xl font-black text-emerald-600">98%</div>
                    <p className="text-xs font-bold text-slate-600 mt-1">усвояемост</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] shadow-2xl shadow-emerald-200">
                  <div className="rounded-3xl bg-white p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🌿</span>
                      <span className="font-black text-emerald-700 uppercase tracking-wide text-sm">
                        Тайната на BioHerb™-10
                      </span>
                    </div>

                    <p className="text-[15px] md:text-base leading-7 text-slate-700">
                      Именно той осигурява над
                      <strong className="text-emerald-700"> 98% усвояемост </strong>
                      на останалите девет билки, подбрани по специална фитотерапевтична таблица
                      и съобразени с детския организъм до най-малките.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 md:p-5 shadow-xl shadow-emerald-200">
                  <p className="text-[15px] md:text-base leading-7 text-white">
                    Затова Naturino Kids е един от малкото продукти на пазара подходящ за деца от
                    <strong> 18 месеца</strong> — 100% натурален, изследван и регистриран в
                    Българската агенция по безопасност на храните.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10 md:mb-16">
          {/* Left - Benefits */}
          <div className="reveal opacity-0">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">
              Какво получавате:
            </h3>

            <ul className="space-y-3 mb-6 md:mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <span className="text-slate-700 text-sm md:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 md:p-5 rounded-r-xl mb-6">
              <p className="text-slate-800 text-sm md:text-base">
                <strong>Важно:</strong> Продуктът е наличен в
                <strong className="text-emerald-700"> Аптеки Апостолов</strong> —
                една от най-големите аптечни вериги в България!
              </p>
            </div>

            <button
              onClick={scrollToCheckout}
              className="btn-cta-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Heart className="w-5 h-5" />
              ИСКАМ ЗДРАВО ДЕТЕ
              <ArrowRight className="cta-arrow w-5 h-5" />
            </button>
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="reveal opacity-0 card-hover bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center mb-3">
                  {feature.icon}
                </div>

                <h4 className="text-sm md:text-base font-bold text-slate-900 mb-1">
                  {feature.title}
                </h4>

                <p className="text-slate-600 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="reveal opacity-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-8">
              Как се приема?
            </h3>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <p className="text-emerald-100 text-sm md:text-base lg:text-lg leading-relaxed text-center">
                <strong className="text-white">Прием:</strong> сутрин и вечер преди ядене по 25 капки (1.2 мл)
                в малко вода или сок, или директно под езика. Капките са с приятен, естествено сладък вкус.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-6">
              <div className="text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">
                  1
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">Сутрин преди храна</h4>
                <p className="text-emerald-100 text-xs md:text-sm">Всеки ден</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">
                  2
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">Вечер преди храна</h4>
                <p className="text-emerald-100 text-xs md:text-sm">Всеки ден</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">
                  3
                </div>
                <h4 className="font-bold text-sm md:text-base mb-1">Силен имунитет</h4>
                <p className="text-emerald-100 text-xs md:text-sm">Още от първата седмица</p>
              </div>
            </div>

            <p className="text-center mt-6 md:mt-8 text-emerald-100 text-sm md:text-base">
              <strong>Едно шише (50ml) стига за около 20 дни!</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}