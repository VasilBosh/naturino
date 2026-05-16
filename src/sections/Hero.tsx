import { useRef, useEffect } from 'react';
import { Shield, Leaf, Star, Phone, ArrowDown, Award, ArrowRight, ShoppingCart } from 'lucide-react';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Оптимизация за Gumlet: Подготвяме връзката веднага
  useEffect(() => {
    const domains = ['https://video.gumlet.io', 'https://cdn.gumlet.com'];
    domains.forEach(domain => {
      // Предварително решаване на DNS
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = domain;
      document.head.appendChild(dnsPrefetch);

      // Предварително установяване на сигурна връзка
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

  // Предварително активиране на зареждането на видеата, щом потребителят докосне или доближи бутона
  const triggerVideoPreload = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('preload-videos'));
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 container-custom min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-4 md:py-6 flex items-center justify-between">
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
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 py-8 lg:py-12">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 shadow-lg">
              <Award className="w-3 h-3 md:w-4 md:h-4" />
              <span>Бестселър 2024 • 4000+ доволни родители</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              Спри безкрайното<br />
              <span className="text-amber-300">боледуване на детето!</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              <strong className="text-white">100% натурален имуностимулатор</strong> с 10 български билки. 
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

            {/* Обвиващият контейнер */}
            <div className="flex flex-col gap-5 items-center lg:items-start mb-6 md:mb-8">
              <button 
                onClick={scrollToCheckout}
                className="btn-cta-primary flex items-center justify-center gap-2 w-full max-w-[400px]"
              >
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
                <span>ПОРЪЧАЙ СЕГА</span>
                <span className="cta-price ml-2">19.90€</span>
                <ArrowRight className="cta-arrow w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button 
                onClick={scrollToSocialProof}
                onMouseEnter={triggerVideoPreload}
                onTouchStart={triggerVideoPreload}
                className="btn-cta-secondary w-full max-w-[400px] flex items-center justify-center gap-2 whitespace-nowrap py-3 px-5 rounded-full border border-white/20 hover:bg-white/10 transition-colors duration-300"
              > 
                <ArrowRight className="w-5 h-5 opacity-70" />
                <span className="font-bold text-sm md:text-base uppercase tracking-tight">
                    Виж какво казват родителите
                </span>
                <ArrowRight className="w-5 h-5 opacity-70 rotate-180" />
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-emerald-200 text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs md:text-sm font-medium">5.0/5 от 4000+ родители</span>
            </div>
          </div>

          {/* Right Content */}
          <div className="animate-fadeInRight flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-3xl animate-pulse-glow" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-4 border border-white/20 shadow-2xl">
                <img 
                  src="/images/product-main.jpg" 
                  alt="Naturino Kids - Натурална защита за Деца"
                  className="w-full h-auto rounded-xl md:rounded-2xl"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-amber-400 text-emerald-900 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl border border-white/20">
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Само сега</p>
                  <p className="text-lg md:text-xl font-black italic">19.90€</p>
                </div>
                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-xl font-bold">
                  <p className="text-[10px] md:text-xs uppercase">-50%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ArrowDown className="w-6 h-6 text-white/40" />
        </div>
      </div>

      {/* Текстова секция в дъното на Hero */}
      <div className="relative z-10 container-custom pb-20 text-center lg:text-left text-white/90">
        <div className="max-w-3xl mx-auto lg:mx-0 text-base md:text-lg leading-relaxed">
          <p className="mb-4">
            Уникална комбинация от <strong className="text-amber-300">10 български билки и плодове</strong>,
            която подсилва имунната система по естествен начин.
            Без химия, без странични ефекти.
          </p>

          <p className="font-bold">
            <strong className="text-amber-300">Знаете ли защо е толкова ефективен? </strong>
            Защото работи в синергия с естествените защитни механизми на тялото, а не ги потиска.
            Когато продуктът е естествен, тялото го приема как храна, а не как лекарство, 
            поради това и резултатите са толкова бързи и трайни. 
            <strong className="text-amber-300"> Това е ключът към здравето и щастието на вашето дете!</strong>
          </p>
        </div>
      </div>
    </section>
  );
}