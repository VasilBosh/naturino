import { useEffect, useRef } from 'react';
import { Check, FileCheck, ShieldCheck, Leaf, BadgeCheck } from 'lucide-react';

const Sertifikat = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

  const qualityPoints = [
    {
      icon: FileCheck,
      title: 'Регистрация в БАБХ',
      text: 'Рег. № T242506848/02.09.2025',
    },
    {
      icon: Leaf,
      title: 'Без използване на ГМО',
      text: 'Чист водно-глицеринов билков екстракт.',
    },
    {
      icon: ShieldCheck,
      title: 'HACCP контрол',
      text: 'Производство при санитарно-хигиенни норми.',
    },
    {
      icon: BadgeCheck,
      title: 'ISO 22000:2018',
      text: 'Международен стандарт за безопасност на храните.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="sertifikat"
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <FileCheck className="w-4 h-4" />
            <span>Официално удостоверение</span>
          </div>

          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Удостоверение за качество.
            <span className="gradient-text block">
              Спокойствие за всяка майка
            </span>
          </h2>

          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Naturino Kids притежава удостоверение за качество и регистрация в
            БАБХ. Продуктът се произвежда по контролирани стандарти, със
            спазване на добри производствени и хигиенни практики.
          </p>
        </div>

        {/* Main rounded green box - same style as Ingredients */}
        <div className="reveal opacity-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left content */}
            <div className="order-2 md:order-1">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 md:mb-6">
                Проверено качество, което можеш да видиш
              </h3>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {[
                  'Официално удостоверение за качество',
                  'Регистрация в Българската агенция по безопасност на храните',
                  'Производство по контролирани стандарти',
                  'Без използване на ГМО',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-slate-700 text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {qualityPoints.map((point, index) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-emerald-100 shadow-sm"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm md:text-base mb-1">
                        {point.title}
                      </h4>

                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                        {point.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToCheckout}
                  className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
                >
                  ПОРЪЧАЙ С ДОВЕРИЕ →
                </button>

                <p className="text-center sm:text-left text-sm font-semibold text-slate-600">
                  19.90€ • Плащане при получаване
                </p>
              </div>
            </div>

            {/* Right certificate */}
            <div className="order-1 md:order-2">
              <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[350px] md:max-w-[360px] lg:max-w-[560px]">
                {/* soft glow only, without white frame */}
                <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-emerald-300/20 blur-2xl" />

                <div className="relative">
                  <img
                    src="/sertifikat.png"
                    alt="Удостоверение за качество на Naturino Kids"
                    className="h-auto w-full rounded-xl object-contain shadow-2xl shadow-emerald-900/15"
                    loading="lazy"
                  />

                  <img
                    src="/quality-badge.png"
                    alt="Бадж за проверено качество"
                    className="
                      pointer-events-none absolute z-20 object-contain drop-shadow-xl
                      left-[1px] top-[12%] h-[72px] w-[72px]
                      sm:left-[-12px] sm:top-[12%] sm:h-20 sm:w-20
                      md:left-[-12px] md:top-[12%] md:h-22 md:w-22
                      lg:left-[1px] lg:top-[12%] lg:h-28 lg:w-28
                    "
                    loading="lazy"
                  />
                </div>

                <p className="mx-auto mt-4 max-w-md text-center text-xs md:text-sm font-medium leading-5 md:leading-6 text-slate-600">
                  Документът удостоверява качеството, регистрацията и
                  производствените стандарти на продукта.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sertifikat;