export default function TrustBadges() {
  // Вече пишем размерите директно в пиксели (px)
  const logos = [
    { 
      src: '/logo/Natural1.png', 
      alt: '100% Натурално',
      mobileHeight: '40px',   
      desktopHeight: '70px'   
    },
    { 
      src: '/logo/botanical.png', 
      alt: 'Ботаникъл',
      mobileHeight: '17px', 
      desktopHeight: '35px' 
    },
    { 
      src: '/logo/BioExperts3.png', 
      alt: 'Bio Experts',
      mobileHeight: '35px', 
      desktopHeight: '65px' 
    },
    { 
      src: '/logo/Апостолов4.jpg', 
      alt: 'Аптеки Апостолов',
      mobileHeight: '55px', 
      desktopHeight: '100px' 
    },
    { 
      src: '/logo/Bulgaria8.png', 
      alt: 'Произведени в България',
      mobileHeight: '55px', 
      desktopHeight: '100px' 
    },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Контейнер за логата */}
        <div className="flex flex-row flex-nowrap items-center justify-center gap-0 sm:gap-8 md:gap-10 mb-10 overflow-hidden px-1">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 flex items-center justify-center p-1 transform transition-all duration-300 hover:scale-105"
            >
              {/* Мобилно лого */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-auto object-contain block sm:hidden"
                style={{ height: logo.mobileHeight }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Десктоп лого */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-auto object-contain hidden sm:block"
                style={{ height: logo.desktopHeight }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Текстово послание - ЦЕЛИЯТ ТЕКСТ БЕЗ СЪКРАЩЕНИЯ */}
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