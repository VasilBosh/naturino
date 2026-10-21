/**
 * Naturino Kids — видео секция „Влез с нас в производството“ (Gumlet)
 *
 * МЯСТО: src/sections/VideoTrust.tsx
 * Във фунията — между Problem и Solution:
 *   <Problem />
 *   <VideoTrust />   <-- тук
 *   <Solution />
 *
 * Инсталация:  npm install @gumlet/player.js
 * Постер:      public/images/video-poster.webp  (готовият файл е приложен)
 *
 * Какво прави:
 *  - Показва лек постер, без да зарежда плейъра -> страницата остава бърза
 *  - При клик зарежда Gumlet и пуска видеото със звук
 *  - Глави по реалните сцени във видеото — клик прескача директно на момента
 *  - Meta Pixel събития: VideoSectionView, VideoPlay, Video25/50/75/95,
 *    VideoComplete, VideoChapter, VideoCTAClick, HeroVideoLinkClick
 *  - Финален екран с бутон към поръчката, когато видеото свърши
 */
import { useEffect, useRef, useState } from "react";
import { Player } from "@gumlet/player.js";

// ===== НАСТРОЙКИ =====
const GUMLET_VIDEO_ID = "6ad883e75eed364b108b4c0b"; // Gumlet -> видеото -> Embed -> ID-то след /embed/
const POSTER_SRC = "/images/video-poster.webp";
const POSTER_CAPTION = "Влез с нас в производството";
const DURATION_LABEL = "2:54";
const PRICE_LABEL = "23.90€";

type Chapter = { t: number; label: string };

// Таймкодовете са по реалните сцени във видеото
const CHAPTERS: Chapter[] = [
  { t: 0, label: "Основателите" },
  { t: 21, label: "Билките" },
  { t: 27, label: "Производствената база" },
  { t: 42, label: "Д-р Антон Лазаров" },
  { t: 103, label: "Контрол на качеството" },
  { t: 130, label: "Бутилиране и опаковане" },
];

// Повтарят надписите от самото видео — така секцията и видеото говорят едно и също
const TRUST: string[] = [
  "Сертифицирано по ISO 22000:2018",
  "Контрол на всяка суровина",
  "Проследим производствен процес",
  "Регистриран в БАБХ",
];

const MILESTONES = [25, 50, 75, 95] as const;

type TimeUpdate = { seconds?: number; duration?: number };
type Fbq = (cmd: "trackCustom", name: string, params?: Record<string, unknown>) => void;

function track(name: string, params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (typeof fbq === "function") {
      fbq("trackCustom", name, { video: "proizvodstvo", ...params });
    }
  } catch {
    /* проследяването никога не трябва да чупи страницата */
  }
}

