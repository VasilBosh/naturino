import { useEffect, useRef } from 'react';
import { Droplets, Calendar } from 'lucide-react';

export function HowItWorks() {
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

  const steps = [
    {
      icon: <Droplets className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,
      number: '01',
      title: 'Приемайте редовно',
      description: 'Сутрин и вечер по 25 капки (1.2 мл) във вода, сок или директно под езика.',
    },
    {
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      number: '02',
      title: 'Всекидневен прием',
      description: 'Следвайте схемата всеки ден без пропуски за максимален ефект.',
    },
    
  ];

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Как <span className="gradient-text">работи</span>?
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Четири прости стъпки към по-здраво дете
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="reveal opacity-0 relative"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="bg-slate-50 rounded-xl md:rounded-2xl p-5 md:p-6 border border-slate-100 h-full">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl md:text-3xl font-black text-slate-200">{step.number}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm md:text-base">{step.description}</p>
              </div>
              
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
