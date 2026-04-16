import { useEffect, useRef } from 'react';
import { TrendingUp, Shield, Zap, Clock, Heart, Smile } from 'lucide-react';

export function Benefits() {
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

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,
      title: 'По-силен имунитет',
      description: 'Детето ви става по-устойчиво на вируси и инфекции.',
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      title: 'Естествена защита',
      description: '10 билки работят заедно за цялостна имунна подкрепа.',
    },
    {
      icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,
      title: 'Повече енергия',
      description: 'Детето е жизнено, игриво и пълно с енергия.',
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,
      title: 'По-рядко боледуване',
      description: 'Значително намаляване на боледуванията през годината.',
    },
    {
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-600" />,
      title: 'Спокойни родители',
      description: 'Вие сте спокойни, знаейки че правите най-доброто.',
    },
    {
      icon: <Smile className="w-6 h-6 md:w-8 md:h-8 text-teal-600" />,
      title: 'Щастливо дете',
      description: 'Здраво дете означава щастливо дете и семейство.',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-slate-50"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Ползи за вашето <span className="gradient-text">дете</span>
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Ето какво ще забележите още от първите седмици на прием
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="reveal opacity-0 card-hover bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-slate-600 text-sm md:text-base">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
