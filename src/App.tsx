import { Stats } from './sections/Stats';
import ReactPixel from 'react-facebook-pixel';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Privacy } from './Pages/Privacy';
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

    // 2. Инициализация на Microsoft Clarity (Чист метод)
    const win = window as any;
    if (!win.clarity) {
      win.clarity = function() {
        (win.clarity.q = win.clarity.q || []).push(arguments);
      };
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.clarity.ms/tag/wd5vkf28a7";
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }
  }, []); // <--- Правилно затваряне на useEffect

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Routes>
          {/* Път за главната страница */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Път за условията за ползване */}
          <Route path="/terms" element={<Terms />} />
          
          {/* Път за политиката за поверителност */}
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;