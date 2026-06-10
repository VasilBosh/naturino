import { useEffect } from 'react';
import { Shield, Leaf, Star, Phone, Award, ShoppingCart } from 'lucide-react';

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
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-2xl" 
          style={{ animationDelay: '1s', willChange: 'transform', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl" 
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
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
      <div className="relative z-10 container-custom w-full flex flex-col gap-8 md:gap-12 lg:gap-16">
        
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
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">0896 783 751</span>
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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 xl:gap-16 w-full">
          
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
              Препоръчан от педиатри и фармацевти в <strong className="text-amber-300">Аптеки Апостолов</strong>.
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
                      19.90€
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
                <span className="cta-price ml-1">19.90€</span>
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
          </div>

                      {/* MOBILE BONUS CARD */}
            <div className="block lg:hidden mt-5 mb-6 max-w-[340px] mx-auto">
              <div className="bg-gradient-to-r from-amber-300 to-yellow-400 rounded-2xl p-4 shadow-xl border-2 border-white/25 text-center bonus-cta-pulse">

                <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black uppercase mb-3 shadow-lg">
                  🎁 Подарък за всяка майка
                </div>

                <h3 className="text-emerald-950 font-black text-xl leading-tight">
                  10-минутна консултация с Пламена
                </h3>

                <div className="mt-4 space-y-2 text-left text-sm text-emerald-950 font-semibold">
                  <p>✔ Как да постигнете максимален ефект</p>
                  <p>✔ Какво да очаквате още в началото</p>
                  <p>✔ Лични насоки за вашето дете</p>
                </div>

                <div className="w-40 h-[2px] bg-emerald-900/20 mx-auto my-4"></div>

                <div className="text-base text-emerald-900">
                  Стойност:
                  <span className="line-through text-xl font-black text-red-600 ml-1">
                    50€
                  </span>
                </div>

                <p className="font-black text-red-700 text-2xl mt-2">
                  Днес: БЕЗПЛАТНО
                </p>

              </div>
            </div>

          {/* Right Content Desktop Only */}
          <div className="hidden lg:block flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[320px] lg:max-w-[420px] transform-gpu lg:translate-y-40">
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
                  <p className="text-lg md:text-xl font-black italic">19.90€</p>
                </div>
                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-xl font-bold">
                  <p className="text-[10px] md:text-xs uppercase">-50%</p>
                </div>
              </div>
            </div>
                  {/* BONUS CARD */}
            <div className="mt-5">
              <div className="bg-gradient-to-r from-amber-300 to-yellow-400 rounded-2xl p-4 shadow-xl border-2 border-white/25 text-center bonus-cta-pulse">

                <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-base font-black uppercase mb-3 shadow-lg">
                  🎁 Подарък за всяка майка
                </div>

                <h3 className="text-emerald-950 font-black text-lg leading-tight">
                  10-минутна консултация с Пламена
                </h3>

                <div className="mt-3 space-y-1 text-left text-sm text-emerald-950 font-semibold">
                  <p>✔ Как да постигнете максимален ефект</p>
                  <p>✔ Какво да очаквате през първите седмици</p>
                  <p>✔ Лични насоки за вашето дете</p>
                </div>

                <div className="mt-3 text-base text-emerald-900">
                  <div className="w-60 h-[2px] bg-emerald-900/20 mx-auto my-2"></div>
                  Стойност: <span className="line-through text-xl font-black text-red-600">50€</span>
                </div>

                <p className="font-black text-red-700 text-xl mt-1">
                  Днес: БЕЗПЛАТНО
                </p>

              </div>
            </div>
            {/* BONUS CARD end*/}
          
          
          </div>
        </div>

        {/* Текстова секция */}
        <div className="w-full text-center lg:text-left text-white/90 transform-gpu pt-0 -mt-6 lg:pt-0 lg:-mt-24 lg:max-w-[55%]">
          <div className="max-w-3xl mx-auto lg:mx-0 text-base md:text-base leading-relaxed px-4 lg:px-0">
            <p className="mb-4">
              Naturino Kids е изграден на базата на уникалния механизъм{" "}
              <strong className="text-amber-300">BioHerb™-10.</strong>
            </p>
            <p className="mb-4">
              Тази система е уникална заради изключително редкия Планински лимон{" "}
              <em>(Chaenomeles maulei)</em> — плод, съдържащ до{" "}
              <strong className="text-amber-300">5 пъти повече витамин C</strong>{" "}
              от обикновения лимон и до{" "}
              <strong className="text-amber-300">10 пъти повече витамин P</strong>{" "}
              от ябълките. Именно той осигурява{" "}
              <strong className="text-amber-300">над 98% усвояемост</strong>{" "}
              на останалите девет билки, подбрани по специална фитотерапевтична таблица
              и съобразени с детския организъм.
            </p>
            <p>
              Затова Naturino Kids е един от малкото продукти на пазара
              подходящ за деца от{" "}
              <strong className="text-amber-300">18 месеца</strong>{" "}
              — 100% натурален, изследван и регистриран в{" "}
              <strong className="text-amber-300">Българската агенция по безопасност на храните.</strong>
            </p>
          
          </div>
        </div>

      </div>
    </section>
  );
}