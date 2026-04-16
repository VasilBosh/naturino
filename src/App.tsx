import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 1. Добавяме това
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { PharmacistReview } from './sections/PharmacistReview';
import { Benefits } from './sections/Benefits';
import { HowItWorks } from './sections/HowItWorks';
import { Ingredients } from './sections/Ingredients';
import { SocialProof } from './sections/SocialProof';
import { Guarantee } from './sections/Guarantee';
import { FAQ } from './sections/FAQ';
import { Checkout } from './sections/Checkout';
import { Footer } from './sections/Footer';
import { StickyCTA } from './sections/StickyCTA';
import { Terms } from './pages/Terms'; // 2. Трябва да създадеш такъв файл в src/pages/Terms.tsx
import './App.css';

// СЪЗДАВАМЕ ОТДЕЛЕН КОМПОНЕНТ ЗА ГЛАВНАТА СТРАНИЦА
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
      <Problem />
      <Solution />
      <PharmacistReview />
      <Benefits />
      {/* <HowItWorks /> */}
      <Ingredients />
      <SocialProof />
      <Guarantee />
      <FAQ />
      <Checkout />

      
      {showSticky && <StickyCTA />}
    </>
  );
}

// ОСНОВНИЯТ APP СЕГА УПРАВЛЯВА ПЪТИЩАТА
function App() {
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