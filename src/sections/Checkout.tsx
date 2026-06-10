/* import ReactPixel from 'react-facebook-pixel'; */
import { useEffect, useRef, useState} from 'react';
import { ShoppingCart, Phone, User, MapPin, Check, Truck, Shield, Mail, Package, ArrowRight, RotateCcw, Minus, Plus, Ticket } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Checkout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [courier, setCourier] = useState<'speedy' | 'econt'>('speedy');
  const [courierError, setCourierError] = useState(false); // НОВО: за визуалната грешка
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    officeAddress: '',
    notes: '',
    promoCode: '', // НОВО
  });
  const [submitted, setSubmitted] = useState(false);
  const [addToCartFired, setAddToCartFired] = useState(false);
  const [              , setTouchedFields] = useState(0);

  const handleFieldTouch = () => {
  if (addToCartFired) return;
  
  setTouchedFields(prev => {
    const newCount = prev + 1;

    if (newCount === 1) {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: 'Naturino Kids',
          content_type: 'product',
          value: pricePerUnit,
          currency: 'EUR',
          num_items: quantity,
        });
      }
    }

    if (newCount === 2) {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', {
          content_name: 'Naturino Kids',
          content_type: 'product',
          value: pricePerUnit,
          currency: 'EUR',
          num_items: quantity,
        });
      }
      setAddToCartFired(true);
    }

    return newCount;
  });
};


  useEffect(() => {
  const tryFireViewContent = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Naturino Kids',
        content_type: 'product',
        value: 19.90,
        currency: 'EUR',
      });
    } else {
      // fbq още не е готов, опитай след 500ms
      setTimeout(tryFireViewContent, 500);
    }
  };

  tryFireViewContent();
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

  // Слушател за автоматично попълване на кода от попъпа - ново добавено
  const [validPopupCode, setValidPopupCode] = useState<string | null>(null);

  useEffect(() => {
    const handleAutoDiscount = (e: Event) => {
      const customEvent = e as CustomEvent;
      const popupCode = customEvent.detail;
      if (popupCode) {
        const cleanCode = popupCode.trim().toUpperCase();
        setValidPopupCode(cleanCode); // Запаметяваме истинския код (напр. NAT7-YVYV)
        setFormData((prev) => ({ ...prev, promoCode: cleanCode }));
      }
    };

    window.addEventListener('NaturinoApplyDiscount', handleAutoDiscount);
    return () => window.removeEventListener('NaturinoApplyDiscount', handleAutoDiscount);
  }, []);

  // ЛОГИКА ЗА ЦЕНАТА И ПРОМО КОДА
  //const isPromoValid = formData.promoCode.trim().toUpperCase() === 'PROMO9307307573'; // Сравняваме с фиксирания код

  const cleanPromoInput = formData.promoCode.trim().toUpperCase();
  const isStaticPromo = cleanPromoInput === 'PROMO9307307573'; // Сравняваме с фиксирания код
  // Проверяваме дали написаното съвпада ТОЧНО с кода, дошъл от попъпа
  const isDynamicPromo = validPopupCode ? cleanPromoInput === validPopupCode : false;
  const isPromoValid = isStaticPromo || isDynamicPromo;


  const pricePerUnit = isPromoValid ? 18.50 : 19.90; // 7% отстъпка от 19.90 е 18.50
  const totalPrice = (pricePerUnit * quantity).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка за избран куриер с визуален ефект вместо alert
    if (!courier) {
      setCourierError(true);
      setTimeout(() => setCourierError(false), 5000); // Изключва ефекта след 5 сек
      return;
    }

    const currentTotal = Number(totalPrice);
    const eventId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Оптимизиран Тракинг с филтър за тестови поръчки
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const isTestOrder = formData.fullName.toLowerCase().includes('test');
    
    if (isTestOrder) {
      console.log('⚠️ Тестова поръчка засечена в Checkout! Прескачаме браузърния Facebook Pixel Event за Purchase.');
    } else {
    // Пращаме Advanced Matching данни при Purchase за по-добро разпознаване
    (window as any).fbq('track', 'Purchase', {
      value: currentTotal,
      currency: 'EUR', 
      content_name: 'Naturino Kids',
      content_type: 'product',
      num_items: quantity,
      // Добавяме хеширани данни за по-висока точност (Match Quality)
      external_id: eventId,
      em: formData.email ? formData.email.toLowerCase().trim() : '',
      ph: formData.phone.replace(/\s+/g, ''),
      fn: formData.fullName.split(' ')[0].toLowerCase().trim(),
      ln: formData.fullName.split(' ').slice(1).join(' ').toLowerCase().trim()
    }, { eventID: eventId });
  }
}

    setSubmitted(true);

    localStorage.setItem('naturino_buyer', 'true');
    const orderData = {
      ...formData,
      phone: formData.phone.replace(/\s+/g, ''), // Почистваме телефона за скрипта
      quantity: quantity,
      total: currentTotal,
      courier: courier === 'speedy' ? 'Speedy' : (courier === 'econt' ? 'ЕКОНТ' : 'Неизбран'),
      currency: 'EUR',
      eventId: eventId, 
      SK: 'id:9307307573',
      promoApplied: isPromoValid ? 'YES (PROMO9307307573)' : 'NO'
    };

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOwqXeF_u9MKXtJVkYDnTKHCDfuzZLIEs45dwAiFdcv4YJFJ6UsBeRlzsVo5GlUSUU/exec';

    // КОРИГИРАН FETCH (премахнато no-cors)
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(orderData),
    }).catch(error => console.error('Background sync error:', error));
    
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      city: '',
      officeAddress: '',
      notes: '',
      promoCode: '',
    });
    setCourier('speedy'); // Нулиране на куриера след успешна поръчка
  };

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
                  При потвърждение на поръчката ще ви попитаме дали желаете да ви добавим напълно безплатно.
                </p>
              </div>
            </div>

            {/* 3. Финалният призив за действие - плавно и нежно пулсиращ в розов цвят */}
            <p className="mt-8 text-base md:text-lg font-bold text-green-700 animate-pulse border-t border-slate-100 pt-6 transition-all duration-10000">
              Попълнете формата по-долу, за да завършите поръчката си 👇<div>Ще се свържем с вас за потвърждение ✅</div>
            </p>

          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Order Form */}
          <div className="reveal opacity-0">
            <form 
              onSubmit={handleSubmit} 
              className="bg-amber-50/50 rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-2xl shadow-amber-900/10 relative overflow-hidden"
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
                    placeholder="Име и фамилия"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm"
                    onFocus={handleFieldTouch}
                  />
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
                      placeholder="08xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFieldTouch}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      
                      <Mail className="w-4 h-4 text-amber-600" />
                         Имейл
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFieldTouch}
                    />
                    {/* Текстът отива ТУК – под полето */}
                    <p className="text-[11px] text-slate-400 font-normal italic mt-1 ml-1 leading-tight">
                        За промоции и статус на поръчката
                    </p>
                  </div>
                </div>

                {/* Courier Selection */}
                <div>
                  <Label className="text-amber-900 text-sm font-bold mb-3 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Изберете куриер <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setCourier('speedy'); setCourierError(false); }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        courier === 'speedy'
                          ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/20'
                          : courierError 
                            ? 'border-red-500 bg-red-50 animate-pulse' 
                            : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
                      }`}
                    >
                      <span className="text-2xl">🚚</span>
                      <span className={`font-bold text-sm ${courier === 'speedy' ? 'text-amber-900' : ''}`}>Speedy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCourier('econt'); setCourierError(false); }}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        courier === 'econt'
                          ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/20'
                          : courierError 
                            ? 'border-red-500 bg-red-50 animate-pulse' 
                            : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
                      }`}
                    >
                      <span className="text-2xl">📦</span>
                      <span className={`font-bold text-sm ${courier === 'econt' ? 'text-amber-900' : ''}`}>ЕКОНТ</span>
                    </button>
                  </div>
                  {courierError && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-bounce">Моля, изберете куриер!</p>}
                </div>

                {/* City & Delivery Address */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="city" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Град <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      required
                      placeholder="Вашият град"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFieldTouch}
                    />
                  </div>
                  <div>
                    <Label htmlFor="officeAddress" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Адрес за доставка<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="officeAddress"
                      type="text"
                      required
                      placeholder={courier ? `Личен адрес или офис на ${courier === 'speedy' ? 'Speedy' : 'Еконт'}` : 'Личен адрес или офис на куриер'}
                      value={formData.officeAddress}
                      onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm"
                      onFocus={handleFieldTouch}
                    />
                  </div>
                </div>

                {/* NEW: Promo Code Field */}
                <div>
                  <Label htmlFor="promoCode" className="text-amber-900 text-sm font-bold mb-1.5 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4 text-amber-600" />
                    Промо код
                  </Label>
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder="Имате ли код за отстъпка?"
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                    className={`h-12 text-base rounded-xl transition-all shadow-sm ${isPromoValid ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-amber-200'}`}
                    onFocus={handleFieldTouch}
                  />
                  {isPromoValid && <p className="text-xs text-emerald-600 font-bold mt-1 ml-1">✓ Приложена отстъпка -7%!</p>}
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
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-amber-50 text-amber-600 transition-colors active:scale-95"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-black text-xl text-slate-800 w-6 text-center">{quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-amber-50 text-amber-600 transition-colors active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Цена за брой</p>
                        <p className={`font-bold ${isPromoValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {isPromoValid ? <span className="line-through text-slate-300 mr-1 text-xs">19.90</span> : null}
                          {pricePerUnit} €
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
                  className="w-full h-16 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group mt-4"
                >
                  <ShoppingCart className="w-8 h-8" />
                  ПОТВЪРДИ ПОРЪЧКАТА
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Benefits & Product Info */}
          <div className="reveal opacity-0 space-y-4 md:space-y-6">
            
            {/* ⬇️ НОВ КОД — КУРИЕР ЛОГА ⬇️ */}
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
                <p className="text-emerald-600 font-bold text-xl mt-1">19.90 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS POP-UP */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setSubmitted(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-4">Успешна поръчка!</h3>
            <p className="text-slate-600 text-center mb-8 text-lg leading-relaxed">Благодарим ви за доверието! Очаквайте обаждане от наш консултант много скоро.</p>
            <button onClick={() => setSubmitted(false)} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">ЗАТВОРИ</button>
          </div>
        </div>
      )}
    </section>
  );
}