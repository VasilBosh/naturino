import React from 'react';

export const Stats = () => {
  return (
    <section className="relative py-14 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden border-y border-white/10">

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-0 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-72 h-72 bg-teal-400/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-5xl text-white">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-3">
            Доверие, изградено с резултати
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            Хиляди семейства вече решиха проблема<br className="hidden md:block" /> с болничните от градината
          </h2>
          <div className="h-0.5 w-16 bg-amber-400 mx-auto rounded-full mt-5 opacity-80" />
        </div>

        {/* Stats grid — 3 cards, no fake LIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Yearly */}
          <div className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-7 text-center">
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-3">
              От стартирането
            </p>
            <div className="text-4xl md:text-5xl font-black text-amber-400 mb-2">
              4,700+
            </div>
            <p className="text-sm text-emerald-100/70 font-medium">доволни семейства</p>
          </div>

          {/* Monthly — highlighted */}
          <div className="bg-white/12 backdrop-blur-sm border border-amber-400/25 rounded-2xl p-7 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-900 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
              Всеки месец
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-3 mt-2">
              Нови поръчки
            </p>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
              350+
            </div>
            <p className="text-sm text-emerald-100/70 font-medium">поръчки от родители</p>
          </div>

          {/* Recommendation */}
          <div className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-7 text-center">
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold mb-3">
              Препоръчват
            </p>
            <div className="text-4xl md:text-5xl font-black text-amber-400 mb-2">
              95%
            </div>
            <p className="text-sm text-emerald-100/70 font-medium">от родителите</p>
          </div>

        </div>

        {/* Bottom note — честно и просто */}
        <p className="text-center text-emerald-300/60 text-sm mt-8 font-medium">
          Поръчки през всички канали — www.naturinokids.bg, Messanger, Viber, WhatsApp и Аптеки Апостолов
        </p>

      </div>
    </section>
  );
};