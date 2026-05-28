import { useEffect, useRef, useState } from 'react';
import { Star, Quote, MessageCircle, ThumbsUp, Heart } from 'lucide-react';

export function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            setShouldLoadVideos(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '300px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    const handleHeroButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a[href="#social-proof"]') || target.closest('button')) {
        setShouldLoadVideos(true);
      }
    };

    window.addEventListener('click', handleHeroButtonClick);

    return () => {
      observer.disconnect();
      window.removeEventListener('click', handleHeroButtonClick);
    };
  }, []);

  const testimonials = [
    {
      name: 'Мария Личева',
      role: 'Майка на 5-годишно дете',
      content: 'Откакто давам Naturino Kids на дъщеря ми, тя боледува много по-рядко. Преди беше постоянно болна, а сега е пълна с енергия! Препоръчвам го на всички родители!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
    },
    {
      name: 'Иван Пенчев',
      role: 'Баща на близнаци',
      content: 'Пробвахме много уж натурални продукти, но без трайни резултати. Благодаря на Пламена за уникалния продукт. Децата ми вече не пропускат детска градина заради болести. Препоръчвам!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Анна Димитрова',
      role: 'Майка на 3-годишно дете',
      content: 'Педиатърката ни препоръча Naturino Kids и сме много доволни. Естествен продукт, който наистина помага на имунитета. Давам го редовно и виждам голяма разлика в здравето на сина ми. Препоръчвам го на всички родители, които търсят натурална подкрепа за децата си!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      name: 'Петър Филчев',
      role: 'Баща на 7-годишно дете',
      content: 'Синът ми беше постоянно с хрема и кашлица. След 1 месец с Naturino Kids разликата е огромна. Лесно се дозира, както ми препоръчаха по телефона директно под езика и резултатите дойдоха много бързо. Благодаря!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      name: 'Елена Николова - Данова',
      role: 'Майка на две деца',
      content: 'Давам го и на двете си деца вече половин година. Резултатите са невероятни - здрави и жизнени деца без следа от болести! Препоръчвам го на всички родители!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'Георги Стефанов Миланов',
      role: 'Баща на 4-годишно дете',
      content: 'Фармацевтът в Аптеки Апостолов ни препоръча този продукт. Супер е че е достъпен и там. Много сме доволни от ефекта и благодаря на Пламена от Натурино за уникалния продукт!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    },
  ];

  const videoSources = [
    // "https://play.gumlet.io/embed/69f0b6c84d5bf5db18d79fc3",
    "https://play.gumlet.io/embed/69f0b6de9c68b6349a8d83a3",
    "https://play.gumlet.io/embed/69f0b6f0a3dc19951f1982e9",
    "https://play.gumlet.io/embed/69f0ba7f4d5bf5db18d7f83f"
  ];

  const stats = [
    { value: '4,760+', label: 'Доволни родители' },
    { value: '4.9/5', label: 'Среден рейтинг' },
    { value: '95%', label: 'Препоръчват продукта' },
    { value: '10', label: 'Натурални билки' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="social-proof"
      className="section-padding bg-slate-50 overflow-hidden py-12 md:py-20"
    >
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <MessageCircle className="w-4 h-4" />
            <span>Отзиви от родители</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Какво казват <span className="gradient-text">родителите</span>
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Присъединете се към хилядите доволни родители, които вече се довериха на Naturino Kids
          </p>
        </div>

        {/* Video Grid (Всички на един ред) */}
        <div className="reveal opacity-0 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-16 max-w-5xl mx-auto">
          {videoSources.map((src, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                {shouldLoadVideos ? (
                  <iframe
                    loading="lazy" 
                    title={`Gumlet video player ${index + 1}`}
                    src={src}
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                    referrerPolicy="origin"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-slate-100 animate-pulse" />
                )}
              </div>
              <div className="mt-4 text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-sm">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="reveal opacity-0 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm border border-slate-100"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-slate-600 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Slider (Auto-marquee) */}
        <div className="reveal opacity-0 relative mb-20">
          <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused] w-max">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index}
                className="w-[300px] md:w-[400px] bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 flex-shrink-0"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-1 w-6 h-6 text-emerald-100" />
                  <p className="text-slate-700 text-sm md:text-base leading-relaxed pl-4">
                    {testimonial.content}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">{testimonial.name}</p>
                    <p className="text-slate-500 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- НОВА ИНТЕНЗИВНА СЕКЦИЯ: ФЕЙСБУК ДИСКУСИИ (100% ЕДНАКВИ ЗА ДЕСКТОП И МОБИЛНИ) --- */}
        <div className="reveal opacity-0 mt-16 border-t border-slate-200 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
              Дискусии в майчинските групи във Facebook
            </h3>
            <p className="text-sm md:text-base text-slate-500">
              Ето какво споделят майките в реално време за капките на Пламена
            </p>
          </div>

          {/* ОБЩ ГРИД, КОЙТО СЕ НАСТРОЙВА СПОРЕД ЕКРАНА (1 колона за мобилни, 3 за десктоп) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start font-sans text-[14px]">
            
            {/* КОЛОНА 1: ИНТЕНЗИВЕН РАЗГОВОР (ХЕЙТЪР + КРИТИКА И НАТРУПВАНЕ) */}
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">🔥 Актуална тема</div>
              
              {/* Основен коментар (Скептик) */}
              <div className="flex gap-2">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Стефка Арабаджиева</span>
                    Детето му ги давах 5 дни, но не забелязах абсолютно никакъв ефект. Пак си прокашля сутрин. 😕 Пак пари на вятъра ми се струва...
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>5d</span>
                  </div>
                </div>
              </div>

              {/* Отговор 1 (Разяснение) */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Кристина Павлова</span>
                    Стефка, за 5 дни няма как да стане чудо, това все пак са изцяло натурални билки, а не тежка химия! Има нужда от натрупване в организма, защото естественото така работи. Аз видях реалния стабилен резултат чак след 3-тата седмица. Бъдете упорита и не ги спирайте! 🌱✨
                    <div className="absolute -bottom-1.5 right-2 bg-white px-1 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-100">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-[10px] text-slate-500 font-medium">12</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>4d</span>
                  </div>
                </div>
              </div>

              {/* Отговор 2 (Финално затапване) */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Simona Demerdzhieva</span>
                    Абе има всякакви хора.. Искат за 2 дни с вълшебна пръчица да си решат проблема.. Аз да споделя, че ефекта дойде при нас значително бързо, смея да твърдя че още първите дни детето стана по-енергично, по-свеж вид има. Да чукна на дърво вече 3-та седмица сме на ясла без да отсъстваме, въпреки че чувам сутринта как майки си водят кашлящите деца на яслата. Пламена е направила уникален продукт! ❤️
                    <div className="absolute -bottom-1.5 right-2 bg-white px-1 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-100">
                      <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                      <span className="text-[10px] text-slate-500 font-medium">19</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>3d</span>
                  </div>
                </div>
              </div>

              {/* Отговор 3 (Включване на нова майка) */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1686688081886-2a7c4e983b0c?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800👤">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Gergana Govedarova</span>
                    И при нас в началото нямаше рязка разлика, но бях чела за глицериновия извлек и знаех, че билката иска време. Изкарахме цял месец и сега детето просто не хваща нищо от градината. Севка, не бързайте да съдите от петия ден, дайте му шанс.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>2d</span>
                  </div>
                </div>
              </div>
            </div>

            {/* КОЛОНА 2: ОПИТ С ДЕТСКАТА ГРАДИНА И СРАВНЕНИЕ С ХИМИЯТА */}
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">💬 Споделен опит</div>
              
              <div className="flex gap-2">
                <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Антония Николова</span>
                    Момичета, бях скептична заради рекламите, но капките на Пламена буквално ни спасиха от безкрайния ад "2 дни на градина, 2 седмици вкъщи". Давам ги всяка сутрин директно под езика. Дъщеря ми дори свикна и сама си ги иска. Препоръчам с две ръце! 🥰🌿
                    <div className="absolute -bottom-1.5 right-2 bg-white px-1 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-100">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-[10px] text-slate-500 font-medium">34</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>1w</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Теодора Димитрова</span>
                    И ние сме така! Преди пиехме сироп след сироп от аптеката, само тежка химия. Натурино е първото нещо, което реално разреди боледуванията трайно.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>6d</span>
                  </div>
                </div>
              </div>

              {/* Нов допълнителен отзив в колона 2 */}
              <div className="flex gap-2">
                <img src="https://plus.unsplash.com/premium_photo-1681912592428-5c685a41f31b?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Elena Kostova</span>
                    Аз бях поръчала две опаковки в началото на есента и бях изумена как изкарахме целия грипен период без нито един сопол. Според мен тайната е, че няма никакви боклуци вътре, само чиста природа. Не мисля да го спирам, както Плмена ми препоръча. Дори и лятото мисля да го давам, че то пък тогава почват тия чревните гадости, а ние сме доста уязвими там.
                    <div className="absolute -bottom-1.5 right-2 bg-white px-1 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-100">
                      <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                      <span className="text-[10px] text-slate-500 font-medium">9</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>4d</span>
                  </div>
                </div>
              </div>
            </div>

            {/* КОЛОНА 3: ПОДХОДЯЩО ЗА НАЙ-МАЛКИТЕ (КОРЕКЦИЯ ЗА ЗАХАРТА + 4 НОВИ КОМЕНТАРА) */}
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">👶 За най-малките (18м+)</div>
              
              {/* Основен въпрос */}
              <div className="flex gap-2">
                <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Валерия Янева</span>
                    Някой дава ли ги на детенце на година и половина? Имаме проблем със сополките постоянно, но много внимавам какво давам, че сме с алергии.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>2w</span>
                  </div>
                </div>
              </div>

              {/* Коригиран отговор за състава (без захар и консерванти) */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800 relative">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Ивелина Станчева</span>
                    Да, Валерия! Моят син е точно на 19 месеца и ги приема перфектно. Продуктът е с чист глицеринов извлек на 10 билки и плодове – вътре няма нито капка захар, няма консерванти, оцветители или каквато и да е химия! На вкус е много приятен и леко сладък заради самия растителен глицерин и плодовете, децата го обожават. Сополите спряха на втората седмица изцяло! ❤️🛡️
                    <div className="absolute -bottom-1.5 right-2 bg-white px-1 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 border border-slate-100">
                      <ThumbsUp className="w-3 h-3 text-blue-500 fill-blue-500" />
                      <span className="text-[10px] text-slate-500 font-medium">15</span>
                    </div>
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>2w</span>
                  </div>
                </div>
              </div>

              {/* Нов коментар 2 за малките деца */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1552788960-65fcafe071a5?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Радостина Хаджиева</span>
                    Потвърждавам за състава! Аз лично питах Пламена на съобщение, защото моето много лесно хващаше вируси и стомахчето му е чувствително. Няма никаква захар, чист извлек е. Малката го пие с кеф и вече трети месец не е отсъствала от яслата, а имунитета и се заздрави видимо. Пламена ми каза, че го дава да децата и вече година и половина без да го спират и мисля и аз да процедирам така.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>1w</span>
                  </div>
                </div>
              </div>

              {/* Нов коментар 3 за малките деца */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Aneliya Vasileva</span>
                    Ние започнахме на 14 месеца, точно бяхме спрели да се кърмим и почна да хваща всичко от батко си. Тези капки буквално ни спасиха. Давам директно в устата преди хранене.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>6d</span>
                  </div>
                </div>
              </div>

              {/* Нов коментар 4 за малките деца */}
              <div className="flex gap-2 pl-6 border-l-2 border-slate-100">
                <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80" className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="Avatar"/>
                <div>
                  <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl text-slate-800">
                    <span className="font-bold text-[#050505] block mb-0.5 hover:underline cursor-pointer">Десислава Кошутанска</span>
                    Супер лесно се дозира и е напълно безопасно заради глицериновата основа. Радвам се, че най-накрая има български качествен продукт без тонове консерванти и химии за бебоците ни.
                  </div>
                  <div className="text-slate-500 text-[12px] mt-1 pl-2 font-semibold">
                    <span className="hover:underline cursor-pointer text-slate-600">Like</span> · <span className="hover:underline cursor-pointer text-slate-600">Reply</span> · <span>3d</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* --- КРАЙ НА НОВАТА СЕКЦИЯ --- */}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}} />
    </section>
  );
}