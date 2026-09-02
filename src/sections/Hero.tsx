import { useEffect, useState } from 'react';
import { Shield, Leaf, Star, Phone, Award, ShoppingCart, ChevronDown } from 'lucide-react';

function VideoBonusCard({ variant }: { variant: 'mobile' | 'desktop' }) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `video-bonus-details-${variant}`;

  return (
    <div className="bg-gradient-to-br from-amber-300 via-yellow-300 to-yellow-400 rounded-2xl p-4 shadow-xl border-2 border-white/30 text-center overflow-hidden">
      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-black uppercase mb-3 shadow-lg">
        🎁 Ексклузивен бонус
      </div>

      <h3 className="text-emerald-950 font-black text-xl leading-[1.1]">
        ВЗЕМИ СЕГА БЕЗЦЕННИЯ ВИДЕО ПАКЕТ НА ПЛАМЕНА!
      </h3>

      <p className="mt-2 text-sm text-emerald-950/80 font-bold leading-snug">
        Най-важното от личните ми консултации с родители — събрано в кратки видеа, които взимаш с безсрочен достъп.
      </p>

      <div className="mt-4 space-y-2.5 text-left text-[13px] sm:text-sm text-emerald-950 font-semibold leading-snug">
        <p className="flex items-start gap-2">
          <span className="font-black shrink-0">✓</span>
          <span><strong>Първите симптоми</strong> — как да реагираме още в началото и какво е важно през първите 48 часа</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="font-black shrink-0">✓</span>
          <span><strong>„Моето дете пак е болно“</strong> — 5 грешки, които често допускаме от притеснение</span>
        </p>
        <p className="flex items-start gap-2">
          <span className="font-black shrink-0">✓</span>
          <span><strong>Защо детето боледува отново и отново</strong> след тръгване на ясла или градина</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={detailsId}
        className="group relative mt-2 block w-full rounded-xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70"
      >
        <div
          id={detailsId}
          className={`overflow-hidden transition-[max-height] duration-700 ease-in-out ${
            isOpen ? 'max-h-[620px]' : 'max-h-[58px]'
          }`}
        >
          <div
            className={`pt-2.5 space-y-2.5 text-left text-[13px] sm:text-sm text-emerald-950 font-semibold leading-snug transition-[filter,opacity] duration-500 ${
              isOpen ? 'blur-0 opacity-100' : 'blur-[1px] opacity-60'
            }`}
          >
            <p className="flex items-start gap-2">
              <span className="font-black shrink-0">✓</span>
              <span><strong>Злоядото дете</strong> — има ли връзка между апетита и честото боледуване?</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-black shrink-0">✓</span>
              <span><strong>Третата сливица не е враг</strong> — и кои са причините, които я карат да се възпалява отново и отново</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-black shrink-0">✓</span>
              <span><strong>Какво бих направила аз</strong>, ако детето ми днес тръгваше за първи път на ясла</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-black shrink-0">✓</span>
              <span><strong>Най-честите въпроси за Naturino Kids</strong> — с конкретни отговори</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-black shrink-0">✓</span>
              <span><strong>Как се роди Naturino Kids</strong> — от личен проблем до формула за хиляди семейства</span>
            </p>
          </div>

          <p className="mt-3 text-[12px] sm:text-[13px] font-black text-emerald-950">
            + още практически теми от реалните въпроси на родителите
          </p>

          <div className="mt-4 rounded-xl bg-emerald-950/10 border border-emerald-950/10 px-3 py-3 space-y-1.5 text-[12px] sm:text-[13px] text-emerald-950 font-bold leading-snug">
            <p>🔒 Само за клиенти, получили своята поръчка</p>
            <p>♾️ Безсрочен достъп до всички материали</p>
            <p>📅 Достъпен от 15.09.2026 г.</p>
          </div>
        </div>

        {!isOpen && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[58px] rounded-xl bg-gradient-to-b from-yellow-300/5 via-yellow-300/35 to-yellow-400" />
        )}

        <span
          className={`relative z-10 mx-auto flex w-fit items-center justify-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3.5 py-1.5 text-xs font-black text-emerald-950 shadow-md transition-all duration-300 group-hover:bg-white group-hover:shadow-lg ${
            isOpen ? 'mt-3' : '-mt-2'
          }`}
        >
          <span>{isOpen ? 'Прибери' : 'Виж още'}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'animate-bounce'
            }`}
          />
        </span>
      </button>

      <p className="font-black text-red-700 text-xl mt-3">
        Към поръчката: БЕЗПЛАТНО
      </p>
    </div>
  );
}

function HeroBenefitsCard() {
  const benefits = [
    'Трайно повишава имунитета и устойчивостта на детето',
    'Намалява боледуванията до 90% при редовен прием',
    'Защита при хрема, кашлица и сезонно натоварване',
    'По-бързо възстановяване след боледуване и намаляване на усложненията',
    'Подкрепя дихателната система и облекчава дразненето в гърлото',
    'Изключително подходящ за деца с проблеми с третата сливица и честите ангини',
    '100% натурален билков екстракт, без консерванти, оцветители и захар',
    'Подходящ за деца от 18 месеца, лесен за прием и с приятен билков вкус',
    'Много родители вече споделят, че децата им си връщат апетита след приема на Naturino Kids',
  ];

  return (
    <div className="w-full mt-6 transform-gpu">
      <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-2xl px-5 py-5 md:px-6 md:py-6">
        <p className="text-white font-black text-base md:text-lg mb-4 leading-tight">
          Какво се забелязва след приема на Naturino Kids?
        </p>

        <div className="space-y-3">
          {benefits.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <span className="text-white font-black text-sm">✓</span>
              </div>

              <p className="text-white font-bold text-sm md:text-base leading-tight">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ForumPresentation() {
  return (
    <div className="mt-8 w-full text-center">
      <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
        Naturino Kids® на Forbes Health &amp; Longevity Forum - Sofia 2026
      </h3>

      <p className="mt-2 text-emerald-100 text-sm sm:text-base font-semibold leading-relaxed">
        Представен пред десетки професори, фармацевти и лекари.
      </p>

      <img
        src="/Laant.jpg"
        alt="Naturino Kids на Forbes Health & Longevity Forum - Sofia 2026"
        width={800}
        height={640}
        className="mt-4 w-full h-auto object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function Hero() {
  // Оптимизация за Gumlet
  useEffect(() => {
    const domains = ['https://video.gumlet.io', 'https://cdn.gumlet.com'];
    domains.forEach(domain => {
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      document.head.appendChild(dnsPrefetch);

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = "anonymous";
      document.head.appendChild(preconnect);
    });
  }, []);

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSocialProof = () => {
    document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerVideoPreload = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('preload-videos'));
    }
  };

  return (
    // ПРЕНАПИСАН КЛАС: Премахнато min-h-screen, добавено контролирано отстояние (py-12 md:py-20)
    <section className="relative w-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden isolate py-8 md:py-16 lg:py-20">
      
      {/* BACKGROUND EFFECTS (GPU Акумулирани) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl"
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-2xl"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* GRID PATTERN OVERLAY */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* ОСНОВЕН СТАБИЛЕН КОНТЕЙНЕР */}
      <div className="relative z-10 container-custom w-full flex flex-col gap-8 md:gap-12 lg:gap-20">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl lg:text-2xl">Naturino Kids</h1>
              <p className="text-emerald-200 text-xs md:text-sm hidden sm:block">Натурална защита за деца</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-white/80">
              <Phone className="w-5 h-5" />
              <span className="text-base font-medium">0896 783 751</span>
            </div>
            <a 
              href="tel:0896783751"
              className="sm:hidden w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 xl:gap-16 w-full">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left transform-gpu">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg">
              <Award className="w-3 h-3 md:w-4 md:h-4" />
              <span>Бестселър 2024 • 4,700+ доволни родители</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 md:mb-20 leading-tight">
              Спри безкрайното<br />
              <span className="text-amber-300">боледуване на детето!</span>
            </h2>

            <p className="text-base sm:text-lg md:text-2xl text-emerald-100 mb-6 md:mb-2 lg:pt-0 lg:-mt-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
              <strong className="text-white">100% натурални билкови капки</strong> с 10 български билки. 
              Препоръчан от педиатри и фармацевти в <strong className="text-amber-300">Аптеки Апостолов и Аптеки Нова Фарм</strong>.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
              {['Без консерванти', 'Без захар', 'Без оцветители'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-amber-300" />
                  <span className="text-white text-xs md:text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

                        {/* MOBILE PRODUCT */}
            <div className="block lg:hidden mb-6">
              <div className="relative max-w-[330px] mx-auto">
                
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-3xl" />

                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
                  
                  <img
                    src="/images/product-main.jpg"
                    alt="Naturino Kids"
                    className="w-full h-auto rounded-xl"
                    loading="eager"
                    fetchPriority="high"
                  />


                  <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <img
                        src="/logo/speedy-logo.png"
                        alt="Speedy"
                        className="h-7 w-auto object-contain bg-white rounded px-2 py-1"
                      />

                      <span className="text-white/60 text-xs">
                        или
                      </span>

                      <img
                        src="/logo/ekont-logo.png"
                        alt="Еконт"
                        className="h-7 w-auto object-contain bg-white rounded px-2 py-1"
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-white font-bold text-xs flex items-center justify-center gap-2">
                        <span className="text-emerald-400 text-base">✓</span>
                        Плащате при получаване
                      </p>

                      <p className="text-white/70 text-[11px]">
                        🚚 Доставка 1-2 работни дни
                      </p>
                    </div>
                  </div>

                  <div
                    className="absolute -right-4 bg-amber-400 text-emerald-900 px-3 py-1.5 rounded-xl shadow-xl"
                    style={{ bottom: '124px' }}
                  >
                    <p className="text-[10px] font-semibold uppercase">
                      Само сега
                    </p>

                    <p className="text-lg font-black italic">
                      23.90€
                    </p>
                  </div>

                  <div className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-lg shadow-xl font-bold">
                    <p className="text-[10px] uppercase">
                      -50%
                    </p>
                  </div>

                </div>
              </div>
            </div>

            <div className="order-3 lg:order-none flex flex-col gap-4 items-center lg:items-start mb-6 md:mb-8 w-full px-2">
              <button 
                onClick={scrollToCheckout}
                className="btn-cta-primary flex items-center justify-center gap-2 w-full max-w-[340px]"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span>ВЗЕМИ СЕГА ➡️</span>
                <span className="cta-price ml-1">23.90€</span>
              </button>
              
              <button 
                onClick={scrollToSocialProof}
                onMouseEnter={triggerVideoPreload}
                onTouchStart={triggerVideoPreload}
                className="btn-cta-secondary w-full max-w-[340px] flex items-center justify-center whitespace-nowrap py-3 px-5 rounded-full border border-white/20 hover:bg-white/10 transition-colors duration-300"
              > 
                <span className="font-bold text-sm uppercase tracking-tight">
                  ВИЖ РЕАЛНИТЕ РЕЗУЛТАТИ 👇
                </span>
              </button>
            </div>

            {/* ЗОНА С РЕЙТИНГ И ОТЗИВ (Вертикално подредени за максимална стабилност) */}
            <div className="order-4 lg:order-none flex flex-col items-center lg:items-start gap-4">
              
              {/* Рейтинг Звездички */}
              <div className="flex items-center gap-4 text-emerald-200 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs md:text-sm font-medium">5.0/5 от 4,700+ родители</span>
              </div>

              {/* Коментарът от Facebook (Скалиран и позициониран правилно под тях) */}
              <div className="w-full max-w-[360px] bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-white/10 text-left mt-1 transform-gpu">
                <div className="flex items-start gap-2.5">
                  
                  {/* Снимка на потребителя */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 mt-0.5">
                    <img 
                      src="https://images.unsplash.com/photo-1687456338383-656a5fc1ea5e?w=100&auto=format&fit=crop&q=80" 
                      alt="Невена Караиванова" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Основно съдържание на коментара */}
                  <div className="flex-1 relative pb-2">
                    <div className="bg-[#f0f2f5] rounded-xl px-3 py-2 text-gray-900">
                      {/* Име */}
                      <h4 className="font-bold text-xs md:text-sm text-gray-900 mb-0.5 hover:underline cursor-pointer">
                        Невена Караиванова
                      </h4>
                      
                      {/* Текст */}
                      <p className="text-[11.5px] md:text-xs leading-relaxed text-slate-800">
                        Момичета, капките на Пламена буквално ни спасиха от безкрайния ад. 
                        След 3 седмици прием спряхме боледуванията,за което съм безкрайно благодарна.
                        Препоръчвам с две ръце! Благодаря ви Пламена. 🥰 🌿
                      </p>

                      {/* Брояч на лайкове (Реакции) */}
                      <div className="absolute bottom-1 -right-2 flex items-center gap-1 bg-white border border-gray-100 rounded-full py-0.5 px-1.5 shadow-md text-[10px] select-none">
                        <div className="flex items-center justify-center w-10 h-3.5 rounded-full">
                          <span className="text-white text-[14px] leading-none">❤️😮</span>
                        </div>
                        <span className="text-gray-500 font-semibold text-[11px]">82</span>
                      </div>
                    </div>

                    {/* Бутони под коментара */}
                    <div className="flex items-center gap-2.5 mt-1 ml-2 text-[10px] font-bold text-gray-500/90">
                      <button className="hover:underline cursor-pointer">Like</button>
                      <span>·</span>
                      <button className="hover:underline cursor-pointer">Reply</button>
                      <span>·</span>
                      <span className="font-normal text-gray-400">1w</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Ползите вече са реално в лявата колона, веднага след отзива */}
            <HeroBenefitsCard />

            {/* Представянето на форума е преместено на мястото на стария бадж */}
            <ForumPresentation />
          </div>

            {/* MOBILE BONUS CARD */}
            <div className="block lg:hidden mt-5 mb-0 max-w-[340px] mx-auto">
              <VideoBonusCard variant="mobile" />
            </div>


          {/* MOBILE FACEBOOK GROUP BONUS CARD */}
          <div className="block lg:hidden mt-5 mb-6 max-w-[340px] mx-auto">
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-4 shadow-xl border-2 border-blue-200/70 text-center">

              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-black uppercase mb-3 shadow-lg">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-600 font-black text-sm leading-none">
                  f
                </span>
                Ексклузивен бонус
              </div>

              <div className="flex items-start gap-3 text-left">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <span className="text-2xl font-black leading-none">f</span>
                </div>

                <div>
                  <h3 className="text-slate-900 font-black text-lg leading-tight">
                    Затворена Facebook група на майките на Naturino
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    След поръчка получавате достъп до нашата затворена общност, където майките си помагат ежедневно.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-left text-sm text-slate-800 font-semibold">
                <p>✔ Теми за здраве, хранене, ясла, градина и училище</p>
                <p>✔ Реални дискусии и споделен опит от други майки</p>
                <p>✔ Полезни съвети и помощ директно от Пламена</p>
                <p>✔ Място, където не сте сами в трудните моменти</p>
              </div>

              <div className="mt-4 rounded-2xl bg-blue-600 text-white px-4 py-3 shadow-lg">
                <p className="text-[12px] uppercase font-black tracking-wide opacity-90">
                  Бонус с дългосрочна стойност
                </p>
                <p className="text-sm font-black leading-tight mt-1 opacity-70">
                  Не получавате само еднократна консултация, а постоянен достъп до силна общност и помощ.
                </p>
              </div>

              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Поканата за групата се изпраща на имейла, посочен при поръчката.
              </p>

              <p className="font-black text-blue-700 text-lg mt-2">
                Достъп: БЕЗПЛАТНО
              </p>
            </div>
          </div>

          {/* Right Content Desktop Only */}
          <div className="hidden lg:block flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[320px] lg:max-w-[420px] transform-gpu lg:-mt-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-4 border border-white/20 shadow-2xl">
                <img 
                  src="/images/product-main.jpg" 
                  alt="Naturino Kids - Натурална защита за Деца"
                  className="w-full h-auto rounded-xl md:rounded-2xl"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />

                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <img src="/logo/speedy-logo.png" alt="Speedy" className="h-7 md:h-9 w-auto object-contain bg-white rounded px-2 py-1" />
                    <span className="text-white/60 text-xs">или</span>
                    <img src="/logo/ekont-logo.png" alt="Еконт" className="h-7 md:h-9 w-auto object-contain bg-white rounded px-2 py-1" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2">
                      <span className="text-emerald-400 text-base">✓</span>
                      Плащате при получаване
                    </p>
                    <p className="text-white/70 text-[11px] md:text-xs">
                      🚚 4,700+ семейства вече получиха. Доставка 1-2 работни дни
                    </p>
                  </div>
                </div>

                <div className="absolute -right-4 md:-right-5 bg-amber-400 text-emerald-900 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl border border-white/20" style={{ bottom: '124px' }}>
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Само сега</p>
                  <p className="text-lg md:text-xl font-black italic">23.90€</p>
                </div>
                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-xl font-bold">
                  <p className="text-[10px] md:text-xs uppercase">-50%</p>
                </div>
              </div>
            </div>
                  {/* BONUS CARD Desktop*/}
            <div className="mt-5">
              <VideoBonusCard variant="desktop" />
            </div>
            {/* BONUS CARD end*/}

            {/* FACEBOOK GROUP BONUS CARD */}
            <div className="mt-5">
              <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-4 shadow-xl border-2 border-blue-200/70 text-center">

                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-black uppercase mb-3 shadow-lg">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-600 font-black text-sm leading-none">
                    f
                  </span>
                  Ексклузивен бонус
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <span className="text-2xl font-black leading-none">f</span>
                  </div>

                  <div>
                    <h3 className="text-slate-900 font-black text-lg leading-tight">
                      Затворена Facebook група на майките на Naturino
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Всеки, който направи поръчка, получава достъп до общност с полезни теми, реални майки и лична помощ от Пламена.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-left text-sm text-slate-800 font-semibold">
                  <p>✔ Здраве, хранене, ясла, градина и училище</p>
                  <p>✔ Дискусии по реални теми от ежедневието на майките</p>
                  <p>✔ Съвети, насоки и подкрепа от Пламена</p>
                  <p>✔ Помощ, когато имате въпроси и се чудите какво да правите</p>
                </div>

                <div className="mt-4 rounded-2xl bg-blue-600 text-white px-4 py-3 shadow-lg">
                  <p className="text-[11px] uppercase font-black tracking-wide opacity-90">
                    Бонус с дългосрочна стойност
                  </p>
                  <p className="text-sm font-black leading-tight mt-1">
                    Не получавате само еднократна консултация, а постоянен достъп до силна общност и помощ.
                  </p>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Поканата за групата се изпраща на имейла, посочен при поръчката.
                </p>

                <p className="font-black text-blue-700 text-xl mt-2">
                  Достъп: БЕЗПЛАТНО
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
