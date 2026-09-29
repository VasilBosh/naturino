// Всичко под първия екран. Зарежда се като отделен файл веднага след Hero,
// за да може телефонът първо да покаже горната част (по-бърз LCP), а после останалото.
// Редът и съдържанието на секциите са 1:1 като преди.
import { useEffect } from 'react';
import Sertifikat from './Sertifikat';
import TrustBadges from './TrustBadges';
import ComparisonSection from './ComparisonSection';
import IntentPopup from './IntentPopup';
import { ReviewsSlider } from './ReviewsSlider';
import { CheckoutSocialProof } from './CheckoutSocialProof';
import { Story } from './Story';
import { Stats } from './Stats';
import { Problem } from './Problem';
import { Solution } from './Solution';
import { PharmacistReview } from './PharmacistReview';
import { Benefits } from './Benefits';
import { Ingredients } from './Ingredients';
import { SocialProof } from './SocialProof';
import { FAQ } from './FAQ';
import { Checkout } from './Checkout';
import { FloatingChat } from './FloatingChat';
import { StickyCTA } from './StickyCTA';

export default function BelowFold() {
  // Ако някой е влязъл с линк към секция (напр. .../#checkout) — скролваме я, щом се появи
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      <FloatingChat />
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
