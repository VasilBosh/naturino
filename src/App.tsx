import { Stats } from './sections/Stats';
import ReactPixel from 'react-facebook-pixel';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { clarity } from 'react-microsoft-clarity'; // Добавяме Clarity библиотеката
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { PharmacistReview } from './sections/PharmacistReview';
import { Benefits } from './sections/Benefits';
import { Ingredients } from './sections/Ingredients';
import { SocialProof } from './sections/SocialProof';
import { Guarantee } from './sections/Guarantee';
import { FAQ } from './sections/FAQ';
import { Checkout } from './sections/Checkout';
import { Footer } from './sections/Footer';
import { StickyCTA } from './sections/StickyCTA';
import { Terms } from './Pages/Terms';
import './App.css';

// КОМПОНЕНТ ЗА ГЛАВНАТА СТРАНИЦА
function LandingPage() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Hero />
      <Stats />
      <Problem />
      <Solution />
      <PharmacistReview />
      <Benefits />
      <Ingredients />
      <SocialProof />
      <Guarantee />
      <FAQ />
      <Checkout />
      {showSticky && <StickyCTA />}
    </>
  );
}

// ОСНОВНИЯТ APP КОМПОНЕНТ
function App() {
  useEffect(() => {
    // 1. Инициализация на Facebook Pixel
    const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
    if (pixelId) {
      ReactPixel.init(pixelId, undefined, {
        autoConfig: true,
        debug: false,
      });
      ReactPixel.pageView();
    }

    // 2. Инициализация на Microsoft Clarity
    // Използваме твоя проектен код: wd5vkf28a7
    clarity.init('wd5vkf28a7');
  }, []);
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Routes>
          {/* Път за главната страница */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Път за условията за ползване */}
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;