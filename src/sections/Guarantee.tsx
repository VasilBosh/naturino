import { useEffect, useRef } from 'react';
import { ShieldCheck, ShoppingCart, ArrowDown } from 'lucide-react';

/* =========================================================
   MINI GUARANTEE BADGE
   Използване:
   <GuaranteeBadge />
========================================================= */
export function GuaranteeBadge() {
  const scrollToGuarantee = () => {
    document
      .getElementById('guarantee')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={scrollToGuarantee}
      className="
        group inline-flex items-center gap-3
        rounded-2xl border border-sky-200 bg-white/95
        px-4 py-3 text-left
        shadow-[0_8px_24px_rgba(15,23,42,0.08)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
        <ShieldCheck className="h-5 w-5 text-sky-700" />
      </div>

      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-700">
          Личната гаранция на Пламена
        </div>
        <div className="text-sm font-bold leading-tight text-slate-900">
          Оставам до вас и след покупката
        </div>
      </div>

      <ArrowDown className="ml-1 h-4 w-4 text-sky-700 transition-transform duration-300 group-hover:translate-y-1" />
    </button>
  );
}

/* =========================================================
   MAIN GUARANTEE SECTION
========================================================= */
export function Guarantee() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToCheckout = () => {
    document
      .getElementById('checkout')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="guarantee"
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-sky-50 via-white to-slate-50"
    >
      <div className="container-custom">
        {/* Top label */}
        <div className="reveal mb-5 flex justify-center opacity-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-sky-700" />
            <span className="text-[11px] font-black uppercase tracking-[0.14em] text-sky-700">
              Лична гаранция • Naturino Kids®
            </span>
          </div>
        </div>

        {/* Main document */}
        <div className="reveal opacity-0">
          <div
            className="
              relative mx-auto max-w-5xl overflow-hidden
              rounded-[28px] border border-sky-200/70
              bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]
              px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)]
              sm:px-8 sm:py-10
              md:px-12 md:py-12
              lg:px-16 lg:py-14
            "
          >
            {/* subtle glow */}
            <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-cyan-200/20 blur-3xl" />

            {/* clean inner document edge */}
            <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/70" />

            <div className="relative">
              {/* HOOK / animated top cue */}
              <div className="mb-6 flex justify-center">
                <div
                  className="
                    inline-flex items-center gap-2 rounded-full
                    bg-sky-700 px-4 py-2 text-white
                    shadow-[0_0_0_0_rgba(2,132,199,0.35)]
                    animate-pulse
                  "
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] sm:text-[11px]">
                    Гаранция за вашето спокойствие
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                

                <h2 className="text-[28px] font-black leading-[1.05] text-slate-950 sm:text-[34px] md:text-[42px]">
                  МОЯТА ЛИЧНА
                  <span className="block text-sky-700">ГАРАНЦИЯ КЪМ ВАС</span>
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  Не просто обещание за продукт, а личен ангажимент към всяка майка,
                  която иска да прекъсне цикъла на честото боледуване на своето дете.
                </p>
              </div>

              {/* Main text */}
              <div className="mx-auto mt-7 max-w-3xl text-center">
                <p className="text-base leading-[1.2] text-slate-700 sm:text-[15px] md:text-base">
                  При много деца родителите споделят промяна още около{' '}
                  <strong className="font-black text-sky-700">втората седмица.</strong>
                </p>

                <p className="mt-5 text-base font-black leading-[1.55] text-slate-950 sm:text-lg md:text-[22px]">
                  Но ако след <span className="text-sky-700">30 дни</span> твоето дете все
                  още не е излязло от цикъла на честото боледуване —
                </p>

                <p className="mt-3 text-xl font-black leading-[1.3] text-sky-700 sm:text-2xl md:text-[30px]">
                  оставам до вас, докато не се изяснят причините за това.
                </p>
              </div>

              {/* Body text only */}
              <div className="mx-auto mt-8 max-w-3xl text-center">
                <div className="mb-3 text-[12px] font-black uppercase tracking-[0.16em] text-sky-700 sm:text-xs">
                  Моят ангажимент към вас
                </div>

                <p className="text-sm leading-[1.8] text-slate-700 sm:text-[15px] md:text-base">
                  Ще разгледаме заедно приема, начина и честотата на боледуванията,
                  възстановяването, храненето, съня и факторите, които може да имат
                  значение.
                </p>

                <p className="mt-4 text-sm leading-[1.8] text-slate-700 sm:text-[15px] md:text-base">
                  Ако видя, че причината вероятно е извън това, с което Naturino Kids
                  може да помогне, <strong className="font-black text-slate-950">няма да ви давам празни обещания.</strong>{' '}
                  Ще го кажа честно и ще обсъдим какво има смисъл да се провери и към
                  какъв специалист да се насочите.
                </p>
              </div>

              {/* Main promise */}
              <div className="mx-auto mt-9 max-w-3xl text-center">
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700 sm:text-xs">
                  Това е моята гаранция към вас
                </div>

              
              </div>

              {/* Closing text */}
              <div className="mx-auto mt-8 max-w-3xl text-center">
                <p className="text-sm leading-[1.8] text-slate-600 sm:text-[15px] md:text-base">
                  Защото зад Naturino Kids не стои безличен онлайн магазин.
                </p>

                <p className="mt-2 text-2xl font-black text-slate-950 sm:text-[30px]">
                  Стоя аз.
                </p>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-[1.8] text-slate-600 sm:text-[15px] md:text-base">
                  Майка, която знае какво е детето ти отново и отново да влиза в същия
                  цикъл — и човекът, който е сложил името си върху Naturino Kids.
                </p>
              </div>

              {/* Final statement */}
              <div className="mx-auto mt-9 max-w-3xl text-center">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700 sm:text-xs">
                  Naturino Kids не приключва с поръчката
                </div>

                <h3 className="text-[24px] font-black leading-[1.15] text-slate-950 sm:text-[34px] md:text-[40px]">
                  ТОГАВА ЗАПОЧВА МОЯТА
                  <span className="block text-sky-700">ОТГОВОРНОСТ КЪМ ВАС.</span>
                </h3>
              </div>

              {/* Signature row */}
              <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                {/* Left - signature */}
                <div className="text-left">
                  {/* simple code signature */}
                  <div
                    className="
                      text-[28px] italic leading-none text-sky-700
                      sm:text-[30px]
                      [font-family:'Brush_Script_MT','Segoe_Script','Lucida_Handwriting',cursive]
                    "
                  >
                    Пламена Бошнакова
                  </div>

                  <div className="mt-3 text-sm font-black text-slate-950">
                    инж. Пламена Бошнакова
                  </div>

                  <div className="mt-1 text-[11px] font-black uppercase tracking-[0.10em] text-sky-700">
                    Създател на Naturino Kids®
                  </div>
                </div>

                {/* Right - badge + date */}
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <img
                    src="/guarantee-badge.png"
                    alt="Личната гаранция на Пламена"
                    className="h-auto w-[180px] sm:w-[200px] md:w-[220px]"
                  />

                  <div className="text-[12px] font-bold uppercase tracking-[0.10em] text-slate-500">
                    Дата: 10.10.2024 г.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA below document */}
        <div className="reveal mt-7 flex justify-center opacity-0 sm:mt-9">
          <button
            type="button"
            onClick={scrollToCheckout}
            className="
              group flex w-full max-w-md items-center justify-center gap-3
              rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500
              px-5 py-4 text-white
              shadow-[0_12px_28px_rgba(249,115,22,0.28)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_16px_38px_rgba(249,115,22,0.36)]
              sm:w-auto sm:px-8
            "
          >
            <ShoppingCart className="h-6 w-6" />

            <div className="text-left">
              <div className="text-base font-black leading-none sm:text-lg">
                ПОРЪЧАЙ СЕГА
              </div>
              <div className="mt-1 text-[11px] font-semibold text-orange-50">
                с личната гаранция на Пламена
              </div>
            </div>

            <span className="ml-1 rounded-xl bg-white px-3 py-2 text-lg font-black text-orange-600">
              23.90€
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}