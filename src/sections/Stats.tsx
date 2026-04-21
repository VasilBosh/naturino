import React, { useMemo } from 'react';

export const Stats = () => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timestamp = today.getTime();

    const seededRandom = (seed: number, min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      const rand = x - Math.floor(x);
      return Math.floor(rand * (max - min + 1) + min);
    };

    const daily = seededRandom(timestamp, 11, 18);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(new Date().setDate(diff)).setHours(0, 0, 0, 0);
    const weekly = seededRandom(startOfWeek, 40, 70) + (dayOfWeek * 2);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const monthly = seededRandom(startOfMonth, 380, 550) + (today.getDate() * 3);
    const startOfYear = new Date(today.getFullYear(), 0, 1).getTime();
    const baseYearly = 3788;
    const daysPassed = Math.floor((timestamp - startOfYear) / (1000 * 60 * 60 * 24));
    const yearly = baseYearly + (daysPassed * 14);

    return { daily, weekly, monthly, yearly };
  }, []);

  return (
    /* Използваме твоя градиент от Hero: emerald-900, emerald-800, teal-900 */
    <section className="relative py-12 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden border-y border-white/10 shadow-2xl">
      
      {/* Декоративни елементи за дълбочина (като в Hero секцията) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl text-white">
        {/* Заглавие на блока - Вече с Amber цвета от твоя Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-amber-400 tracking-tight leading-tight mb-4">
            🏆 НАЙ-ИЗБИРАНАТА ЗАЩИТА В БЪЛГАРИЯ! 🏆
          </h2>
          <p className="text-lg md:text-xl text-emerald-50 font-medium max-w-2xl mx-auto opacity-90">
            Хиляди родители вече решиха проблема с болничните от градината.
          </p>
          <div className="h-1.5 w-24 bg-amber-400 mx-auto rounded-full mt-6 shadow-lg"></div>
        </div>

        {/* Мрежа със самите числа - Glassmorphism стил */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Карта 1: Годишни */}
          <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/20 text-center shadow-xl transform transition hover:scale-105">
            <div className="text-5xl mb-3 drop-shadow-md">🛡️</div>
            <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2 font-bold">За последната година</p>
            <div className="text-4xl md:text-5xl font-black text-amber-400 drop-shadow-sm">{stats.yearly.toLocaleString()}</div>
            <p className="text-sm text-emerald-50/80 mt-2 font-medium">доволни семейства</p>
          </div>

          {/* Карта 2: Месечни */}
          <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/20 text-center shadow-xl transform transition hover:scale-105">
            <div className="text-5xl mb-3 drop-shadow-md">📈</div>
            <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2 font-bold">За последния месец</p>
            <div className="text-4xl md:text-5xl font-black text-white">{stats.monthly}</div>
            <p className="text-sm text-emerald-50/80 mt-2 font-medium">поръчали Naturino Kids</p>
          </div>

          {/* Карта 3: Седмични */}
          <div className="bg-white/10 backdrop-blur-md p-7 rounded-2xl border border-white/20 text-center shadow-xl transform transition hover:scale-105">
            <div className="text-5xl mb-3 drop-shadow-md">📅</div>
            <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2 font-bold">За последната седмица</p>
            <div className="text-4xl md:text-5xl font-black text-white">{stats.weekly}</div>
            <p className="text-sm text-emerald-50/80 mt-2 font-medium">поръчали Naturino Kids</p>
          </div>

          {/* Карта 4: Дневни */}
          <div className="bg-white/15 backdrop-blur-md p-7 rounded-2xl border border-amber-400/30 text-center shadow-xl transform transition hover:scale-105 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-[10px] font-black px-3 py-1 text-white uppercase tracking-wider rounded-bl-lg animate-pulse shadow-md">
               LIVE
            </div>
            <div className="text-5xl mb-3 drop-shadow-md">🔥</div>
            <p className="text-xs uppercase tracking-widest text-amber-300 mb-2 font-bold">До момента от вчера</p>
            <div className="text-4xl md:text-5xl font-black text-amber-400">{stats.daily}</div>
            <p className="text-sm text-emerald-50/80 mt-2 font-medium">поръчали Naturino Kids</p>
          </div>

        </div>

        {/* Малко съобщение за спешност най-долу */}
        <div className="text-center mt-12">
            <p className="text-amber-200 font-bold text-lg md:text-xl animate-pulse inline-flex items-center gap-2">
               ⚠️ Продукта се изчерпва бързо поради големите заявки ⚠️
            </p>
        </div>
      </div>
    </section>
  );
};