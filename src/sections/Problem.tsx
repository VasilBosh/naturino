import { useEffect, useRef } from 'react';
import { AlertTriangle, Frown, Clock, Home, Briefcase, HeartCrack } from 'lucide-react';

export function Problem() {
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

  const problems = [
    {
      icon: <Frown className="w-8 h-8 md:w-10 md:h-10 text-red-500" />,
      title: 'Детето боледува постоянно',
      description: 'Всяка седмица нова кашлица, сополи или температура. Детската градина се превърна в източник на вируси.',
    },
    {
      icon: <Clock className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />,
      title: 'Безсънни нощи и тревога',
      description: 'Гледате как детето страда и не можете да му помогнете. Антибиотиците вече не действат.',
    },
    {
      icon: <Home className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />,
      title: 'Едно болно, всички болни',
      description: 'Вирусът обикаля цялото семейство. Сестричката или братчето също се разболяват.',
    },
    {
      icon: <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />,
      title: 'Пропускате работа',
      description: 'Трябва да отсъствате от работа, за да гледате болното дете. Заплатата намалява.',
    },
    {
      icon: <HeartCrack className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />,
      title: 'Чувство на безпомощност',
      description: 'Опитали сте всичко — сиропи, витамини, хомеопатия. Нищо не работи дългосрочно.',
    },
    {
      icon: <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />,
      title: 'Страх от химията',
      description: 'Всяко хапче натоварва детския черен дроб. Страхувате се от страничните ефекти.',
    },
  ];

  return (
    <section 
      id="problem"
      ref={sectionRef}
      className="section-padding bg-slate-50"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
            <span>Знаем какво преживявате</span>
          </div>
          
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            "Два дни на градина,<br className="hidden sm:block" />
            <span className="text-red-600">две седмици вкъщи..."</span>
          </h2>
          
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600 leading-relaxed">
            Ето реалността за хиляди български семейства. Всяка сутрин се молите детето да е здраво, 
            но на обяд звъни телефонът от детската градина.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="reveal opacity-0 card-hover bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                {problem.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{problem.title}</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Story Box */}
        <div className="reveal opacity-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8 items-center">
            
            {/* Текст (заема 3 от 5 колони на десктоп) */}
            <div className="md:col-span-3 text-center md:text-left order-2 md:order-1">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-emerald-900 mb-4 md:mb-6">
                Нашата история
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed mb-4 italic">
                "Ние сме семейство от Казанлък с две деца, което премина през едно от най-трудните изпитания за всеки родител – <strong className="text-emerald-700">постоянно боледуващо дете и безкрайни притеснения</strong>. Опитахме всичко – сиропи, витамини, различни подходи, но резултатите бяха временни или липсваха."
              </p>
              <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed italic">
                "Това ни подтикна да потърсим по-дълбо решение и да създадем <strong className="text-emerald-700">натурален продукт</strong>, на който истински вярваме и който днес помага на много други семейства."
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

            {/* Снимка (заема 2 от 5 колони на десктоп) */}
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