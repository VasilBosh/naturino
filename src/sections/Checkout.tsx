import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Phone, User, MapPin, Check, Truck, Shield, Mail, Package, ArrowRight } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Checkout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [courier, setCourier] = useState<'speedy' | 'econt' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    officeAddress: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const orderData = {
      ...formData,
      quantity: quantity,
      total: (19.90 * quantity).toFixed(2),
      courier: courier === 'speedy' ? 'Speedy' : 'ЕКОНТ'
    };

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyE5rJasJW7RR8X-84y82NYf3uEGgpZ377w2mIHK5pcojJPhqqluOBqfmepKxSc1mX0/exec';

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }).catch(error => console.error('Background sync error:', error));
    
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      city: '',
      officeAddress: '',
      notes: '',
    });
  };

  const totalPrice = (19.90 * quantity).toFixed(2);

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
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Попълнете формата по-долу и ние ще се свържем с вас за потвърждение
          </p>
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
                  <Label htmlFor="fullName" className="text-amber-900 text-sm font-bold mb-1.5 block flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    Вашите три имена <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Име и фамилия"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-all shadow-sm"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-amber-900 text-sm font-bold mb-1.5 block flex items-center gap-1.5">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-amber-900 text-sm font-bold mb-1.5 block flex items-center gap-1.5">
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
                    />
                  </div>
                </div>

                {/* Courier Selection */}
                <div>
                  <Label className="text-amber-900 text-sm font-bold mb-3 block flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Изберете куриер <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCourier('speedy')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        courier === 'speedy'
                          ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/20'
                          : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
                      }`}
                    >
                      <span className="text-2xl">🚚</span>
                      <span className={`font-bold text-sm ${courier === 'speedy' ? 'text-amber-900' : ''}`}>Speedy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourier('econt')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        courier === 'econt'
                          ? 'border-amber-500 bg-white shadow-lg shadow-amber-200 ring-2 ring-amber-500/20'
                          : 'border-amber-100 hover:border-amber-300 bg-white/60 text-slate-500'
                      }`}
                    >
                      <span className="text-2xl">📦</span>
                      <span className={`font-bold text-sm ${courier === 'econt' ? 'text-amber-900' : ''}`}>ЕКОНТ</span>
                    </button>
                  </div>
                </div>

                {/* City & Office Address */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="city" className="text-amber-900 text-sm font-bold mb-1.5 block flex items-center gap-1.5">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="officeAddress" className="text-amber-900 text-sm font-bold mb-1.5 block flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Адрес на офис <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="officeAddress"
                      type="text"
                      required
                      placeholder={courier ? `Име на офис на ${courier === 'speedy' ? 'Speedy' : 'Еконт'}` : 'Първо изберете куриер'}
                      value={formData.officeAddress}
                      onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                      disabled={!courier}
                      className="bg-white border-amber-200 h-12 text-base rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Total Summary Box */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-inner mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600 font-medium">Общо за плащане:</span>
                    <span className="text-2xl font-black text-amber-600">{totalPrice} €</span>
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
                  ПОТВЪРДИ  ПОРЪЧКАТА
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Benefits & Product Card */}
          <div className="reveal opacity-0 space-y-4 md:space-y-6">
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

            {/* КОРИГИРАНА КАРТА НА ПРОДУКТА (БЕЗ СЧУПЕНА ИКОНКА) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0 shadow-inner">
                   <Package className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Naturino Kids</h4>
                  <p className="text-emerald-600 font-bold text-xl">19.90€</p>
                  <div className="flex items-center gap-3 mt-3">
                     <button 
                       type="button" 
                       onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                       className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-emerald-300 transition-colors"
                     >
                       -
                     </button>
                     <span className="font-bold w-4 text-center">{quantity}</span>
                     <button 
                       type="button" 
                       onClick={() => setQuantity(quantity + 1)} 
                       className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-emerald-300 transition-colors"
                     >
                       +
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SUCCESS POP-UP --- */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={() => setSubmitted(false)}>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl relative animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-4">Успешна поръчка!</h3>
            <p className="text-slate-600 text-center mb-8 text-lg leading-relaxed">Благодарим ви за доверието! Очаквайте обаждане от наш консултант много скоро.</p>
            <button onClick={() => setSubmitted(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">ЗАТВОРИ</button>
          </div>
        </div>
      )}
    </section>
  );
}

function RotateCcw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}