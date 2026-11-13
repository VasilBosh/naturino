import PartnerLogos from './PartnerLogos';

export default function TrustHero() {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8">
          <h4 className="text-base sm:text-lg text-[#22c55e] font-bold tracking-wide uppercase">
            Чиста грижа, проверена от експерти
          </h4>
        </div>

        {/* Лента с логата на партньорите (списъкът е в PartnerLogos.tsx) */}
        <PartnerLogos />

      </div>
    </section>
  );
}
