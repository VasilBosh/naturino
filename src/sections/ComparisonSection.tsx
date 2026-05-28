import React, { useState } from 'react';

// Дефинираме интерфейс за опциите в интерактивното сравнение
interface CompareOption {
  id: string;
  tabLabel: string;
  emoji: string;
  title: string;
  problem: string;
  absorption: number; // Процент на усвояване за визуализацията
  absorptionText: string;
  chemicalProcess: string;
  highlightColor: string;
}

export const ComparisonSection: React.FC = () => {
  // Държим състояние за активния таб в сравнението
  const [activeTab, setActiveTab] = useState<string>('gummy');

  const options: CompareOption[] = [
    {
      id: 'syrups',
      tabLabel: 'Аптечни сиропи',
      emoji: '💊',
      title: 'Аптечните сиропи и прахчета',
      problem: 'Пълни с глюкозо-фруктозен сироп и захар, за да се маскира горчивият вкус на изкуствените съставки.',
      absorption: 25,
      absorptionText: 'Едва ~25% (синтетични изолати без живи растителни ко-фактори)',
      chemicalProcess: 'Лабораторно синтезирани молекули, които натоварват черния дроб на детето.',
      highlightColor: 'amber'
    },
    {
      id: 'gummy',
      tabLabel: 'Гумени мечета',
      emoji: '🧸',
      title: 'Шарените гумени мечета',
      problem: 'Силно преработен желатин, оцветители и лепила. Детето ги яде за 2 секунди, но организмът му страда.',
      absorption: 15,
      absorptionText: 'Минимално (~15%) поради агресивната термична и механична обработка',
      chemicalProcess: 'Преминават през тежки механични филтри и химично желиране, което замърсява суровината.',
      highlightColor: 'rose'
    },
    {
      id: 'naturino',
      tabLabel: 'Naturino Kids',
      emoji: '🌱',
      title: 'Билковият екстракт Naturino Kids',
      problem: '100% чист извлек от 10 билки и плодове. Без рафинирана захар, без химия и без компромиси.',
      absorption: 98,
      absorptionText: 'Над 98% (напълно естествена формула, която тялото разпознава веднага)',
      chemicalProcess: 'Щадяща студена екстракция, която запазва живата ДНК на растенията.',
      highlightColor: 'emerald'
    }
  ];

  const currentData = options.find(o => o.id === activeTab) || options[0];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-emerald-50/40 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Хедър - Грабващ вниманието и спиращ скрола */}
        <div className="text-center mb-12">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 animate-bounce">
            ⚠️ Родителски избор 
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4 tracking-tight max-w-3xl mx-auto leading-tight bg-gradient-to-r from-emerald-700 via-amber-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            Спри! Замислял ли си се какво НАИСТИНА влиза в тялото на детето ти?
          </h2>
          <p className="mt-4 text-slate-500 font-medium text-sm md:text-base max-w-xl mx-auto">
            Повечето продукти обещават бързо здраве, но крият компромиси. Избери категория и сравни за 5 секунди:
          </p>
        </div>

        {/* ИНТЕРАКТИВЕН БЛОК ЗА СРАВНЕНИЕ */}
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-emerald-100/80 mb-12 transition-all duration-300 relative">
          
          {/* Визуален индикатор/Подкана за кликане */}
          <div className="flex justify-center items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
            <span>👉</span> Кликни, за да тестваш и сравниш <span>👇</span>
          </div>

          {/* Бутони (Табове) - Вече ясно личи, че са бутони */}
          <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-2 rounded-2xl mb-8 border border-slate-200/60">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveTab(option.id)}
                className={`flex-1 py-3.5 px-4 rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer border ${
                  activeTab === option.id
                    ? 'bg-emerald-600 text-white shadow-md border-emerald-600 scale-[1.02]'
                    : 'text-slate-500 bg-white hover:text-slate-800 hover:bg-slate-100 border-dashed border-slate-300'
                }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <span>{option.tabLabel}</span>
              </button>
            ))}
          </div>

          {/* Динамичен контейнер с информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[280px]">
            
            {/* Текстови детайли */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  🔍 Резултат от анализа
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">
                  {currentData.title}
                </h3>
              </div>

              {/* Проблем/Решение */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50">
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">📋 Съставки под лупа:</span>
                  {currentData.problem}
                </p>
              </div>

              {/* Обработка */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">⚙️ Какво остава скрито:</span>
                  {currentData.chemicalProcess}
                </p>
              </div>
            </div>

            {/* Визуален барометър на усвояемостта */}
            <div className="bg-emerald-50/20 rounded-2xl p-6 border border-emerald-100/50 flex flex-col justify-center shadow-inner">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-4 text-center tracking-wider">
                📊 Реално усвояване от детското тяло
              </span>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-bold inline-block py-1 px-2.5 uppercase rounded-full ${
                      currentData.absorption > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Ефективност
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-black ${
                      currentData.absorption > 50 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {currentData.absorption}%
                    </span>
                  </div>
                </div>
                
                {/* Анимиран бар */}
                <div className="overflow-hidden h-5 text-xs flex rounded-full bg-slate-200 p-0.5 border border-slate-300/30">
                  <div
                    style={{ width: `${currentData.absorption}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-700 ease-out ${
                      currentData.absorption > 50 
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                        : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    }`}
                  ></div>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-4 text-center bg-white py-2 px-3 rounded-xl border border-slate-100">
                {currentData.absorptionText}
              </p>
            </div>

          </div>
        </div>

        {/* РОДИТЕЛСКИ КАПАН */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 md:p-8 border border-amber-200/60 mb-12 text-center shadow-sm">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span>⚠️</span> ВНИМАНИЕ ЗА РОДИТЕЛИ
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
            „Искате просто прием за 2 секунди да излъжете детето...“
          </h3>
          <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Да, мечетата са лесни. Но замисляте ли се как работи това вътре? Всяко мече преминава химично желиране, което вместо истински имунитет, <strong className="text-amber-800">натоварва и задръства нежния детски организъм с лепила, захари и химия.</strong>
          </p>
        </div>

        {/* СУПЕР ИНФОГРАФИКА: 3 ЛИТРА ЧАЙ В ЕДНА ЛЪЖИЧКА */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 rounded-3xl p-6 md:p-8 text-white relative shadow-lg">
          
          <div className="md:col-span-7 space-y-4">
            <span className="bg-emerald-700/60 border border-emerald-600 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              Природна Концентрация 💧
            </span>
            <h3 className="text-xl md:text-2xl font-bold leading-tight">
              Представете си, че детето ви пие по 3 литра чай от 10 билки всяка сутрин и вечер...
            </h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Няма дете, което да изпие дори една чаша сутрин. Нашите капки са точно това – <strong className="text-amber-300">мощен органичен концентрат</strong>. Един прием дава сила, все едно малчуганът е изпил 3 литра чист, топъл билков чай наведнъж!
            </p>
          </div>

          <div className="md:col-span-5 flex justify-center mt-4 md:mt-0">
            {/* ПРОМПТ ЗА ГЕНЕРИРАНЕ НА ИЗОБРАЖЕНИЕТО (Генерирай го в Midjourney или DALL-E и го запиши като `herbal-tea-equivalent.png`):
              "A minimalistic beautiful split comparison design. On the left: a huge aesthetic jar full of colorful herbal tea with fresh herbs floating inside. On the right: a premium natural supplement amber dropper bottle. An arrow showing how 3 Liters of tea condense into 1 small beautiful golden drop of herbal extract. Soft warm lighting, clean studio shot, no clutter --ar 4:3 --v 6.0"
            */}
            <div className="relative group max-w-[280px] md:max-w-full">
              <img 
                src="/images/herbal-tea-equivalent.png" 
                alt="3 литра чай концентрирани в няколко капки Naturino Kids" 
                className="w-full h-auto object-contain rounded-2xl shadow-md border border-emerald-700/50 p-1.5 bg-emerald-900/40"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = "text-center p-6 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 w-full";
                    fallback.innerHTML = "<div class='text-4xl mb-2'>☕ ➔ 💧</div><p class='text-[10px] text-emerald-300'>[ 3 ЛИТРА ЧАЙ В 1 КАПКА ]</p>";
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ComparisonSection;