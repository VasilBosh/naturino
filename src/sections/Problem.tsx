import { useEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  WalletCards,
  Stethoscope,
  Users,
  MoonStar,
  Clock3,
  ArrowDown,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    {
      icon: BriefcaseBusiness,
      text: 'Губиш работен ден',
    },
    {
      icon: Clock3,
      text: 'Работата ти изостава',
    },
    {
      icon: WalletCards,
      text: 'Плащаш прегледи, лекарства и изследвания',
    },
    {
      icon: Stethoscope,
      text: 'Висиш по кабинети с часове',
    },
    {
      icon: Users,
      text: 'Няма кой да гледа детето',
    },
    {
      icon: MoonStar,
      text: 'А нощем не спиш от притеснения',
    },
  ];

  const cycle = [
    'Хрема',
    'Кашлица',
    'Лекарства',
    'Вкъщи',
    'Оправя се',
    'Градина',
    'И пак отначало',
  ];

  const after = [
    'Редовно вече на ясла и градина',
    'Без отменени почивки и празници',
    'Без излишни разходи за лекарства и прегледи',
    'Без отсъствия от работа',
    'По-спокойни нощи за теб и детето',
    'Повече нормален живот за цялото семейство',
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-rose-100/50 blur-3xl" />

        <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div
          className={`mx-auto max-w-4xl text-center transition-all duration-700 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="mb-5 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-rose-600 sm:text-xs">
            Това не е просто поредната хрема
          </div>

          <h2 className="text-[30px] font-black leading-[1.05] tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-[56px]">
            Когато детето пак се разболее,

            <span className="mt-2 block text-rose-600">
              не боледува само то.
            </span>
          </h2>
        </div>

        {/* ===================================================== */}
        {/* PROBLEMS */}
        {/* ===================================================== */}

        <div
          className={`mx-auto mt-9 grid max-w-5xl grid-cols-1 gap-2.5 transition-all delay-150 duration-700 sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <div
                key={problem.text}
                className="
                  group
                  flex
                  min-h-[72px]
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  px-4
                  py-4
                  shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-rose-200
                  hover:shadow-lg
                  sm:min-h-[86px]
                  sm:px-5
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-rose-50
                    text-rose-600
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={2.2}
                  />
                </div>

                <p className="text-[15px] font-extrabold leading-snug text-slate-900 sm:text-base">
                  {problem.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* ===================================================== */}
        {/* SHORT PUNCH */}
        {/* ===================================================== */}

        <div
          className={`mx-auto mt-7 max-w-3xl text-center transition-all delay-300 duration-700 sm:mt-9 ${
            isVisible
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <p className="text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            И когато най-после всичко мине…
          </p>

          <p className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
            след седмица може да започне отначало.
          </p>
        </div>

        {/* ===================================================== */}
        {/* THE CYCLE */}
        {/* ===================================================== */}

        <div
          className={`relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 px-5 py-8 text-slate-900 shadow-[0_15px_45px_rgba(15,23,42,0.08)] transition-all delay-300 duration-700 sm:mt-14 sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          {/* subtle background circles */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-slate-200/80" />

          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-slate-200/80" />

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* icon */}

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <RotateCcw className="h-6 w-6" />
            </div>

            {/* title */}

            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">
              Това е цикълът
            </span>

            {/* ================================================= */}
            {/* DESKTOP CYCLE */}
            {/* ================================================= */}

            <div className="mt-6 hidden items-center justify-center gap-3 lg:flex">
              {cycle.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`rounded-xl px-4 py-3 text-sm font-black shadow-sm ${
                      index === cycle.length - 1
                        ? 'bg-rose-500 text-white'
                        : 'border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    {item}
                  </span>

                  {index !== cycle.length - 1 && (
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </div>
              ))}
            </div>

            {/* ================================================= */}
            {/* MOBILE + TABLET CYCLE */}
            {/* ================================================= */}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:hidden">
              {cycle.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`rounded-lg px-3 py-2 text-[13px] font-black shadow-sm ${
                      index === cycle.length - 1
                        ? 'bg-rose-500 text-white'
                        : 'border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    {item}
                  </span>

                  {index !== cycle.length - 1 && (
                    <span className="font-bold text-slate-400">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* separator */}

            <div className="my-7 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            {/* punch */}

            <p className="text-base font-semibold text-slate-600 sm:text-lg">
              И всеки път гасиш

              <span className="font-black text-slate-950">
                {' '}
                поредния пожар.
              </span>
            </p>

            {/* MAIN MESSAGE */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-rose-200
                bg-rose-50
                px-5
                py-5
                shadow-sm
                sm:px-8
                sm:py-6
              "
            >
              <p className="text-xs font-black uppercase tracking-wider text-rose-600 sm:text-sm">
                А истинската цел е друга:
              </p>

              <p className="mt-1 text-2xl font-black leading-tight text-slate-950 sm:text-3xl lg:text-4xl">
                ДА ПРЕКЪСНЕШ ЦИКЪЛА.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* TRANSITION ARROW */}
        {/* ===================================================== */}

        <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-center sm:h-20">

          <div className="absolute h-full w-px bg-gradient-to-b from-slate-300 to-emerald-300" />

          <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm">
            <ArrowDown className="h-4 w-4 animate-bounce text-emerald-600" />
          </div>
        </div>

        {/* ===================================================== */}
        {/* AFTER / SOLUTION */}
        {/* ===================================================== */}

        <div
          className={`mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-[0_20px_70px_rgba(16,185,129,0.08)] transition-all delay-500 duration-700 sm:p-8 lg:p-10 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

            {/* LEFT SIDE */}

            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                След
              </span>

              <h3 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                Когато ежедневието

                <span className="block text-emerald-600">
                  вече не се върти около боледуването.
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                Не още нещо за поредния симптом.

                <span className="font-extrabold text-slate-900">
                  {' '}
                  Целта е да промениш целия сценарий.
                </span>
              </p>
            </div>

            {/* RIGHT SIDE */}

            <div className="space-y-2.5">
              {after.map((item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-emerald-100
                    bg-white
                    px-4
                    py-4
                    shadow-sm
                    sm:px-5
                  "
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check
                      className="h-4 w-4 text-emerald-700"
                      strokeWidth={3}
                    />
                  </div>

                  <p className="text-[15px] font-extrabold leading-snug text-slate-900 sm:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================= */}
          {/* FINAL MESSAGE */}
          {/* ================================================= */}

          <div className="mt-8 border-t border-emerald-100 pt-7 text-center sm:mt-10 sm:pt-8">

            <p className="text-xl font-black leading-tight text-slate-950 sm:text-2xl lg:text-3xl">
              Точно за тази промяна създадохме

              <span className="text-emerald-600">
                {' '}
                Naturino Kids.
              </span>
            </p>

            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-slate-600 sm:text-base">
              Не да чакаш следващото разболяване.

              <span className="font-black text-slate-900">
                {' '}
                А да започнеш да прекъсваш цикъла.
              </span>
            </p>

            <ArrowDown className="mx-auto mt-5 h-6 w-6 animate-bounce text-emerald-600" />
          </div>
        </div>

      </div>
    </section>
  );
}