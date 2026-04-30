import { useEffect, useRef } from 'react';
import { Check, Leaf, Droplets, FileCheck } from 'lucide-react';

export function Ingredients() {
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

  const herbs = [
    { name: 'Планински лимон', benefit: 'Изключително богат на витамин C и антиоксиданти, подпомага клетъчната защита', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Черен бъз', benefit: 'Активира защитната реакция и повишава устойчивостта към инфекции', color: 'bg-purple-100 text-purple-700' },
    { name: 'Арония', benefit: 'Богата на естествени антиоксиданти, които подпомагат здравето отвътре', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Шипка', benefit: 'Богата на витамин C – повишава устойчивостта към болести', color: 'bg-red-100 text-red-700' },
    { name: 'Мащерка', benefit: 'Подкрепя дихателната система и предпазва от външни агресори', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Риган', benefit: 'Антибактериално действие – подкрепя имунната система в борбата срещу инфекции', color: 'bg-green-100 text-green-700' },
    { name: 'Салвия', benefit: 'Притежава мощни антибактериални, антиоксидантни и противовъзпалителни свойства', color: 'bg-teal-100 text-teal-700' },
    { name: 'Лайка', benefit: 'Подпомага възстановяването – има меко противовъзпалително действие', color: 'bg-amber-100 text-amber-700' },
    { name: 'Бял равнец', benefit: 'Балансира имунния отговор и подпомага детоксикацията.', color: 'bg-orange-100 text-orange-700' },
    { name: 'Джинджифил', benefit: 'Подпомага имунната устойчивост при сезонни вируси', color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="ingredients"
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <Leaf className="w-4 h-4" />
            <span>100% Натурални съставки</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            10 български билки и плодове за <span className="gradient-text">силен имунитет</span>
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Всяка съставка е внимателно подбрана за максимален ефект върху детския имунитет
          </p>
        </div>

        {/* Herbs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-10 md:mb-12">
          {herbs.map((herb, index) => (
            <div 
              key={index}
              className="reveal opacity-0 card-hover bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-5 text-center border border-slate-100"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 ${herb.color} rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3`}>
                <Leaf className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-slate-900 mb-1">{herb.name}</h3>
              <p className="text-xs md:text-sm text-slate-500">{herb.benefit}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="reveal opacity-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 md:mb-6">
                Защо Naturino Kids?
              </h3>
              <div className="space-y-3 md:space-y-4">
                {[
                  'Без изкуствени консерванти и добавки',
                  'Без захар - подходящ за диабетици',
                  'Без оцветители и ароматизатори',
                  'Подходящ за деца от 1.5 години (18 месеца)',
                  'Произведено в България',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-slate-700 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>

              {/* BABH Registration */}
              <div className="mt-5 md:mt-6 bg-white rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs md:text-sm">Регистриран в БАБХ</p>
                    <p className="font-bold text-slate-900 text-sm md:text-base">Рег.№ БАБХ - Т242506848 / 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base md:text-lg">Лесен прием</h4>
                  <p className="text-slate-500 text-sm">Течна форма за бързо усвояване</p>
                </div>
              </div>
              <div className="space-y-3 text-sm md:text-base">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Дозировка</span>
                  <span className="font-semibold text-slate-900">25 капки (1.2ml)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Честота</span>
                  <span className="font-semibold text-slate-900">2 пъти дневно</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Време</span>
                  <span className="font-semibold text-slate-900">Сутрин и вечер</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Курс</span>
                  <span className="font-semibold text-slate-900">Целогодишен</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
