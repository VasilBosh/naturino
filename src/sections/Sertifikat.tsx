import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TouchEvent,
} from 'react';

import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  MoveHorizontal,
  ShieldCheck,
  X,
} from 'lucide-react';

const documents = [
  {
    id: 'quality',
    tabTitle: 'Качество',
    title: 'Удостоверение за качество',
    src: '/sertifikat.png',
    alt: 'Удостоверение за качество на Naturino Kids',
    width: 1275,
    height: 1650,
    description:
      'Документът удостоверява качеството, регистрацията и производствените стандарти на Naturino Kids.',
    showQualityBadge: true,
  },
  {
    id: 'trademark',
    tabTitle: 'Защитена марка',
    title: 'Свидетелство за регистрация на марка',
    src: '/patent.jpg',
    alt: 'Свидетелство за регистрация на търговската марка Naturino Kids',
    width: 1240,
    height: 1753,
    description:
      'Naturino Kids е официално регистрирана търговска марка №178546 в Патентното ведомство на Република България.',
    showQualityBadge: false,
  },
] as const;

const Sertifikat = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const scrollPositionRef = useRef(0);
  const sliderTouchStartXRef = useRef<number | null>(null);
  const sliderTouchCurrentXRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  const dragStartRef = useRef({
    x: 0,
    y: 0,
    pointerX: 0,
    pointerY: 0,
  });

  const [activeDocumentIndex, setActiveDocumentIndex] = useState(0);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Разгъване на дългия текст на телефон (на десктоп текстът е винаги отворен)
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const DOCUMENT_POPUP_ZOOM = 1.6;
  const activeDocument = documents[activeDocumentIndex];

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const changeDocument = (index: number) => {
    const normalizedIndex =
      (index + documents.length) % documents.length;

    setActiveDocumentIndex(normalizedIndex);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const showPreviousDocument = () => {
    changeDocument(activeDocumentIndex - 1);
  };

  const showNextDocument = () => {
    changeDocument(activeDocumentIndex + 1);
  };

  const handleSliderTouchStart = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    sliderTouchStartXRef.current = event.touches[0].clientX;
    sliderTouchCurrentXRef.current = event.touches[0].clientX;
    didSwipeRef.current = false;
  };

  const handleSliderTouchMove = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    if (sliderTouchStartXRef.current === null) return;

    sliderTouchCurrentXRef.current = event.touches[0].clientX;

    const distance =
      sliderTouchCurrentXRef.current -
      sliderTouchStartXRef.current;

    if (Math.abs(distance) > 10) {
      didSwipeRef.current = true;
    }
  };

  const handleSliderTouchEnd = () => {
    if (
      sliderTouchStartXRef.current === null ||
      sliderTouchCurrentXRef.current === null
    ) {
      return;
    }

    const distance =
      sliderTouchCurrentXRef.current -
      sliderTouchStartXRef.current;

    if (Math.abs(distance) >= 45) {
      if (distance < 0) {
        showNextDocument();
      } else {
        showPreviousDocument();
      }
    }

    sliderTouchStartXRef.current = null;
    sliderTouchCurrentXRef.current = null;

    window.setTimeout(() => {
      didSwipeRef.current = false;
    }, 150);
  };

  const openDocument = () => {
    if (didSwipeRef.current) return;

    scrollPositionRef.current = window.scrollY;

    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setIsDocumentOpen(true);
  };

  const closeDocument = () => {
    setIsDocumentOpen(false);
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });

    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'auto',
      });
    });
  };

  const clampPosition = (nextPosition: {
    x: number;
    y: number;
  }) => {
    const viewer = viewerRef.current;
    const imageWrapper = imageWrapperRef.current;

    if (!viewer || !imageWrapper) {
      return nextPosition;
    }

    const viewerRect = viewer.getBoundingClientRect();

    const zoomedWidth =
      imageWrapper.offsetWidth * DOCUMENT_POPUP_ZOOM;

    const zoomedHeight =
      imageWrapper.offsetHeight * DOCUMENT_POPUP_ZOOM;

    const maxX = Math.max(
      0,
      (zoomedWidth - viewerRect.width) / 2
    );

    const maxY = Math.max(
      0,
      (zoomedHeight - viewerRect.height) / 2
    );

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPosition.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPosition.y)),
    };
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(true);

    dragStartRef.current = {
      x: position.x,
      y: position.y,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;

    const deltaX =
      event.clientX - dragStartRef.current.pointerX;

    const deltaY =
      event.clientY - dragStartRef.current.pointerY;

    const nextPosition = {
      x: dragStartRef.current.x + deltaX,
      y: dragStartRef.current.y + deltaY,
    };

    setPosition(clampPosition(nextPosition));
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements =
      sectionRef.current?.querySelectorAll('.reveal');

    elements?.forEach((element) =>
      observer.observe(element)
    );

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isDocumentOpen) return;

    const previousBodyOverflow =
      document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDocument();
      }

      if (event.key === 'ArrowLeft') {
        showPreviousDocument();
      }

      if (event.key === 'ArrowRight') {
        showNextDocument();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isDocumentOpen, activeDocumentIndex]);

  return (
    <>
      <section
        ref={sectionRef}
        id="sertifikat"
        className="section-padding bg-white"
      >
        <div className="container-custom">
          {/* Заглавна част */}
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-16">
            <div className="reveal mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 opacity-0 md:mb-6">
              <FileCheck className="h-4 w-4" />

              <span>Официални документи</span>
            </div>

            <h2 className="reveal mb-4 text-2xl font-black text-slate-900 opacity-0 sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
              Не просто обещания.
              <span className="gradient-text block">
                Доверие, подкрепено с документи
              </span>
            </h2>

            <p className="reveal text-base text-slate-600 opacity-0 md:text-lg">
              Naturino Kids разполага с официално
              удостоверение за качество и свидетелство за
              регистрирана търговска марка, издадено от
              Патентното ведомство на Република България.
            </p>
          </div>

          {/* Основна зелена секция */}
          <div className="reveal rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 opacity-0 md:rounded-3xl md:p-8 lg:p-10">
            <div className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
              {/* Лява част */}
              <div className="order-2 md:order-1">
                <h3 className="mb-4 text-xl font-bold text-slate-900 md:mb-6 md:text-2xl lg:text-3xl">
                  Проверено качество и защитено име
                </h3>

                <div className="mb-6 space-y-3 md:space-y-4">
                  {[
                    'Официално удостоверение за качество',
                    'Регистрация в Българската агенция по безопасност на храните',
                    'Производство по контролирани стандарти',
                    'Регистрирана търговска марка №178546',
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 md:h-6 md:w-6">
                        <Check className="h-3 w-3 text-white md:h-4 md:w-4" />
                      </div>

                      <span className="text-sm text-slate-700 md:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ============================================================
                    ОБЩ ТЕКСТ ЗАД ДВАТА ДОКУМЕНТА
                    Показва се винаги, независимо кой документ е избран.
                    На телефон е свит с бутон, на десктоп е винаги отворен.
                   ============================================================ */}
                <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm md:mb-8 md:rounded-3xl md:p-6 lg:p-7">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700 sm:text-xs">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Зад всяка бутилка</span>
                  </div>

                  <h4 className="mb-4 text-lg font-black leading-snug text-slate-900 sm:text-xl md:text-2xl">
                    Кой стои зад Naturino Kids
                  </h4>

                  <div
                    className={`relative ${
                      isStoryOpen
                        ? ''
                        : 'max-h-[260px] overflow-hidden md:max-h-none md:overflow-visible'
                    }`}
                  >
                    <div className="space-y-4 text-[14.5px] leading-relaxed text-slate-700 md:space-y-5 md:text-[15px] md:leading-7">
                      <p>
                        <strong className="font-bold text-slate-900">
                          Naturino Kids® не е просто име върху
                          опаковка.
                        </strong>{' '}
                        Марката е официално регистрирана в
                        Патентното ведомство на Република
                        България под регистрационен{' '}
                        <strong className="font-bold text-slate-900">
                          №178546
                        </strong>
                        , с притежател „НИКИ – 2025“ ЕООД и
                        правна закрила до 19 август 2035 г.
                      </p>

                      <p>
                        Но зад Naturino Kids стои не само
                        регистрирана марка, а и реално,
                        специализирано българско производство.
                      </p>

                      <p>
                        Зад производството на билковия екстракт
                        стои{' '}
                        <strong className="font-bold text-slate-900">
                          д-р Антон Лазаров
                        </strong>{' '}
                        — основател и управител на ЛААНТ ЕООД,
                        доктор по хранителни технологии от
                        Университета по хранителни технологии в
                        Пловдив и специалист с над 15 години
                        опит в индустрията.
                      </p>

                      <p>
                        Именно аз,{' '}
                        <strong className="font-bold text-slate-900">
                          инж. Пламена Бошнакова
                        </strong>
                        , заедно с д-р Лазаров и екипа му от
                        технолози произвеждаме Naturino Kids в
                        специализираната база на ЛААНТ за
                        билкови екстракти и хранителни добавки.
                        Производството е сертифицирано по
                        международния стандарт ISO 22000:2018 и
                        работи съгласно добрите производствени и
                        хигиенни практики и принципите на HACCP.
                      </p>

                      <p>
                        Naturino Kids е официално регистриран в
                        БАБХ под{' '}
                        <strong className="font-bold text-slate-900">
                          №Т242506848/02.09.2025
                        </strong>
                        . Формулата събира в един концентриран
                        екстракт 10 внимателно подбрани
                        растения: планински лимон, плод бъзак,
                        риган, мащерка, арония, лайка, шипка,
                        салвия, джинджифил и бял равнец.
                      </p>

                      <p>
                        Продуктът се произвежда по точно
                        определена технологична документация, в
                        която са описани съставът и количеството
                        на всяка растителна съставка.
                        Суровините, производствените партиди и
                        готовият продукт подлежат на документиран
                        контрол, а производствената база
                        поддържа и микробиологичен мониторинг.
                        При производството не се използват ГМО.
                      </p>

                      <p>
                        Naturino Kids е без добавена захар,
                        консерванти и изкуствени оцветители и е
                        предназначен за деца от 18-месечна
                        възраст. За продукта ЛААНТ издава
                        удостоверение за качество, с което
                        самото производство застава с името,
                        експертизата и отговорността си зад
                        произведения екстракт.
                      </p>

                      <p className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/70 p-4 font-semibold text-slate-800">
                        Така зад всяка бутилка Naturino Kids
                        стоят не просто обещания, а официално
                        регистрирана марка, регистрация в БАБХ,
                        ясно описан състав, проследим
                        производствен процес, сертифицирана
                        система за безопасност с реални
                        специалисти.
                      </p>
                    </div>

                    {!isStoryOpen && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/85 to-transparent md:hidden" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsStoryOpen((open) => !open)
                    }
                    aria-expanded={isStoryOpen}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100 md:hidden"
                  >
                    {isStoryOpen
                      ? 'Скрий текста'
                      : 'Прочети цялата информация'}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isStoryOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        инж. Пламена Бошнакова
                      </p>
                      <p className="text-xs text-slate-500 md:text-sm">
                        Naturino Kids · производство ЛААНТ ЕООД
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={scrollToCheckout}
                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 sm:w-auto"
                  >
                    ПОРЪЧАЙ С ДОВЕРИЕ →
                  </button>

                  <p className="text-center text-sm font-semibold text-slate-600 sm:text-left">
                    23.90€ • Плащане при получаване
                  </p>
                </div>
              </div>

              {/* Дясна част – слайдър с документите */}
              <div className="order-1 md:order-2">
                <div className="mx-auto w-full max-w-[350px] md:max-w-[380px] lg:max-w-[560px]">
                  {/* Информация, че има два документа */}
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm md:text-sm">
                      <FileCheck className="h-4 w-4" />

                      <span>2 официални документа</span>
                    </div>

                    <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white">
                      {activeDocumentIndex + 1} от{' '}
                      {documents.length}
                    </span>
                  </div>

                  {/* Видими бутони за избор */}
                  <div
                    className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm"
                    role="tablist"
                    aria-label="Избери документ"
                  >
                    {documents.map((document, index) => {
                      const isActive =
                        index === activeDocumentIndex;

                      return (
                        <button
                          key={document.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() =>
                            changeDocument(index)
                          }
                          className={`rounded-xl px-2 py-3 text-xs font-extrabold transition sm:text-sm ${
                            isActive
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-transparent text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {document.tabTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* Самият слайдър */}
                  <div
                    className="relative touch-pan-y"
                    onTouchStart={handleSliderTouchStart}
                    onTouchMove={handleSliderTouchMove}
                    onTouchEnd={handleSliderTouchEnd}
                    onTouchCancel={handleSliderTouchEnd}
                  >
                    <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-emerald-300/20 blur-2xl" />

                    <div className="relative overflow-hidden rounded-2xl">
                      <div
                        className="flex items-center transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(-${
                            activeDocumentIndex * 100
                          }%)`,
                        }}
                      >
                        {documents.map((document, index) => (
                          <div
                            key={document.id}
                            className="flex w-full flex-shrink-0 items-center justify-center"
                            aria-hidden={
                              index !== activeDocumentIndex
                            }
                          >
                            <button
                              type="button"
                              onClick={openDocument}
                              tabIndex={
                                index ===
                                activeDocumentIndex
                                  ? 0
                                  : -1
                              }
                              aria-label={`Отвори: ${document.title}`}
                              className="relative block w-full cursor-zoom-in bg-transparent p-0 text-left"
                            >
                              <img
                                src={document.src}
                                alt={document.alt}
                                width={document.width}
                                height={document.height}
                                draggable={false}
                                className="h-auto w-full select-none rounded-xl bg-white object-contain shadow-2xl shadow-emerald-900/15"
                                loading={
                                  index === 0
                                    ? 'eager'
                                    : 'lazy'
                                }
                              />

                              {document.showQualityBadge && (
                                <img
                                  src="/quality-badge.png"
                                  alt="Бадж за проверено качество"
                                  className="
                                    pointer-events-none absolute z-20 object-contain drop-shadow-xl
                                    left-[1px] top-[12%] h-[72px] w-[72px]
                                    sm:left-[-10px] sm:h-20 sm:w-20
                                    md:left-[-12px] md:h-20 md:w-20
                                    lg:left-[1px] lg:h-28 lg:w-28
                                  "
                                  loading="lazy"
                                />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Лява стрелка */}
                    <button
                      type="button"
                      onClick={showPreviousDocument}
                      aria-label="Предишен документ"
                      className="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-slate-900/75 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-emerald-600 sm:left-3 sm:h-12 sm:w-12"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Дясна стрелка */}
                    <button
                      type="button"
                      onClick={showNextDocument}
                      aria-label="Следващ документ"
                      className="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-700 sm:right-3 sm:h-12 sm:w-12"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Точки и подсказка за плъзгане */}
                  <div className="mt-4 flex flex-col items-center">
                    <div className="mb-3 flex items-center gap-2">
                      {documents.map((document, index) => (
                        <button
                          key={document.id}
                          type="button"
                          onClick={() =>
                            changeDocument(index)
                          }
                          aria-label={`Покажи документ ${
                            index + 1
                          }`}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            index === activeDocumentIndex
                              ? 'w-8 bg-emerald-500'
                              : 'w-2.5 bg-slate-300 hover:bg-emerald-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm sm:text-sm">
                      <MoveHorizontal className="h-4 w-4 animate-pulse" />

                      <span>
                        Плъзни или използвай стрелките
                      </span>
                    </div>
                  </div>

                  {/* Заглавие и текст на активния документ */}
                  <div
                    key={activeDocument.id}
                    className="mt-4 text-center"
                  >
                    <p className="mb-1 text-sm font-extrabold text-slate-900 md:text-base">
                      {activeDocument.title}
                    </p>

                    <p className="mx-auto max-w-md text-xs font-medium leading-5 text-slate-600 md:text-sm md:leading-6">
                      {activeDocument.description}
                    </p>

                    <button
                      type="button"
                      onClick={openDocument}
                      className="mt-3 text-xs font-extrabold text-emerald-700 underline decoration-emerald-300 underline-offset-4 transition hover:text-emerald-800 md:text-sm"
                    >
                      Натисни върху документа за увеличен
                      преглед
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Увеличен преглед */}
      {isDocumentOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeDocument.title}
        >
          {/* Заглавие на отворения документ */}
          <div className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-[10001] max-w-[calc(100%-6rem)] rounded-full bg-white/95 px-4 py-2 text-xs font-extrabold text-slate-900 shadow-lg sm:text-sm">
            {activeDocumentIndex + 1} от{' '}
            {documents.length} • {activeDocument.tabTitle}
          </div>

          {/* Затваряне */}
          <button
            type="button"
            onClick={closeDocument}
            className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[10002] flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100"
            aria-label="Затвори документа"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Предишен документ */}
          <button
            type="button"
            onClick={showPreviousDocument}
            className="fixed left-2 top-1/2 z-[10002] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-black/60 text-white shadow-xl backdrop-blur-sm transition hover:bg-emerald-600 sm:left-5 sm:h-14 sm:w-14"
            aria-label="Предишен документ"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Следващ документ */}
          <button
            type="button"
            onClick={showNextDocument}
            className="fixed right-2 top-1/2 z-[10002] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-black/60 text-white shadow-xl backdrop-blur-sm transition hover:bg-emerald-600 sm:right-5 sm:h-14 sm:w-14"
            aria-label="Следващ документ"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Увеличен документ */}
          <div
            ref={viewerRef}
            className="flex h-[100dvh] w-full touch-none items-center justify-center overflow-hidden px-4 pb-20 pt-16 sm:px-16 sm:pb-20 sm:pt-16 lg:px-24"
          >
            <div
              ref={imageWrapperRef}
              className={`relative select-none touch-none ${
                isDragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
              }`}
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${DOCUMENT_POPUP_ZOOM})`,
                transformOrigin: 'center center',
                transition: isDragging
                  ? 'none'
                  : 'transform 120ms ease-out',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                key={activeDocument.id}
                src={activeDocument.src}
                alt={`${activeDocument.alt} – увеличен преглед`}
                width={activeDocument.width}
                height={activeDocument.height}
                draggable={false}
                className="pointer-events-none block h-auto w-auto max-h-[calc(100dvh-9rem)] max-w-[calc(100vw-2rem)] select-none rounded-xl bg-white object-contain shadow-2xl sm:max-w-[calc(100vw-8rem)] lg:max-w-[calc(100vw-12rem)]"
              />
            </div>
          </div>

          {/* Подсказка долу */}
          <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[10001] -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-700 shadow-lg">
            Задръж и плъзни документа за разглеждане
          </div>
        </div>
      )}
    </>
  );
};

export default Sertifikat;
