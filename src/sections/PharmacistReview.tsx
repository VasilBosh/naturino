import { useEffect, useRef } from 'react';
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Store,
} from 'lucide-react';

const storeGroups = [
  {
    city: 'Казанлък',
    count: 5,
    stores: [
      {
        name: 'Аптека Апостолов – Изток',
        address: 'ж.к. Изток, бл. 1А',
        type: 'Аптека',
      },
      {
        name: 'Аптека Апостолов – Пазара',
        address: 'ул. „Св. Св. Кирил и Методий“ 20–22',
        type: 'Аптека',
      },
      {
        name: 'Аптека Апостолов – Запад',
        address: 'бул. „23-ти пехотен Шипченски полк“ 7',
        type: 'Аптека',
      },
      {
        name: 'Аптека Апостолов – Розариум',
        address: 'ул. „Генерал Столетов“ 2',
        type: 'Аптека',
      },
      {
        name: 'Аптека Нова Фарм',
        address: 'ул. „Софроний Врачански“ 11',
        type: 'Аптека',
      },
    ],
  },
  {
    city: 'София',
    count: 2,
    stores: [
      {
        name: 'Денонощна аптека Новедес',
        address: 'бул. „Братя Бъкстон“ 28, партер',
        type: 'Денонощна аптека',
      },
      {
        name: 'Amaya Organics',
        address: 'гр. София, кв. Манастирски ливади-запад ул. Казбек 57Б, магазин Amaya Organics',
        type: 'Специализиран магазин',
      },
    ],
  },
  {
    city: 'Плевен',
    count: 1,
    stores: [
      {
        name: 'Магазин ЕЛИКСИР',
        address: 'ул. „Николай Хайтов“ №20',
        type: 'Специализиран магазин',
      },
    ],
  },
  {
    city: 'Чирпан',
    count: 1,
    stores: [
      {
        name: 'Дрогерия Белла Донна',
        address: 'ул. „Димо Недев“ 9',
        type: 'Дрогерия',
      },
    ],
  },
  {
    city: 'Пловдив',
    count: 2,
    stores: [
      {
        name: 'Аптека Nova Farm',
        address: 'Оазис 3, ж.к. Южен, ул. „Братя Шкорпил“ 15Д',
        type: 'Аптека',
      },
      {
        name: 'Аптека Апостолов',
        address: 'бул. "Освобождение" 42, Парк Лаута',
        type: 'Аптека',
        status: 'ОТ НОЕМВРИ',
      },
    ],
  },
];

