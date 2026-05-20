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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      </div>
    </section>
  );
}