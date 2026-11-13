import PartnerLogos from './PartnerLogos';

export default function TrustBadges() {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Лента с логата на партньорите (списъкът е в PartnerLogos.tsx) */}
        <PartnerLogos className="mb-10" />

        {/* Текстово послание */}
        <div className="max-w-4xl mx-auto text-center">

          {/* Заглавие с линии отстрани */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-10 sm:w-16 bg-[#22c55e]/40" />
            <h4 className="text-sm sm:text-base text-[#16a34a] font-bold tracking-[0.2em] uppercase">
              Чиста грижа, проверена от експерти
            </h4>
            <span className="h-px w-10 sm:w-16 bg-[#22c55e]/40" />
          </div>

          {/* Карта */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_-20px_rgba(20,83,45,0.25)] px-6 py-10 sm:px-14 sm:py-12">

            {/* Зелена черта отгоре */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 rounded-b-full bg-[#22c55e]" />

            {/* Голяма декоративна кавичка */}
            <svg
              aria-hidden="true"
              className="absolute top-4 left-4 sm:top-6 sm:left-8 w-12 h-12 sm:w-20 sm:h-20 text-[#22c55e]/10"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M9.3 6C4.2 9.2 1.3 13.6 1.3 19.1c0 4.3 2.6 6.9 5.7 6.9 2.9 0 5.1-2.3 5.1-5.1 0-2.8-2-4.8-4.5-4.8-.5 0-1.2.1-1.3.1.4-2.9 3.1-6.4 5.9-8.1L9.3 6zm16.4 0c-5.1 3.2-8 7.6-8 13.1 0 4.3 2.6 6.9 5.7 6.9 2.9 0 5.1-2.3 5.1-5.1 0-2.8-2-4.8-4.5-4.8-.5 0-1.2.1-1.3.1.4-2.9 3.1-6.4 5.9-8.1L25.7 6z" />
            </svg>

            {/* Водещо изречение */}
            <p className="relative text-lg sm:text-2xl md:text-xl font-semibold text-[#14532d] leading-snug tracking-tight">
              Всяка капка от нашия изцяло натурален билков екстракт е създадена с уважение към природата и отговорност към здравето на твоето дете.
            </p>

            {/* Малък разделител */}
            <span className="block mx-auto my-6 h-px w-16 bg-slate-300" />

            {/* Второ изречение с маркирани ключови думи */}
            <p className="relative text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              Затова ни се доверяват{' '}
              <span className="font-semibold text-slate-900 bg-[linear-gradient(transparent_60%,#bbf7d0_60%)] px-0.5">
                водещи сертифицирани био експерти и фармацевти
              </span>{' '}
              – защото чистата българска природа не се нуждае от химия, а нашите деца заслужават{' '}
              <span className="font-semibold text-slate-900 bg-[linear-gradient(transparent_60%,#bbf7d0_60%)] px-0.5">
                само най-доброто
              </span>
              .
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
