import { useEffect, useRef, useState } from 'react';
import { ShieldAlert, HeartCrack, GlassWater, Sparkles, Ban } from 'lucide-react';

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const deepProblems = [
    {
      icon: <ShieldAlert className="w-6 h-6 md:w-7 md:h-7 text-red-500 group-hover:scale-110 transition-transform duration-300" />,
      bg: 'bg-red-50',
      title: 'Капанът „3 дни градина, 2 седмици вкъщи. Отново и отново...“',
      description: 'Пак болнични, пак звънене на шефа със свито сърце и неудобство пред колегите. Имаш чувството, че кариерата и майчинството ти се сриват едновременно.',
    },
    {
      icon: <HeartCrack className="w-6 h-6 md:w-7 md:h-7 text-rose-500 group-hover:animate-pulse transition-transform duration-300" />,
      bg: 'bg-rose-50',
      title: 'Усещане за пълен родителски провал',
      description: 'Когато детето се мъчи с температура през нощта, а ти стоиш до леглото му безсилна. Обзема те парализиращ страх, че не можеш да опазиш собственото си съкровище.',
    },
    {
      icon: <GlassWater className="w-6 h-6 md:w-7 md:h-7 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />,
      bg: 'bg-amber-50',
      title: 'Купища пари за нулев ефект',
      description: 'Омръзна ли ти да оставяш половин заплата в аптеката за скъпи сиропи и химии, които само замазват положението за момента, а детето продължава да боледува?',
    },
    {
      icon: <Ban className="w-6 h-6 md:w-7 md:h-7 text-purple-500 group-hover:scale-105 transition-transform duration-300" />,
      bg: 'bg-purple-50',
      title: 'Страх от увреждане с тежка химия',
      description: 'Поредният антибиотик? Душата ти се къса, че вместо да засилиш имунитета му, постоянно тъпчеш крехкото му стомахче и органи с агресивни лекарства.',
    },
    {
      icon: <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-orange-500 group-hover:animate-bounce transition-transform duration-300" />,
      bg: 'bg-orange-50',
      title: 'Болестите „крадат“ детството му',
      description: 'Вместо безгрижни игри навън, тичане в парка и щастливи спомени, детството му минава между четири стени, термометри, инхалатори и ходене по лекари.',
    },
  ];

  return (
    <section 
      id="problem"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Основна Кука от Дълбокия Проблем */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className={`inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute inline-flex"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            <span className="ml-2">Майчинството не трябваше да бъде безкраен стрес...</span>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="block text-slate-800 text-2xl sm:text-3xl font-medium mb-2">Събуждаш ли се със</span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
              свито сърце всяка сутрин,
            </span>
            <span className="block text-2xl sm:text-3xl font-medium mt-2">само за да провериш дали челото му е горещо?</span>
          </h2>
          
          <p className={`text-base md:text-lg text-slate-600 leading-relaxed transition-all duration-700 delay-400 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Писна ли ти да живееш в капан? Гледаш как детето ти се топи от поредния вирус, 
            аптеката ти взема половин заплата, а ти се чувстваш напълно изтощена, виновна и безсилна.
          </p>
        </div>

        {/* Problems Grid / 5-те Дълбоки Проблема */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 justify-center">
          {deepProblems.map((problem, index) => (
            <div 
              key={index}
              className={`group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 hover:border-rose-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 active:scale-[0.99] touch-manipulation ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${index === 3 || index === 4 ? 'lg:col-span-1 lg:max-w-md mx-auto w-full' : ''}`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${problem.bg} flex items-center justify-center shrink-0`}>
                  {problem.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors duration-300">
                  {problem.title}
                </h3>
              </div>
              
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                {problem.description}
              </p>
              
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-rose-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Мост към решението - кара я да иска да скролне надолу */}
        <div className={`text-center mt-14 md:mt-20 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 font-medium' : 'opacity-0'}`}>
          <p className="text-base text-slate-800 mb-2">
            Истината е, че **не си виновна**. Проблемът не е в теб, а в това, че никой не ти е показал как да задействаш имунитета на 5 нива...
          </p>
          <p className="text-sm font-bold text-rose-500 uppercase tracking-wider animate-pulse">
            Виж как да спреш боледуването веднъж завинаги 👇
          </p>
        </div>

      </div>
    </section>
  );
}