export function PharmacistReview() {
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

  return (
    <section
      id="physical-stores"
      ref={sectionRef}
      className="w-full max-w-full overflow-x-hidden bg-slate-50 py-10 md:py-16 scroll-mt-20"
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 md:px-8 box-border">

        {/* ====================================================== */}
        {/* ЕДИННА ГОЛЯМА СЕКЦИЯ */}
        {/* ====================================================== */}

        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50">

          {/* ==================================================== */}
          {/* HEADER */}
          {/* ==================================================== */}

          <div className="w-full min-w-0 px-4 sm:px-6 md:px-10 pt-7 md:pt-11 pb-6 text-center box-border">

            <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-[11px] sm:text-sm font-black text-emerald-700">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="min-w-0 break-words">
                Доверие, което можеш да провериш
              </span>
            </div>

            <h2 className="mt-4 mx-auto max-w-4xl text-[28px] sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.07] break-words">
              Препоръчван от{' '}
              <span className="text-emerald-600">
                педиатри и фармацевти.
              </span>{' '}
              Вече и във физически обекти.
            </h2>

            <p className="mt-4 mx-auto max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 break-words">
              Naturino Kids вече не е продукт, който можеш да откриеш само
              онлайн. Изграждаме реална партньорска мрежа от аптеки,
              дрогерии и специализирани магазини в страната.
            </p>

          </div>

          {/* ==================================================== */}
          {/* ФАРМАЦЕВТ + TRUST */}
          {/* ==================================================== */}

          <div className="w-full min-w-0 px-4 sm:px-6 md:px-10 pb-8 md:pb-10 box-border">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-stretch w-full min-w-0">

              {/* ============================ */}
              {/* ФАРМАЦЕВТ */}
              {/* ============================ */}

              <div className="reveal opacity-0 w-full min-w-0 max-w-full">

                <div className="relative w-full min-w-0 max-w-full">

                {/* Badge - може да стърчи извън снимката */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-max max-w-[calc(100%-2rem)]">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-3 py-2 shadow-lg text-slate-900">
                    <BadgeCheck className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide whitespace-nowrap">
                      Професионално доверие
                    </span>
                  </div>
                </div>

                {/* Самата карта със снимката */}
                <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[1.6rem] bg-emerald-900 shadow-xl">

                  <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-full lg:min-h-[590px] overflow-hidden"></div>
                    
                    <img
                      src="/images/MariaPetrova.webp"
                      alt="Фармацевт в аптека"
                      className="absolute inset-0 block w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent pointer-events-none" />

                   

                    {/* Текст върху снимката */}
                    <div className="absolute inset-x-0 bottom-0 w-full min-w-0 p-3 sm:p-5 md:p-6 box-border">

                      <div className="w-full min-w-0 max-w-full rounded-2xl border border-white/10 bg-emerald-950/45 p-4 backdrop-blur-sm box-border">

                        <div className="flex items-start gap-2 min-w-0">

                          <div className="w-9 h-9 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-amber-300" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-white font-black text-base sm:text-lg leading-tight break-words">
                              Д-р Анита Манукян, магистър - фармацевт
                            </p>

                            <p className="mt-2 text-emerald-50 text-sm sm:text-base leading-relaxed break-words">
                              Naturino Kids вече е наличен
                              във физически аптеки и специализирани магазини.
                            </p>
                          </div>

                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* ============================ */}
              {/* TRUST CONTENT */}
              {/* ============================ */}

              <div className="reveal opacity-0 w-full min-w-0 max-w-full flex flex-col gap-4">

                {/* 9 ОБЕКТА */}
                <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[1.6rem] bg-emerald-900 p-5 sm:p-6 md:p-7 text-white box-border">

                  <p className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-emerald-200 break-words">
                    Физическа партньорска мрежа
                  </p>

                  <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2 min-w-0">

                    <span className="shrink-0 text-3xl sm:text-5xl font-black leading-none text-amber-300">
                      11
                    </span>

                    <span className="min-w-0 text-xl sm:text-2xl font-black leading-tight break-words pb-1">
                      обекта в 5 града
                    </span>

                  </div>

                  <p className="mt-4 w-full min-w-0 text-sm sm:text-base leading-relaxed text-emerald-100 break-words">
                    <strong className="text-white">
                      10 обекта са налични сега,
                    </strong>{' '}
                    а новият обект на Аптеки Апостолов в Пловдив се
                    присъединява към мрежата{' '}
                    <strong className="text-amber-300">
                      от ноември.
                    </strong>
                  </p>

                </div>

                {/* TRUST CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">

                  <div className="w-full min-w-0 rounded-2xl bg-emerald-50 p-4 box-border">
                    <Store className="w-6 h-6 text-emerald-700" />

                    <p className="mt-2 text-sm sm:text-base font-black text-slate-900 break-words">
                      Физически обекти
                    </p>

                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                      Реални аптеки, дрогерии и специализирани магазини.
                    </p>
                  </div>

                  <div className="w-full min-w-0 rounded-2xl bg-emerald-50 p-4 box-border">
                    <BadgeCheck className="w-6 h-6 text-emerald-700" />

                    <p className="mt-2 text-sm sm:text-base font-black text-slate-900 break-words">
                      Специалисти
                    </p>

                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                      Препоръчван от педиатри и фармацевти.
                    </p>
                  </div>

                  <div className="w-full min-w-0 rounded-2xl bg-emerald-50 p-4 box-border">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />

                    <p className="mt-2 text-sm sm:text-base font-black text-slate-900 break-words">
                      Проверима информация
                    </p>

                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                      Съставът и документите за качество са публично
                      достъпни.
                    </p>
                  </div>

                  <div className="w-full min-w-0 rounded-2xl bg-emerald-50 p-4 box-border">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />

                    <p className="mt-2 text-sm sm:text-base font-black text-slate-900 break-words">
                      Чист състав
                    </p>

                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                      Без захар, консерванти и оцветители.
                    </p>
                  </div>

                </div>

                {/* TRUST MESSAGE */}
                <div className="w-full min-w-0 max-w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 box-border">

                  <div className="flex items-start gap-3 min-w-0">

                    <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-amber-700" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm sm:text-base font-black text-slate-900 break-words">
                        Доверието не трябва просто да се обещава.
                      </p>

                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                        Затова показваме точно къде можеш да откриеш
                        Naturino Kids на място.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================== */}
          {/* DIVIDER */}
          {/* ==================================================== */}

          <div className="mx-4 sm:mx-6 md:mx-10 border-t border-slate-200" />

          {/* ==================================================== */}
          {/* ОБЕКТИ */}
          {/* ==================================================== */}

          <div className="w-full min-w-0 max-w-full px-4 sm:px-6 md:px-10 py-8 md:py-10 box-border">

            <div className="w-full min-w-0">

              <div className="inline-flex max-w-full items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wide text-emerald-700">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="break-words">
                  Къде да ни намериш
                </span>
              </div>

              <h3 className="mt-2 text-2xl md:text-3xl font-black leading-tight text-slate-900 break-words">
                Naturino Kids близо до теб
              </h3>

              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-500 break-words">
                Виж точния физически обект и адрес във всеки град.
              </p>

            </div>

            {/* На телефон задължително 1 колона */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">

              {storeGroups.map((group) => (
                <div
                  key={group.city}
                  className={`w-full min-w-0 max-w-full rounded-3xl border p-4 sm:p-5 md:p-6 box-border ${
                    group.comingSoon
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >

                  {/* CITY HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 min-w-0">

                    <div className="flex items-center gap-2.5 min-w-0">

                      <div
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                          group.comingSoon
                            ? 'bg-amber-100'
                            : 'bg-emerald-100'
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 ${
                            group.comingSoon
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="text-lg font-black text-slate-900 break-words">
                          {group.city}
                        </p>

                        <p className="text-xs text-slate-500">
                          {group.count}{' '}
                          {group.count === 1 ? 'обект' : 'обекта'}
                        </p>

                      </div>
                    </div>

                    {group.comingSoon && (
                      <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-900">
                        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                        <span>От ноември</span>
                      </div>
                    )}

                  </div>

                  {/* STORES */}
                  <div className="space-y-3 w-full min-w-0">

                    {group.stores.map((store) => (
                      <div
                        key={`${group.city}-${store.name}`}
                        className="w-full min-w-0 max-w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm box-border"
                      >

                        <div className="flex items-start gap-3 min-w-0">

                          <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                          </div>

                          <div className="min-w-0 flex-1 max-w-full">

                            <div className="flex flex-wrap items-center gap-2 min-w-0">

                              <p className="min-w-0 text-sm sm:text-base font-black leading-tight text-slate-900 break-words">
                                {store.name}
                              </p>

                              {'status' in store && store.status && (
                                <span className="max-w-full rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black uppercase text-amber-800 break-words">
                                  {store.status}
                                </span>
                              )}

                            </div>

                            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 break-words">
                              {store.address}
                            </p>

                            <p className="mt-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-emerald-700 break-words">
                              {store.type}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* ==================================================== */}
          {/* КАРТА */}
          {/* ==================================================== */}

          <div className="w-full min-w-0 max-w-full px-4 sm:px-6 md:px-10 pb-10 md:pb-12 box-border">

            <div className="w-full min-w-0 max-w-full overflow-hidden rounded-[1.6rem] bg-emerald-950 shadow-xl">

              <div className="px-4 sm:px-6 pt-5 pb-3 text-center">

                <div className="inline-flex max-w-full items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Naturino Kids в България</span>
                </div>

                <p className="mt-2 text-lg sm:text-xl font-black text-white break-words">
                  11 партньорски обекта • 5 града
                </p>

              </div>

              <div className="w-full p-2 sm:p-4 box-border">

                <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white">

                  <img
                    src="/images/NaturinoStoresMap.webp"
                    alt="Карта на България с градовете, в които се предлага Naturino Kids"
                    className="block w-full max-w-full h-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}