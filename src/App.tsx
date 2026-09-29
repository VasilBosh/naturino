
import ReactPixel from 'react-facebook-pixel';
import Sertifikat from './sections/Sertifikat';
import TrustBadges from './sections/TrustBadges';
import ComparisonSection from './sections/ComparisonSection';
import IntentPopup from './sections/IntentPopup';
import TrustHero from './sections/TrustHero';
import { ReviewsSlider } from './sections/ReviewsSlider';
import { CheckoutSocialProof } from './sections/CheckoutSocialProof';
import { Story } from './sections/Story';
import { Stats } from './sections/Stats';
import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { PharmacistReview } from './sections/PharmacistReview';
import { Benefits } from './sections/Benefits';
import { Ingredients } from './sections/Ingredients';
import { SocialProof } from './sections/SocialProof';
import { FAQ } from './sections/FAQ';
import { Checkout } from './sections/Checkout';
import { Footer } from './sections/Footer';
import { FloatingChat } from './sections/FloatingChat';
import { StickyCTA } from './sections/StickyCTA';
// Страниците с условия се зареждат чак когато някой ги отвори (олекотява началното зареждане)
const Terms = lazy(() => import('./Pages/Terms').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./Pages/Privacy').then((m) => ({ default: m.Privacy })));
import './App.css';

// ==========================================================
// FACEBOOK PIXEL — инициализира се ВЕДНЪЖ, ПРЕДИ страницата да се нарисува.
// Преди се инициализираше след като секциите вече бяха заредени, и събитието
// ViewContent (от Checkout) тръгваше ПРЕДИ пиксела да е готов → губеше се всеки път.
// Пиксел ID-то идва от .env (VITE_FB_PIXEL_ID), както досега.
// ==========================================================
const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
if (pixelId) {
  ReactPixel.init(pixelId, undefined, {
    autoConfig: true,
    debug: false,
  });
  ReactPixel.pageView();
}

// КОМПОНЕНТ ЗА ГЛАВНАТА СТРАНИЦА
function LandingPage() {
  return (
    <>
      <FloatingChat />
      <Hero />
      <TrustHero />
      <Problem />
      <Solution />
      <ReviewsSlider />
      <ComparisonSection />
      <PharmacistReview />
      <Benefits />
      <Ingredients />
      <Sertifikat />
      <Story />
      <Stats />
      <SocialProof />
      <FAQ />     
      <TrustBadges />
      <Checkout />
      <CheckoutSocialProof />
      <IntentPopup />
      {/* StickyCTA сам решава кога да се покаже (след 500px скрол) */}
      <StickyCTA />
    </>
  );
}

// PageView при смяна на страница (/terms, /privacy) — БЕЗ първото зареждане,
// защото то вече е отчетено при инициализацията на пиксела.
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
      ReactPixel.pageView();
    }
  }, [location.pathname]);
  return null;
}

// ОСНОВНИЯТ APP КОМПОНЕНТ
function App() {
  useEffect(() => {
    // 1. Facebook Pixel се инициализира по-горе (извън компонента), преди страницата да се нарисува.

    // 2. Инициализация на Microsoft Clarity — след като страницата се зареди,
    // за да не се бори за мрежата/процесора с първия екран. Записите си работят както преди.
    const win = window as any;
    const loadClarity = () => {
      if (win.clarity) return;
      win.clarity = function() {
        (win.clarity.q = win.clarity.q || []).push(arguments);
      };
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.clarity.ms/tag/wd5vkf28a7";
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };
    const scheduleClarity = () => {
      if ('requestIdleCallback' in win) win.requestIdleCallback(loadClarity, { timeout: 3000 });
      else setTimeout(loadClarity, 1500);
    };
    if (document.readyState === 'complete') scheduleClarity();
    else window.addEventListener('load', scheduleClarity, { once: true });
  }, []);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
export default App;