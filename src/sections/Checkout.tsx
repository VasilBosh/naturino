import ReactPixel from 'react-facebook-pixel';
import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Phone, User, Check, Truck, Shield, Mail, Package, ArrowRight, RotateCcw, Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpsellFlow } from './UpsellFlow';
import { CourierPicker, type CourierSelection } from '../components/CourierPicker';

// Максимално количество в една поръчка (защита срещу случайно натискане)
const MAX_QUANTITY = 10;

export function Checkout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState<CourierSelection | null>(null);
  const [deliveryError, setDeliveryError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validPopupCode, setValidPopupCode] = useState<string | null>(null);

  // Бележка под имейла: 'fixed' = поправихме го автоматично, 'warn' = изглежда съмнителен.
  // И двете са само информация — никога не спират поръчката.
  const [emailNote, setEmailNote] = useState<{ kind: 'fixed' | 'warn'; text: string } | null>(null);

  // Непълен телефон — червено съобщение, спира поръчката
  const [phoneNote, setPhoneNote] = useState<{ text: string } | null>(null);

  // Червено обрамчване на празните задължителни полета (пали се от браузърната проверка)
  const [fieldErrors, setFieldErrors] = useState({ fullName: false, phone: false, email: false });
  const markInvalid = (field: 'fullName' | 'phone' | 'email') =>
    setFieldErrors((prev) => ({ ...prev, [field]: true }));

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    promoCode: '',
  });

  const [flowOrder, setFlowOrder] = useState<{ eventId: string; quantity: number; total: number } | null>(null);

  // Рефове — държат стойност веднага, без да чакат React да прерисува
  const addToCartFiredRef = useRef(false);
  const touchedCountRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const submitLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;

  // ==========================================================
  // ТЕЛЕФОН
  // ==========================================================

  // Пипаме номера САМО когато е сигурно, че липсва нещо. Иначе го оставяме както е.
  //
  //   0894748101      -> 0894748101   10 цифри = готов, НЕ пипаме
  //   0987654321      -> 0987654321   10 цифри с 09 = НЕ пипаме
  //   029876543       -> 029876543    стационарен с 0 = НЕ пипаме
  //   894748101       -> 0894748101   9 цифри без 0 -> добавяме само 0
  //   94748101        -> 0894748101   8 цифри без 08 -> добавяме 08
  //   +359894748101   -> 0894748101   български международен -> национален
  //   +3590894748101  -> 0894748101
  //   00359894748101  -> 0894748101
  //   +44 7946 095812 -> НЕ ПИПАМЕ    чуждестранен номер
  const normalizePhone = (raw: string) => {
    const input = String(raw || '').trim();
    if (!input) return '';

    const hasPlus = input.startsWith('+');
    let d = input.replace(/\D/g, '');
    if (!d) return input;

    // --- Чуждестранен номер: връщаме го точно както е въведен ---
    if (hasPlus && !d.startsWith('359')) return input;
    if (!hasPlus && d.startsWith('00') && !d.startsWith('00359')) return input;

    // --- Български международен формат -> национален ---
    let hadCountryCode = false;
    if (d.startsWith('00359')) { d = d.slice(5); hadCountryCode = true; }
    else if (d.startsWith('359')) { d = d.slice(3); hadCountryCode = true; }

    // --- Оттук d е националната част ---
    if (d.startsWith('0')) return d;                 // вече започва с 0 -> НЕ пипаме
    if (d.length === 9) return '0' + d;              // липсва само водещата нула

    // "08" се добавя САМО ако номерът е въведен БЕЗ код на държава.
    // При +359 националната част вече е пълна — там нищо не се измисля.
    if (!hadCountryCode && d.length === 8 && /^[789]/.test(d)) {
      return '08' + d;                               // липсва 08 отпред (087/088/089)
    }
    return d;                                        // всичко друго — не гадаем
  };

  // Показва номера като 0894 748 101. Пипа само пълен 10-цифрен български номер.
  const prettyPhone = (raw: string) => {
    const p = normalizePhone(raw);
    if (/^0\d{9}$/.test(p)) return p.slice(0, 4) + ' ' + p.slice(4, 7) + ' ' + p.slice(7);
    return String(raw || '').trim(); // непълен или чужд номер — оставяме както е написан
  };

  // Номерът е непълен, ако е под 10 цифри. Чуждестранните не проверяваме.
  const reviewPhone = (raw: string): { text: string } | null => {
    const input = String(raw || '').trim();
    if (!input) return null;

    const digits = input.replace(/\D/g, '');
    if (!digits) return null;

    if (input.startsWith('+') && !digits.startsWith('359')) return null;
    if (!input.startsWith('+') && digits.startsWith('00') && !digits.startsWith('00359')) return null;

    return normalizePhone(input).length < 10 ? { text: 'Номерът е непълен' } : null;
  };

  // ==========================================================
  // ИМЕЙЛ — автоматична поправка, НИКОГА не спира поръчка
  // ==========================================================

  // Домейните, които реално използват българските клиенти
  const KNOWN_DOMAINS = [
    'abv.bg', 'mail.bg', 'dir.bg', 'mbox.bg',
    'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'icloud.com', 'live.com', 'msn.com', 'me.com', 'aol.com',
    'proton.me', 'protonmail.com',
  ];

  // Изрично известни грешки, които разстоянието не хваща
  const DOMAIN_TYPOS: Record<string, string> = {
    'gmai.com': 'gmail.com', 'gmial.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmaul.com': 'gmail.com',
    'gmail.bg': 'gmail.com', 'gmail.cpm': 'gmail.com',
    'avb.bg': 'abv.bg', 'adv.bg': 'abv.bg', 'abvv.bg': 'abv.bg', 'abv.com': 'abv.bg',
    'mial.bg': 'mail.bg', 'dirr.bg': 'dir.bg', 'dir.com': 'dir.bg',
    'yaho.com': 'yahoo.com', 'yahho.com': 'yahoo.com', 'yahoo.bg': 'yahoo.com',
    'hotmai.com': 'hotmail.com', 'hotmial.com': 'hotmail.com', 'hotmail.bg': 'hotmail.com',
    'outlok.com': 'outlook.com', 'outlook.bg': 'outlook.com',
    'iclod.com': 'icloud.com', 'icloud.bg': 'icloud.com',
  };

  // Окончания, които не съществуват — за предупреждение при непознат домейн
  const BAD_TLDS = [
    'con', 'conm', 'comm', 'cpm', 'cmo', 'ccom', 'xom', 'vom', 'cim', 'clm',
    'om', 'cm', 'ner', 'nte', 'ogr', 'orgg', 'bgg', 'bh', 'gb', 'bv', 'bt', 'vg',
  ];

  // Броят разлики между две думи. Хваща сгрешена, липсваща, излишна
  // И РАЗМЕСТЕНА буква (abv.gb -> abv.bg). Интересува ни само 0 или 1.
  const editDistance = (a: string, b: string) => {
    if (Math.abs(a.length - b.length) > 1) return 9;
    const m = a.length;
    const n = b.length;
    const dp: number[][] = [];
    for (let i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
        );
        // разместени съседни букви струват 1, а не 2
        if (
          i > 1 && j > 1 &&
          a.charAt(i - 1) === b.charAt(j - 2) &&
          a.charAt(i - 2) === b.charAt(j - 1)
        ) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
        }
      }
    }
    return dp[m][n];
  };

  // Поправя домейна САМО когато има точно един очевиден кандидат.
  //   ivan@abv.b    -> ivan@abv.bg    (незавършен)
  //   ivan@abv.     -> ivan@abv.bg
  //   ivan@gmail    -> ivan@gmail.com
  //   ivan@abv.bh   -> ivan@abv.bg    (една сгрешена буква)
  //   ivan@gmail.con-> ivan@gmail.com
  //   ivan@moja-firma.bg -> НЕ пипаме (непознат домейн, но валиден)
  const autoFixEmail = (raw: string): { email: string; changed: boolean } => {
    const email = String(raw || '').trim().toLowerCase();
    const at = email.lastIndexOf('@');
    if (at < 1 || at === email.length - 1) return { email, changed: false };

    const local = email.slice(0, at);
    const domain = email
      .slice(at + 1)
      .replace(/\.{2,}/g, '.')
      .replace(/^\.+/, '')
      .replace(/\.+$/, '');

    if (!domain) return { email, changed: false };

    const done = (d: string) => {
      const fixed = local + '@' + d;
      return { email: fixed, changed: fixed !== email };
    };

    // 1) вече е познат и правилен
    if (KNOWN_DOMAINS.indexOf(domain) !== -1) return done(domain);

    // 2) изрично известна грешка
    if (DOMAIN_TYPOS[domain]) return done(DOMAIN_TYPOS[domain]);

    // 3) недописан домейн: "abv.b" води само до "abv.bg"
    const byPrefix = KNOWN_DOMAINS.filter((d) => d.indexOf(domain) === 0);
    if (byPrefix.length === 1) return done(byPrefix[0]);

    // 4) една сгрешена буква: "abv.bh" -> "abv.bg"
    const byDistance = KNOWN_DOMAINS.filter((d) => editDistance(domain, d) <= 1);
    if (byDistance.length === 1) return done(byDistance[0]);

    // 5) непознат домейн — не гадаем
    return { email, changed: false };
  };

  // Какво да покажем под полето след като клиентът излезе от него
  const reviewEmail = (raw: string): { kind: 'fixed' | 'warn'; text: string } | null => {
    if (!String(raw || '').trim()) return null;

    const { email, changed } = autoFixEmail(raw);
    if (changed) return { kind: 'fixed', text: 'Поправихме имейла на ' + email };

    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,24}$/.test(email)) {
      return { kind: 'warn', text: 'Имейлът изглежда непълен — проверете го. Пример: ivan@abv.bg' };
    }

    const tld = (email.split('@')[1] || '').split('.').pop() || '';
    if (BAD_TLDS.indexOf(tld) !== -1) {
      return { kind: 'warn', text: 'Окончание „.' + tld + '“ не съществува — проверете имейла.' };
    }

    return null;
  };

  // ==========================================================
  // FACEBOOK — помощни
  // ==========================================================

  const buildAdvancedMatching = (email: string, phone: string, name: string) => {
    const am: Record<string, string> = {};
    if (email) am.em = email.toLowerCase().trim();
    if (phone) {
      let ph = phone.replace(/\D/g, '');
      if (ph.startsWith('0')) ph = '359' + ph.slice(1);
      am.ph = ph;
    }
    if (name) {
      const parts = name.trim().toLowerCase().split(/\s+/);
      am.fn = parts[0] || '';
      if (parts.length > 1) am.ln = parts.slice(1).join(' ');
    }
    return am;
  };

  // Чете стойностите на живо от самите полета (хваща и autofill)
  const readLiveFields = () => ({
    email: (document.getElementById('email') as HTMLInputElement)?.value || formData.email,
    phone: (document.getElementById('phone') as HTMLInputElement)?.value || formData.phone,
    name: (document.getElementById('fullName') as HTMLInputElement)?.value || formData.fullName,
  });

  const applyAdvancedMatching = () => {
    const live = readLiveFields();
    const am = buildAdvancedMatching(live.email, live.phone, live.name);
    if (Object.keys(am).length > 0 && PIXEL_ID) {
      ReactPixel.init(PIXEL_ID, am as any, { autoConfig: true, debug: false });
      return true;
    }
    return false;
  };

  // ==========================================================
  // ТРАКИНГ ПРИ ВЗАИМОДЕЙСТВИЕ С ФОРМАТА
  // ==========================================================

  const handleFocus = () => {
    if (touchedCountRef.current === 0) {
      touchedCountRef.current = 1;
      ReactPixel.track('InitiateCheckout', {
        content_name: 'Naturino Kids',
        content_type: 'product',
        value: pricePerUnit,
        currency: 'EUR',
        num_items: quantity,
      });
    }
  };

  // Приема ВЕЧЕ обновените данни, за да не чете стара стойност от state
  const handleFieldTouch = (data: { email: string; phone: string }) => {
    if (addToCartFiredRef.current) return;

    // Палим AddToCart едва когато реално има имейл ИЛИ телефон (работи и при autofill)
    const hasData = data.email.trim() !== '' || data.phone.trim() !== '';
    if (!hasData) return;

    addToCartFiredRef.current = true;

    // Малко изчакване, за да се напълнят полетата от autofill преди да четем
    setTimeout(() => {
      applyAdvancedMatching();
      ReactPixel.track('AddToCart', {
        content_name: 'Naturino Kids',
        content_type: 'product',
        value: pricePerUnit,
        currency: 'EUR',
        num_items: quantity,
      });
    }, 800);
  };

  // Едно място за обновяване на полетата — винаги с пресни стойности
  const updateField = (field: 'fullName' | 'phone' | 'email', value: string) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (field === 'email') setEmailNote(null); // бележката се показва чак при излизане от полето
    if (field === 'phone') setPhoneNote(null);
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    handleFieldTouch(next);
  };

  // ==========================================================
  // ЕФЕКТИ
  // ==========================================================

  useEffect(() => {
    ReactPixel.track('ViewContent', {
      content_name: 'Naturino Kids',
      content_type: 'product',
      value: 23.90,
      currency: 'EUR',
    });
  }, []);

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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Слушател за автоматично попълване на кода от попъпа
  useEffect(() => {
    const handleAutoDiscount = (e: Event) => {
      const customEvent = e as CustomEvent;
      const popupCode = customEvent.detail;
      if (popupCode) {
        const cleanCode = String(popupCode).trim().toUpperCase();
        setValidPopupCode(cleanCode); // Запаметяваме истинския код (напр. NAT7-YVYV)
        setFormData((prev) => ({ ...prev, promoCode: cleanCode }));
      }
    };

    window.addEventListener('NaturinoApplyDiscount', handleAutoDiscount);
    return () => window.removeEventListener('NaturinoApplyDiscount', handleAutoDiscount);
  }, []);

  // Чистим таймера за отключване на бутона, ако компонентът се маха
  useEffect(() => {
    return () => {
      if (submitLockTimerRef.current) clearTimeout(submitLockTimerRef.current);
    };
  }, []);

  // ==========================================================
  // ЛОГИКА ЗА ЦЕНАТА И ПРОМО КОДА
  // ==========================================================

  const cleanPromoInput = formData.promoCode.trim().toUpperCase();
  const isStaticPromo = cleanPromoInput === 'PROMO9307307573'; // Сравняваме с фиксирания код
  // Проверяваме дали написаното съвпада ТОЧНО с кода, дошъл от попъпа
  const isDynamicPromo = validPopupCode ? cleanPromoInput === validPopupCode : false;
  const isPromoValid = isStaticPromo || isDynamicPromo;

  const pricePerUnit = isPromoValid ? 22.23 : 23.90; // 7% отстъпка от 23.90 е 22.23
  const totalPrice = (pricePerUnit * quantity).toFixed(2);

  // ==========================================================
  // ИЗПРАЩАНЕ НА ПОРЪЧКАТА
  // ==========================================================

  const unlockSubmit = () => {
    if (submitLockTimerRef.current) {
      clearTimeout(submitLockTimerRef.current);
      submitLockTimerRef.current = null;
    }
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ЗАЩИТА: ако вече изпращаме — игнорираме второто натискане напълно
    if (isSubmittingRef.current) return;

    // Четем полетата НА ЖИВО (хваща и autofill, който не минава през onChange).
    // Тези три стойности са единственият източник на истина оттук нататък —
    // и за таблицата, и за Facebook. Така двете никога не се разминават.
    const live = readLiveFields();
    const finalName = String(live.name || '').trim();
    const finalPhone = normalizePhone(live.phone);
    const finalEmail = autoFixEmail(live.email).email;

    // 1) Непълен телефон — спираме. Без телефон поръчката не може да се потвърди.
    //    Проверява се ПЪРВО, защото полето е най-горе във формата.
    if (reviewPhone(live.phone)) {
      setPhoneNote({ text: 'Номерът е непълен' });
      document.getElementById('phone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (document.getElementById('phone') as HTMLInputElement)?.focus();
      return;
    }

    // 2) Доставката трябва да е напълно избрана (куриер + тип + град + офис/адрес)
    if (!delivery || !delivery.isComplete) {
      setDeliveryError(true);
      setTimeout(() => setDeliveryError(false), 5000);
      document.getElementById('delivery-block')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ⚠️ ИМЕЙЛЪТ НЕ СПИРА НИЩО — само се подрежда (finalEmail по-горе).

    // Заключваме бутона ВЕДНАГА (реф-ът важи в същия момент, не чака прерисуване)
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    // Аварийно отключване, ако нещо съвсем се обърка
    submitLockTimerRef.current = setTimeout(unlockSubmit, 15000);

    const currentTotal = Number(totalPrice);
    const currentQuantity = quantity;
    const eventId = 'order_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);

    const isTestOrder = finalName.toLowerCase().includes('test');

    // ----- Данни за таблицата (същите ключове и същият ред както преди) -----
    const orderData = {
      fullName: finalName,
      // Подрежда се само ако е разпознат; иначе влиза точно каквото е въведено.
      phone: finalPhone,
      email: finalEmail,
      // Стари полета — пълним ги от новия избор, за да е таблицата съвместима:
      city: delivery.cityName,
      officeAddress: delivery.fullAddress,
      notes: delivery.note,
      promoCode: formData.promoCode,
      quantity: currentQuantity,
      total: currentTotal,
      courier: delivery.courier === 'speedy' ? 'Speedy' : 'ЕКОНТ',
      currency: 'EUR',
      eventId: eventId,
      SK: 'id:9307307573',
      promoApplied: isPromoValid ? 'YES (PROMO9307307573)' : 'NO',
      // НОВИ структурирани полета (за пощ. код и точност):
      deliveryType: delivery.deliveryType === 'office' ? 'До офис' : 'До адрес',
      postCode: delivery.postCode,
      region: delivery.region,
      officeName: delivery.officeName,
      officeId: String(delivery.officeId ?? ''),
      streetName: delivery.streetName,
      streetNo: delivery.streetNo,
      isAutomat: delivery.isAutomat ? 'Да' : 'Не',
    };

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOwqXeF_u9MKXtJVkYDnTKHCDfuzZLIEs45dwAiFdcv4YJFJ6UsBeRlzsVo5GlUSUU/exec';
    const BACKUP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKKvDPfL63m5k8XdrA9gwwI6Bp93i4YZAo_8sLIO1hqCwagTBWQssymHlwkZBun9zQsg/exec';

    const payload = JSON.stringify(orderData);

    // keepalive: заявката оцелява, дори ако страницата се затвори/презареди веднага
    const sendOrder = (url: string) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payload,
        keepalive: true,
      });

    // ----- 1) ПЪРВО записваме поръчката (основен + независим бекъп) -----
    const mainSave = sendOrder(GOOGLE_SCRIPT_URL).catch((error) => {
      console.error('Background sync error:', error);
      throw error;
    });

    const backupSave = sendOrder(BACKUP_SCRIPT_URL).catch((error) => {
      console.error('Backup sync error:', error);
      throw error;
    });

    // localStorage може да хвърли (Safari частен режим, блокирани бисквитки).
    // Затова е СЛЕД изпращането и е обвит — да не може да спре поръчка.
    try {
      localStorage.setItem('naturino_buyer', 'true');
    } catch (storageError) {
      console.warn('localStorage недостъпен:', storageError);
    }

    // ----- 2) Purchase се праща СЛЕД опита за запис -----
    const firePurchase = () => {
      if (typeof window === 'undefined' || !(window as any).fbq) return;

      if (isTestOrder) {
        console.log('⚠️ Тестова поръчка засечена в Checkout! Прескачаме браузърния Facebook Pixel Event за Purchase.');
        return;
      }

      // Същите стойности, които отидоха в таблицата — без разминаване.
      try {
        const am = buildAdvancedMatching(finalEmail, finalPhone, finalName);
        if (Object.keys(am).length > 0 && PIXEL_ID) {
          ReactPixel.init(PIXEL_ID, am as any, { autoConfig: true, debug: false });
        }

        (window as any).fbq('track', 'Purchase', {
          value: currentTotal,
          currency: 'EUR',
          content_name: 'Naturino Kids',
          content_type: 'product',
          num_items: currentQuantity,
        }, { eventID: eventId });
      } catch (pixelError) {
        console.warn('Facebook Purchase грешка:', pixelError);
      }
    };

    const settled = Promise.allSettled([mainSave, backupSave]);
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));

    Promise.race([settled, timeout]).then((result) => {
      if (Array.isArray(result)) {
        const anyOk = result.some((r) => r.status === 'fulfilled');
        if (!anyOk) {
          console.error('⚠️ ВНИМАНИЕ: нито основният, нито бекъп записът бяха потвърдени!', eventId);
        }
      } else {
        console.warn('⏱️ Записът се бави — Purchase се праща без потвърждение.', eventId);
      }
      firePurchase();
    });

    // ----- 3) Отваряме Upsell веднага (не караме клиента да чака) -----
    setFlowOrder({ eventId: eventId, quantity: currentQuantity, total: currentTotal });

    // ----- 4) Чистим формата -----
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      promoCode: '',
    });
    setDelivery(null);
    setQuantity(1);
    setEmailNote(null);
    setPhoneNote(null);
    setFieldErrors({ fullName: false, phone: false, email: false });
  };

  // ==========================================================
  // ИЗГЛЕД
  // ==========================================================

  return (
    <section
      ref={sectionRef}
      id="checkout"
      className="section-padding bg-white relative"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <ShoppingCart className="w-4 h-4" />
            <span>Поръчай сега</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
            Готови ли сте да помогнете на <span className="text-emerald-600">детето си</span>?
          </h2>
          <div className="reveal opacity-0 text-base md:text-lg text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">

            <div className="mt-2 bg-gradient-to-br from-rose-50 to-white rounded-3xl border border-rose-200 p-5 shadow-lg">

              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-black text-sm mb-5">
                🎁 ДВОЕН БОНУС ЗА ВСЯКА МАЙКА
              </div>

              <div className="space-y-4">

                {/* Консултация */}
                <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
                  <h4 className="font-black text-lg text-emerald-700">
                    💬 10-минутна консултация с Пламена
                  </h4>

                  <p className="text-slate-600 mt-2 text-sm md:text-base">
                    Лични насоки и отговори на всички ваши въпроси.
                  </p>
                </div>

                {/* Facebook група */}
                <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
                  <h4 className="font-black text-lg text-[#1877F2]">
                    👩‍👩‍👧 Затворена общност за родители
                  </h4>
                  <div className="mt-3 space-y-2 text-sm font-medium text-slate-700">
                    <p>✔ Съвети и подкрепа от други майки</p>
                    <p>✔ Бързи решения при вируси и боледуване</p>
                    <p>✔ Идеи за хранене и силен имунитет</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 bg-rose-50 rounded-2xl p-4 border border-rose-100">
                <p className="text-center font-bold text-rose-600 leading-relaxed">
                  ❤️ Няма да сте сами в най-трудните моменти.
                  <br />
                  Покана в затворената група става на имейл посочен при поръчката.
                </p>
              </div>
            </div>

            {/* 3. Финалният призив за действие */}
            <p className="mt-8 text-base md:text-lg font-bold text-green-700 animate-pulse border-t border-slate-100 pt-6 transition-all duration-10000">
              Попълнете формата по-долу, за да завършите поръчката си 👇
              <span className="block">Ще се свържем с вас за потвърждение ✅</span>
            </p>

          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto min-w-0">
          {/* Order Form */}
          <div className="reveal opacity-0 min-w-0">
            <form
              onSubmit={handleSubmit}
              className="bg-amber-50/50 rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-2xl shadow-amber-900/10 relative overflow-hidden min-w-0"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-bl-full -mr-12 -mt-12"></div>

              <h3 className="text-xl md:text-2xl font-black text-amber-900 text-center mb-6 uppercase tracking-tight relative z-10">
                Детайли за доставка
              </h3>

              <div className="space-y-4 md:space-y-5 relative z-10">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    Име и Фамилия <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Име и фамилия"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    onInvalid={() => markInvalid('fullName')}
                    className={`bg-white h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm ${
                      fieldErrors.fullName ? 'border-red-400 ring-2 ring-red-200 bg-red-50/40' : 'border-amber-200'
                    }`}
                    onFocus={handleFocus}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">Моля, попълнете име и фамилия.</p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-600" />
                      Телефон <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="08хх ххх ххх"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      onBlur={(e) => {
                        // Показваме номера в стандартен вид: 0894 748 101
                        const nice = prettyPhone(e.target.value);
                        if (nice && nice !== e.target.value) {
                          setFormData((prev) => ({ ...prev, phone: nice }));
                        }
                        setPhoneNote(reviewPhone(e.target.value));
                      }}
                      onInvalid={() => markInvalid('phone')}
                      className={`bg-white h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm ${
                        fieldErrors.phone || phoneNote
                          ? 'border-red-400 ring-2 ring-red-200 bg-red-50/40'
                          : 'border-amber-200'
                      }`}
                      onFocus={handleFocus}
                    />
                    {fieldErrors.phone ? (
                      <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">Моля, попълнете телефон.</p>
                    ) : phoneNote ? (
                      <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{phoneNote.text}</p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-amber-600" />
                      Имейл <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      onInvalid={() => markInvalid('email')}
                      onBlur={(e) => {
                        // Тиха автопоправка: ivan@abv.b -> ivan@abv.bg
                        const fixed = autoFixEmail(e.target.value);
                        if (fixed.changed) {
                          setFormData((prev) => ({ ...prev, email: fixed.email }));
                        }
                        setEmailNote(reviewEmail(e.target.value));
                      }}
                      className={`bg-white h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm ${
                        fieldErrors.email
                          ? 'border-red-400 ring-2 ring-red-200 bg-red-50/40'
                          : emailNote?.kind === 'warn'
                          ? 'border-amber-400 ring-2 ring-amber-200'
                          : emailNote?.kind === 'fixed'
                          ? 'border-emerald-400 ring-2 ring-emerald-200'
                          : 'border-amber-200'
                      }`}
                      onFocus={handleFocus}
                    />
                    {fieldErrors.email ? (
                      <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">Моля, попълнете имейл.</p>
                    ) : emailNote ? (
                      <p
                        className={`text-[11px] font-bold mt-1 ml-1 leading-snug ${
                          emailNote.kind === 'fixed' ? 'text-emerald-600' : 'text-amber-700'
                        }`}
                      >
                        {emailNote.kind === 'fixed' ? '✓ ' : ''}
                        {emailNote.text}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-normal italic mt-1 ml-1 leading-tight">
                        За промоции и статус на поръчката
                      </p>
                    )}
                  </div>
                </div>

                {/* НОВ БЛОК: избор на куриер + доставка (CourierPicker) */}
                <div
                  id="delivery-block"
                  className={`min-w-0 rounded-2xl transition-all duration-300 ${
                    deliveryError ? 'ring-2 ring-red-400 ring-offset-2 bg-red-50/40 p-3 -m-0.5' : ''
                  }`}
                >
                  <CourierPicker onChange={setDelivery} />
                  {deliveryError && (
                    <p className="text-[11px] text-red-500 font-bold mt-2 ml-1 animate-bounce">
                      Моля, изберете куриер, град и офис/адрес за доставка!
                    </p>
                  )}
                </div>

                {/* QUANTITY SELECTOR */}
                <div className="flex flex-col gap-3 p-4 bg-white/60 rounded-2xl border border-amber-100 mt-2">
                  <Label className="text-amber-900 text-sm font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-600" /> Изберете количество:
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-white rounded-xl border border-amber-200 p-1 shadow-sm">
                      <button
                        type="button"
                        aria-label="Намали количеството"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-amber-50 text-amber-600 transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-black text-xl text-slate-800 w-6 text-center">{quantity}</span>
                      <button
                        type="button"
                        aria-label="Увеличи количеството"
                        disabled={quantity >= MAX_QUANTITY}
                        onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-amber-50 text-amber-600 transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Цена за брой</p>
                      <p className={`font-bold ${isPromoValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isPromoValid ? <span className="line-through text-slate-300 mr-1 text-xs">23.90</span> : null}
                        {pricePerUnit.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Summary Box */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-inner mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600 font-medium">Общо:</span>
                    <span className={`text-2xl font-black ${isPromoValid ? 'text-emerald-600' : 'text-amber-600'}`}>{totalPrice} €</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    <Check className="w-3 h-3" /> Наложен платеж (при преглед)
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-16 px-4 md:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 md:gap-3 group mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-emerald-500"
                >
                  <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />

                  <span className="flex flex-col items-center justify-center leading-tight text-center">
                    <span className="text-base md:text-xl tracking-tight">
                      {isSubmitting ? 'ИЗПРАЩАМЕ...' : 'ПОРЪЧАЙ СЕГА'}
                    </span>
                    <span className="text-xs md:text-sm font-bold opacity-95">
                      плащаш при получаване
                    </span>
                  </span>

                  <ArrowRight className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[12px] md:text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                  Преглед преди плащане • Ще ви се обадим за потвърждение
                </p>

              </div>
            </form>
          </div>

          {/* Right Side - Benefits & Product Info */}
          <div className="reveal opacity-0 space-y-4 md:space-y-6">

            {/* ⬇️ КУРИЕР ЛОГА ⬇️ */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-center gap-4 md:gap-6">
                <img src="/logo/speedy-logo.png" alt="Speedy" className="h-12 md:h-16 w-auto object-contain" />
                <img src="/logo/ekont-logo.png" alt="Еконт" className="h-11 md:h-16 w-auto object-contain" />
              </div>
            </div>
            {/* ⬆️ КРАЙ ⬆️ */}

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm">
              <h3 className="text-emerald-900 font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Защо да ни се доверите?
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Експресна доставка</p>
                    <p className="text-slate-600 text-sm">Доставяме с Еконт и Спиди в рамките на 1-2 работни дни.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Сигурност</p>
                    <p className="text-slate-600 text-sm">Плащате чак когато пратката е в ръцете ви и сте я прегледали.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0 shadow-inner">
                <Package className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Naturino Kids</h4>
                <p className="text-slate-500 text-sm italic">100% Натурален билков екстракт</p>
                <p className="text-emerald-600 font-bold text-xl mt-1">23.90 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPSELL / DOWNSELL / БЛАГОДАРЯ */}
      {flowOrder && (
        <UpsellFlow
          order={flowOrder}
          onClose={() => {
            setFlowOrder(null);
            unlockSubmit();
          }}
        />
      )}
    </section>
  );
}
