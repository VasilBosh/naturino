export default function TrustBadges() {
  // Сега управляваме ШИРИНАТА чрез Tailwind класове.
  // За мобилни (телефон) ползваме процент от екрана (напр. w-[15%] или w-[18%]).
  // За десктоп (компютър) ползваме класове със "sm:" префикс (напр. sm:w-24 или sm:w-36).
  const logos = [
    { 
      src: '/logo/Natural1.png', 
      alt: '100% Натурално',
      sizeClasses: 'w-[100%] sm:w-28' // автоматично се смалява на телефон, на компютър е 112px
    },
    { 
      src: '/logo/botanical.png', 
      alt: 'Ботаникъл',
      sizeClasses: 'w-[100%] sm:w-40' // по-широко, защото е дълго правоъгълно лого
    },
    { 
      src: '/logo/BioExperts3.png', 
      alt: 'Bio Experts',
      sizeClasses: 'w-[100%] sm:w-24' 
    },
    { 
      src: '/logo/NovaFarm.png', 
      alt: 'NovaFarm',
      sizeClasses: 'w-[100%] sm:w-28' 
    },
    { 
      src: '/logo/Апостолов4.jpg', 
      alt: 'Аптеки Апостолов',
      sizeClasses: 'w-[100%] sm:w-28' 
    },
    { 
      src: '/logo/Bulgaria8.png', 
      alt: 'Произведени в България',
      sizeClasses: 'w-[100%] sm:w-24' // по-тясно, защото е кръгло
    },
  ];

  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Контейнер за логата: използваме justify-between и малък gap, за да се разпределят динамично */}
        <div className="flex flex-row flex-nowrap items-center justify-between gap-1 sm:gap-6 md:gap-8 mb-10 overflow-hidden px-1">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              // Махнахме flex-shrink-0, за да позволяваме на кутийките да се преоразмеряват заедно с екрана
              className="flex-1 flex items-center justify-center p-1 transform transition-all duration-300 hover:scale-105"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                // Махнахме дублираните тагове за мобилно/десктоп и инлайн стиловете!
                // Сега имаме само ЕДИН изчистен таг, който се управлява от динамичния клас sizeClasses
                className={`${logo.sizeClasses} h-auto object-contain max-w-full`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Текстово послание */}
        <div className="max-w-4xl mx-auto font-bold text-center space-y-4">
          <h4 className="text-base sm:text-lg text-[#22c55e] font-bold tracking-wide uppercase">
            Чиста грижа, проверена от експерти
          </h4>
          
          <p className="text-gray-900 text-sm sm:text-base md:text-lg font-bold leading-relaxed">
            Всяка капка от нашия изцяло натурален билков екстракт е създадена с уважение към природата и отговорност към здравето на твоето дете. Затова ни се доверяват водещи сертифицирани био експерти и фармацевти – защото чистата българска природа не се нуждае от химия, а нашите деца заслужават само най-доброто.
          </p>
        </div>

      </div>
    </section>
  );
}