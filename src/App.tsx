import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Hero } from './sections/Hero';
import TrustHero from './sections/TrustHero';
import { Footer } from './sections/Footer';
import './App.css';

// Всичко под първия екран — отделен файл. Тегли се веднага (паралелно) и се показва
// щом е готово. Така телефонът първо рисува Hero. Редът на секциите е същият.
// (При build на готовия първи екран тази част не се рисува — остава за браузъра.)
function SsrPending(): null {
  throw new Promise(() => {});
}
const BelowFold = import.meta.env.SSR ? SsrPending : lazy(() => import('./sections/BelowFold'));

// Страниците с условия се зареждат чак когато някой ги отвори (олекотява началното зареждане)
const Terms = lazy(() => import('./Pages/Terms').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./Pages/Privacy').then((m) => ({ default: m.Privacy })));

// КОМПОНЕНТ ЗА ГЛАВНАТА СТРАНИЦА
function LandingPage() {
  return (
    <>
      <Hero />
      <TrustHero />
      {/* Докато се зареди останалото — празно място с височина на екрана (футърът не "подскача" нагоре) */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <BelowFold />
      </Suspense>
    </>
  );
}

// PageView при смяна на страница (/terms, /privacy) — БЕЗ първото зареждане,
// защото то вече е отчетено при инициализацията на пиксела (src/utils/tracking.ts).
// (Преди PageView се пращаше 2 пъти при всяко отваряне на сайта.)
function PixelRouteTracker() {
  const location = useLocation();
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (import.meta.env.VITE_FB_PIXEL_ID) {
      import('react-facebook-pixel').then((m) => m.default.pageView());
    }
  }, [location.pathname]);
  return null;
}

// Съдържанието на сайта (без рутера) — ползва се и в браузъра, и при build за готовия първи екран
export function AppContent() {
  return (
    <>
      <PixelRouteTracker />
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

// ОСНОВНИЯТ APP КОМПОНЕНТ
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
export default App;
