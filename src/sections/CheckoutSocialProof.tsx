import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';

const reviews = Array.from(
  { length: 9 },
  (_, index) => `/social/${index + 1}.jpg`
);

export function CheckoutSocialProof() {
  const [activeReview, setActiveReview] = useState(0);

  const showPrevious = () => {
    setActiveReview((current) =>
      current === 0 ? reviews.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveReview((current) =>
      current === reviews.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section className="w-full px-4 py-8 sm:py-12">
      {/* Заглавие - Остава голямо и разпънато */}
      <div className="mb-8 text-center md:mb-10">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm ring-1 ring-emerald-200">
          <MessageCircle className="h-6 w-6" />
        </div>

        <h3 className="mx-auto max-w-3xl text-[clamp(1.45rem,5vw,2.5rem)] font-black leading-[1.15] tracking-tight text-slate-900">
          Отзиви от затворената ни
          <span className="mt-1 block bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">
            Facebook група и Viber
          </span>
        </h3>

        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 sm:w-24" />
      </div>

      {/* Телефони и таблети — всички отзиви един под друг (вертикален скрол) */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 lg:hidden">
        {reviews.map((review, index) => (
          <div 
            key={review} 
            className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:shadow-lg"
          >
            <img
              src={review}
              alt={`Отзив от родител ${index + 1}`}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="block h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Десктоп — Слайдър (Компактен размер, без да влияе на заглавието) */}
      <div className="hidden w-full lg:block">
        {/* max-w-md прави кутията на слайдера по-тясна */}
        <div className="relative mx-auto flex max-w-md items-center justify-center overflow-hidden rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100">
          
          {/* h-[400px] поддържа умерена височина, за да не изкача огромно */}
          <div className="flex h-[400px] w-full items-center justify-center">
            <img
              src={reviews[activeReview]}
              alt={`Отзив от родител ${activeReview + 1}`}
              className="h-full max-h-full w-auto rounded-xl object-contain shadow-sm"
            />
          </div>

          {/* Бутон Назад */}
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Предишен отзив"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg ring-1 ring-slate-200/80 transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Бутон Напред */}
          <button
            type="button"
            onClick={showNext}
            aria-label="Следващ отзив"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg ring-1 ring-slate-200/80 transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Навигационни точки */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review}
              type="button"
              onClick={() => setActiveReview(index)}
              aria-label={`Покажи отзив ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeReview === index
                  ? 'w-8 bg-emerald-500'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}