function goToCheckout(source: string): void {
  track("VideoCTAClick", { source });
  // Ако основният ти бутон за поръчка прави нещо повече — извикай същата функция тук.
  document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatTime(t: number): string {
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-none" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export default function VideoTrust() {
  const [loaded, setLoaded] = useState(false);
  const [ended, setEnded] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const pendingSeek = useRef<number | null>(null);
  const fired = useRef<Set<string>>(new Set());

  // Preconnect към Gumlet и събитие "видял секцията" — когато потребителят наближи
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        ["https://play.gumlet.io", "https://video.gumlet.io"].forEach((href) => {
          if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
          const link = document.createElement("link");
          link.rel = "preconnect";
          link.href = href;
          link.crossOrigin = "";
          document.head.appendChild(link);
        });
        track("VideoSectionView");
        io.disconnect();
      },
      { rootMargin: "600px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Връзка с плейъра, след като iframe-ът е в DOM
  useEffect(() => {
    if (!loaded || !iframeRef.current) return;

    const player = new Player(iframeRef.current);
    playerRef.current = player;

    player.on("ready", async () => {
      try {
        if (pendingSeek.current != null) {
          await player.setCurrentTime?.(pendingSeek.current);
          pendingSeek.current = null;
        }
        await player.play?.();
      } catch {
        /* ако браузърът (напр. Safari на iPhone) не позволи — Gumlet показва своя Play бутон и е нужен още един тап */
      }
    });

    player.on("play", () => {
      setEnded(false);
      if (!fired.current.has("play")) {
        fired.current.add("play");
        track("VideoPlay");
      }
    });

    player.on("timeupdate", (data?: TimeUpdate) => {
      const seconds = data?.seconds ?? 0;
      const duration = data?.duration ?? 0;
      if (!duration) return;
      const pct = (seconds / duration) * 100;
      MILESTONES.forEach((m) => {
        const key = `p${m}`;
        if (pct >= m && !fired.current.has(key)) {
          fired.current.add(key);
          track(`Video${m}`);
        }
      });
    });

    player.on("ended", () => {
      setEnded(true);
      track("VideoComplete");
    });

    return () => {
      try {
        player.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  }, [loaded]);

  const seekTo = (t: number, label: string) => {
    track("VideoChapter", { chapter: label });
    setEnded(false);

    if (!loaded) {
      pendingSeek.current = t;
      setLoaded(true);
      return;
    }

    const p = playerRef.current;
    if (!p) return;
    p.setCurrentTime?.(t)
      .then(() => p.play?.())
      .catch(() => {});
  };

  // Без autoplay=true: по документацията на Gumlet autoplay винаги тръгва БЕЗ звук.
  // Вместо това пускаме видеото през player.play() веднага след клика на посетителя -> тръгва със звук.
  const src = `https://play.gumlet.io/embed/${GUMLET_VIDEO_ID}?preload=true&playsinline=true`;

  return (
    <section
      id="video"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 py-14 sm:py-20"
    >
      {/* мек светъл ореол зад видеото */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Заглавие */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-100 ring-1 ring-white/15">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Видео · {DURATION_LABEL} мин
          </span>

          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            Не ни вярвай на думи —{" "}
            <span className="text-emerald-300">виж как се прави всяка капка</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-emerald-50/85 sm:text-lg">
            Влез с нас в производството: билките, лабораторията, контролът на качеството и хората,
            които стоят зад всяка бутилка — от суровината до кутията, която пристига при теб.
          </p>
        </div>

        {/* Видео — на мобилно е от край до край */}
        <div className="relative -mx-4 mt-8 sm:mx-0">
          <div className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl shadow-black/50 sm:rounded-3xl sm:ring-1 sm:ring-white/15">
            {loaded ? (
              <iframe
                ref={iframeRef}
                src={src}
                title="Naturino Kids — как се прави всяка капка"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="group absolute inset-0 h-full w-full cursor-pointer text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
                aria-label={`Пусни видеото, ${DURATION_LABEL} минути`}
              >
                <img
                  src={POSTER_SRC}
                  alt="Основателите на Naturino Kids с продукта"
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Play бутон */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-700 shadow-xl transition group-hover:scale-110 sm:h-20 sm:w-20">
                    <PlayIcon className="ml-1 h-7 w-7 sm:h-9 sm:w-9" />
                  </span>
                </span>

                {/* Надпис долу */}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                  <span className="text-base font-extrabold text-white drop-shadow sm:text-xl">
                    {POSTER_CAPTION}
                  </span>
                  <span className="flex-none rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white">
                    🔊 {DURATION_LABEL}
                  </span>
                </span>
              </button>
            )}

            {/* Финален екран */}
            {ended && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-emerald-950/90 p-6 text-center backdrop-blur-sm">
                <p className="text-lg font-extrabold text-white sm:text-2xl">
                  Това е целия път на Naturino Kids — от природните съставки до готовия продукт.
                </p>
                <button
                  type="button"
                  onClick={() => goToCheckout("end_screen")}
                  className="btn-cta-primary flex items-center justify-center gap-2 px-6"
                >
                  Вземи Naturino Kids →
                </button>
                <button
                  type="button"
                  onClick={() => seekTo(0, "replay")}
                  className="text-sm font-semibold text-emerald-200 underline underline-offset-4"
                >
                  ↺ Гледай отново
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Глави */}
        <div className="mt-5">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-emerald-200/80">
            Във видеото ще видиш
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            {CHAPTERS.map((c) => (
              <button
                key={c.t}
                type="button"
                onClick={() => seekTo(c.t, c.label)}
                className="flex flex-none items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                <span className="font-mono text-xs text-emerald-300">{formatTime(c.t)}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Доверие */}
        <ul className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {TRUST.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-semibold text-emerald-50">
              <span className="text-emerald-300">
                <CheckIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => goToCheckout("below_video")}
            className="btn-cta-primary flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            ИСКАМ ЗДРАВО ДЕТЕ →
          </button>
          <p className="text-center text-sm text-emerald-100/80">
            {PRICE_LABEL} · Плащане при получаване · Доставка 1–2 работни дни
          </p>
        </div>
      </div>
    </section>
  );
}

export { VideoTrust };

/**
 * Малък линк за Hero.tsx — сложи го под цената / бутона „ВЗЕМИ СЕГА“.
 *   import { HeroVideoLink } from "./VideoTrust";
 */
export function HeroVideoLink() {
  return (
    <a
      href="#video"
      onClick={(e) => {
        e.preventDefault();
        track("HeroVideoLinkClick");
        document.getElementById("video")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-700">
        <PlayIcon className="ml-0.5 h-3 w-3" />
      </span>
      Виж как се прави Naturino Kids ({DURATION_LABEL})
    </a>
  );
}
