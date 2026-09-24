export default function TrustHero() {
  // Реда в масива определя позицията: първите 5 са на горния ред,
  // следващите слизат автоматично на долния (центрирани).
  const logos = [
    { src: '/logo/Natural1.webp',    alt: '100% Натурално',          sizeClasses: 'w-full sm:w-28' },
    { src: '/logo/botanical.webp',   alt: 'Ботаникъл',               sizeClasses: 'w-full sm:w-40' },
    { src: '/logo/BioExperts3.webp', alt: 'Bio Experts',             sizeClasses: 'w-full sm:w-24' },
    { src: '/logo/NovaFarm.webp',    alt: 'NovaFarm',                sizeClasses: 'w-full sm:w-28' },
    { src: '/logo/Апостолов4.webp',  alt: 'Аптеки Апостолов',        sizeClasses: 'w-full sm:w-28' },
    // ---- от тук надолу -> втори ред ----
    { src: '/logo/Bulgaria8.webp',   alt: 'Произведени в България',  sizeClasses: 'w-full sm:w-24' },
    { src: '/logo/Novedes.png',      alt: 'Аптеки Новедес',          sizeClasses: 'w-full sm:w-28' },
    { src: '/logo/Eliksir.webp',     alt: 'Билков магазин Еликсир',  sizeClasses: 'w-full sm:w-28' },
    { src: '/logo/novaf.webp',       alt: 'Nova Farm Пловдив',       sizeClasses: 'w-full sm:w-40' },
    { src: '/logo/Amaya.webp',       alt: 'Amaya Organics',          sizeClasses: 'w-full sm:w-40' },
  ];

  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8">
          <h4 className="text-base sm:text-lg text-[#22c55e] font-bold tracking-wide uppercase">
            Чиста грижа, проверена от експерти
          </h4>
        </div>

        {/*
          flex-wrap      -> 6-тото лого слиза автоматично на нов ред
          justify-center -> непълният долен ред се центрира спрямо горния
          Ширина на лого = (100% - 4 разстояния) / 5
            телефон: gap-x-2 (0.5rem) x 4 = 2rem
            компютър: gap-x-8 (2rem)  x 4 = 8rem
        */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-8 sm:gap-y-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="basis-[calc((100%-2rem)/5)] sm:basis-[calc((100%-8rem)/5)] shrink-0 grow-0 flex items-center justify-center p-1 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className={`${logo.sizeClasses} max-w-full h-auto object-contain`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}