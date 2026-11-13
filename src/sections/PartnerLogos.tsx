/**
 * PartnerLogos — безкрайна, бавно движеща се лента с логата на партньорите.
 *
 * Нов партньор се добавя САМО тук, с един ред в масива `logos`.
 * Използва се в TrustHero.tsx и TrustBadges.tsx.
 *
 * - Логата се дублират два пъти в лентата, за да няма "скок" при зацикляне.
 * - Спира при hover (за да може човек да разгледа логото).
 * - При prefers-reduced-motion лентата не се движи.
 */

type Logo = {
  src: string;
  alt: string;
  /** ширина: телефон / компютър */
  sizeClasses: string;
};

const logos: Logo[] = [
  { src: '/logo/Natural1.webp',    alt: '100% Натурално',          sizeClasses: 'w-20 sm:w-28' },
  { src: '/logo/botanical.webp',   alt: 'Ботаникъл',               sizeClasses: 'w-28 sm:w-40' },
  { src: '/logo/BioExperts3.webp', alt: 'Bio Experts',             sizeClasses: 'w-16 sm:w-24' },
  { src: '/logo/NovaFarm.webp',    alt: 'NovaFarm',                sizeClasses: 'w-20 sm:w-28' },
  { src: '/logo/Апостолов4.webp',  alt: 'Аптеки Апостолов',        sizeClasses: 'w-20 sm:w-28' },
  { src: '/logo/Bulgaria8.webp',   alt: 'Произведени в България',  sizeClasses: 'w-16 sm:w-24' },
  { src: '/logo/Novedes.png',      alt: 'Аптеки Новедес',          sizeClasses: 'w-20 sm:w-28' },
  { src: '/logo/Eliksir.webp',     alt: 'Билков магазин Еликсир',  sizeClasses: 'w-20 sm:w-28' },
  { src: '/logo/novaf.webp',       alt: 'Nova Farm Пловдив',       sizeClasses: 'w-28 sm:w-40' },
  { src: '/logo/Amaya.webp',       alt: 'Amaya Organics',          sizeClasses: 'w-28 sm:w-40' },
  { src: '/logo/tkpharm.webp',     alt: 'TK Pharm',                sizeClasses: 'w-40 sm:w-40' },
  // ---- нов партньор -> добави ред тук ----
];

/** Скорост: секунди за едно пълно превъртане. По-голямо число = по-бавно. */
const SECONDS_PER_LOOP = 45;

export default function PartnerLogos({ className = '' }: { className?: string }) {
  // Два пъти един и същ списък -> безкрайна лента без прекъсване
  const track = [...logos, ...logos];

  return (
    <div
      className={`logo-marquee relative w-full overflow-hidden ${className}`}
      aria-label="Партньори, които ни се доверяват"
    >
      {/* CSS за движението — държи се тук, за да не се пипа App.css */}
      <style>{`
        @keyframes logo-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .logo-marquee__track {
          animation: logo-marquee-scroll ${SECONDS_PER_LOOP}s linear infinite;
        }
        .logo-marquee:hover .logo-marquee__track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-marquee__track { animation: none; }
        }
      `}</style>

      {/* Меко избледняване в краищата на лентата */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      <div className="logo-marquee__track flex w-max items-center">
        {track.map((logo, index) => (
          <div
            key={index}
            aria-hidden={index >= logos.length ? true : undefined}
            className="flex h-20 sm:h-28 items-center justify-center shrink-0 px-3 sm:px-5 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={logo.src}
              alt={index >= logos.length ? '' : logo.alt}
              loading="lazy"
              draggable={false}
              className={`${logo.sizeClasses} h-full object-contain`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
