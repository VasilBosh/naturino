import { useState, useEffect, useRef } from 'react';
import { Truck, Check, Sparkles, ShieldCheck, Zap, Heart, Leaf } from 'lucide-react';

/**
 * UpsellFlow — попъп потокът след записана поръчка: Upsell → Downsell → Благодаря.
 *
 * ВАЖНО (сигурност, запазено 1:1 спрямо старата логика):
 * - Този компонент НЕ записва нова поръчка. Поръчката вече е записана от Checkout при "ПОРЪЧАЙ".
 * - При "Да" праща ОБНОВЯВАЩА заявка със същото eventId (action: 'upsell' | 'downsell'),
 *   за да може Apps Script да намери СЪЩИЯ ред и да обнови брой/сума + маркер в бележки.
 * - Използва същия SK ключ и същия URL като Checkout.
 * - Гарантира ЕДНА финализираща заявка (sentRef) и авто-финализация след 60 сек.
 *
 * НОВО: офертата е ДИНАМИЧНА според order.quantity (детския брой в базовата поръчка):
 *   1 → +2 Kids за 40,90 € | 2 → +2 Kids за 39,00 € | 3 → +1 Kids за 19,90 € | 4 → +2 Adults за 40,90 €
 *   Downsell (универсален при отказ): +1 Adults за 20,90 € (вместо 24,90 €), без безплатна доставка.
 *
 * НОВО поле в payload: `addon` (описателен маркер, напр. "+2 Kids", "+2 Adults", "+1 Adults (downsell)").
 *   Базовите полета остават същите (SK, action, eventId, quantity, total) — `addon` е допълнение,
 *   за да може Apps Script/Tradefy еднозначно да различи детски от възрастен продукт.
 *
 * Продуктови снимки: public/upsell/kids-3pack.png и public/upsell/adult.png (1:1, ~800×800px).
 * Ако липсват — показва се резервен вид, нищо не се чупи.
 */

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzOwqXeF_u9MKXtJVkYDnTKHCDfuzZLIEs45dwAiFdcv4YJFJ6UsBeRlzsVo5GlUSUU/exec';

const BACKUP_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzKKvDPfL63m5k8XdrA9gwwI6Bp93i4YZAo_8sLIO1hqCwagTBWQssymHlwkZBun9zQsg/exec';

const eur = (n: number) => n.toFixed(2).replace('.', ',') + ' €';

type UpsellCfg = {
  kind: 'kids' | 'adults';
  addQty: number;
  addPrice: number;
  wasPrice: number;
  img: string;
  emoji: string;
  badge: string;
  addonLabel: string;
  tag: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  result: string;
  bullets: { icon: any; t: string }[];
};

// Динамични upsell оферти по детски брой на базовата поръчка
const UPSELL_BY_QTY: Record<number, UpsellCfg> = {
  1: {
    kind: 'kids', addQty: 2, addPrice: 40.9, wasPrice: 47.8, img: '/upsell/kids-3pack.png', emoji: '🧴', badge: '×2',
    addonLabel: '+2 Kids', tag: '🧒 Naturino Kids · за деца 18м+',
    title: <>Изчакай! Добави още <span className="text-rose-600">2 детски опаковки</span></>,
    lead: <>И вземи <b className="text-amber-600">БЕЗПЛАТНА</b> доставка за цялата поръчка!</>,
    result: '3 опаковки Naturino Kids',
    bullets: [
      { icon: ShieldCheck, t: '3 опаковки = 2 месеца защита без прекъсване' },
      { icon: Heart, t: 'Никога не оставаш без наличност в разгара на боледуванията' },
      { icon: Truck, t: 'Безплатна доставка за цялата поръчка' },
    ],
  },
  2: {
    kind: 'kids', addQty: 2, addPrice: 39.0, wasPrice: 47.8, img: '/upsell/kids-3pack.png', emoji: '🧴', badge: '×2',
    addonLabel: '+2 Kids', tag: '🧒 Naturino Kids · за деца 18м+',
    title: <>Изчакай! Добави още <span className="text-rose-600">2 детски опаковки</span></>,
    lead: <>И вземи <b className="text-amber-600">БЕЗПЛАТНА</b> доставка за цялата поръчка!</>,
    result: '4 опаковки Naturino Kids',
    bullets: [
      { icon: ShieldCheck, t: '4 опаковки = пълно спокойствие за детето' },
      { icon: Zap, t: 'Най-ниска цена на опаковка' },
      { icon: Truck, t: 'Безплатна доставка за цялата поръчка' },
    ],
  },
  3: {
    kind: 'kids', addQty: 1, addPrice: 19.9, wasPrice: 23.9, img: '/upsell/kids-1pack.png', emoji: '🧴', badge: '+1',
    addonLabel: '+1 Kids', tag: '🧒 Naturino Kids · за деца 18м+',
    title: <>Изчакай! Добави още <span className="text-rose-600">1 детска опаковка</span></>,
    lead: <>И вземи <b className="text-amber-600">БЕЗПЛАТНА</b> доставка за цялата поръчка!</>,
    result: '4 опаковки Naturino Kids',
    bullets: [
      { icon: ShieldCheck, t: 'Вземи още една опаковка за плътно спокойствие' },
      { icon: Zap, t: 'Само +19,90 € за цяла опаковка' },
      { icon: Truck, t: 'Безплатна доставка за цялата поръчка' },
    ],
  },
  4: {
    kind: 'adults', addQty: 2, addPrice: 40.9, wasPrice: 49.8, img: '/upsell/adult2.png', emoji: '🌿', badge: '×2',
    addonLabel: '+2 Adults', tag: '🧑 Naturino · за възрастни 12+',
    title: <>Възползвайте се само сега на <span className="text-rose-600">невероятното намаление</span> на Naturino за възрастни!</>,
    lead: <>Надградена формула с 13 билки + <b className="text-amber-600">БЕЗПЛАТНА</b> доставка за цялата поръчка.</>,
    result: '4 детски + 2 опаковки за възрастни',
    bullets: [
      { icon: Sparkles, t: 'Надградена формула: 13 билки и плодове' },
      { icon: Zap, t: 'Адаптогени Рейши, Шийтаке и Астрагал' },
      { icon: Truck, t: 'Безплатна доставка за цялата поръчка' },
    ],
  },
};

const DOWNSELL = {
  addPrice: 20.9, wasPrice: 24.9, img: '/upsell/adult.png', emoji: '🌿', badge: '+1', addonLabel: '+1 Adults (downsell)',
  tag: '🧑 Naturino · за възрастни 12+',
  bullets: [
    { icon: ShieldCheck, t: 'Силен имунитет и за възрастните вкъщи' },
    { icon: Zap, t: 'Специална цена само сега — вместо 24,90 €' },
    { icon: Truck, t: 'Добавя се към същата пратка, без нова доставка' },
  ],
};

const KEYFRAMES = `
@keyframes uf_sheetIn { from { transform: translateY(24px); opacity:0 } to { transform: translateY(0); opacity:1 } }
.uf-sheet-in { animation: uf_sheetIn .45s cubic-bezier(.16,1,.3,1) both }
@keyframes uf_stampIn { 0%{ transform:rotate(-14deg) scale(1.6); opacity:0 } 60%{ opacity:1 } 100%{ transform:rotate(-8deg) scale(1); opacity:1 } }
.uf-stamp { animation: uf_stampIn .6s .2s cubic-bezier(.16,1,.3,1) both }
@keyframes uf_shimmer { 0%{ transform:translateX(-120%) } 100%{ transform:translateX(220%) } }
.uf-shimmer::after { content:""; position:absolute; top:0; bottom:0; width:40%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
  transform:translateX(-120%); animation:uf_shimmer 2.4s .8s infinite }
@keyframes uf_floaty { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-6px) } }
.uf-floaty { animation: uf_floaty 3.2s ease-in-out infinite }
@keyframes uf_pop { 0%{ transform:scale(.6); opacity:0 } 100%{ transform:scale(1); opacity:1 } }
.uf-pop { animation: uf_pop .4s cubic-bezier(.16,1,.3,1) both }
@keyframes uf_conf { to { transform:translateY(120px) rotate(360deg); opacity:0 } }
`;

/* ---------- Продуктов визуал със сигурен fallback ---------- */
function ProductShot({ src, emoji, badge, tone, freeShipping = true }: {
  src: string; emoji: string; badge?: string; tone: string; freeShipping?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48">
      <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-60" style={{ background: tone }} />
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 flex items-center justify-center">
        {!failed && src ? (
          <img src={src} alt="" onError={() => setFailed(true)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl" style={{ background: tone }}>
            <span className="drop-shadow-lg">{emoji}</span>
          </div>
        )}
      </div>
      {badge && (
        <div className="absolute -top-3 -right-3 bg-white rounded-2xl px-3 py-1.5 shadow-xl ring-1 ring-black/5">
          <span className="font-black text-lg bg-gradient-to-br from-rose-600 to-amber-500 bg-clip-text text-transparent">
            {badge}
          </span>
        </div>
      )}
      {freeShipping && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 uf-stamp">
          <div className="flex items-center gap-1.5 bg-amber-400 text-[#2b1a00] font-black text-[11px] uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg ring-2 ring-white">
            <Truck className="w-3.5 h-3.5" />
            Безплатна доставка
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Обвивка на модал (bottom-sheet на моб, център на десктоп) ---------- */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="absolute inset-0 bg-[#1b0d1a]/70 backdrop-blur-md" />
      <div className="relative flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="w-full sm:max-w-md uf-sheet-in max-h-[92vh] sm:max-h-[94vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export type OrderSnapshot = { eventId: string; quantity: number; total: number };

export function UpsellFlow({ order, onClose }: { order: OrderSnapshot; onClose: () => void }) {
  // Конфигурацията на upsell според детския брой (fallback към пакет 1, ако е извън 1–4)
  const U = UPSELL_BY_QTY[order.quantity] ?? UPSELL_BY_QTY[1];

  const [step, setStep] = useState<'upsell' | 'downsell' | 'thankyou'>('upsell');
  const [path, setPath] = useState<'upsell' | 'downsell' | 'none'>('none');

  // Гарантира, че към сървъра тръгва САМО ЕДНА финализираща заявка (един имейл).
  const sentRef = useRef(false);

  // Праща обновяване/финализиране със ФИНАЛНИ стойности. quantity = брой ДЕТСКИ опаковки.
  // 'complete' = клиентът отказа/не реагира → тръгва базовият имейл, редовете НЕ се пипат.
  const sendUpdate = (action: 'upsell' | 'downsell' | 'complete', quantity: number, total: number, addon: string) => {
    if (sentRef.current) return; // вече е изпратено веднъж — не дублираме
    sentRef.current = true;
    const payload = {
      SK: 'id:9307307573',
      action,
      eventId: order.eventId,
      quantity,
      total: Number(total.toFixed(2)),
      addon, // НОВ описателен маркер за детски/възрастен продукт
    };
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch((error) => console.error('Upsell sync error:', error));

    // Бекъп запис (независим — само обновява реда в бекъпа, без имейли/Tradefy)
    fetch(BACKUP_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch((error) => console.error('Upsell backup sync error:', error));
  };

  const acceptUpsell = () => {
    // При детски upsell: детският брой расте с addQty.
    // При upsell за възрастни (пакет 4): детският брой НЕ се променя — възрастният се
    // разпознава от addon/SKU в Tradefy. Обновяваме само сумата.
    const kidsQty = U.kind === 'kids' ? order.quantity + U.addQty : order.quantity;
    sendUpdate('upsell', kidsQty, order.total + U.addPrice, U.addonLabel);
    setPath('upsell');
    setStep('thankyou');
  };

  const acceptDownsell = () => {
    // Downsell: +1 продукт за ВЪЗРАСТНИ. Детският брой НЕ се променя, обновяваме само сумата.
    sendUpdate('downsell', order.quantity, order.total + DOWNSELL.addPrice, DOWNSELL.addonLabel);
    setPath('downsell');
    setStep('thankyou');
  };

  const declineAll = () => {
    // Отказ / липса на реакция → финализираме базовата поръчка (тръгва базовият имейл)
    sendUpdate('complete', order.quantity, order.total, '');
    setPath('none');
    setStep('thankyou');
  };

  // ЗАЩИТА СРЕЩУ ЗАГУБЕН ИМЕЙЛ: ако клиентът стигне до Upsell/Downsell и не натисне нищо
  // в рамките на 60 сек → автоматично се финализира (базов имейл към клиента и админа).
  useEffect(() => {
    if (step !== 'upsell' && step !== 'downsell') return;
    const timer = setTimeout(() => {
      declineAll();
    }, 60000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ---------- UPSELL (динамичен според пакета) ---------- */}
      {step === 'upsell' && (
        <Modal>
          <div className="bg-gradient-to-b from-[#fff1f5] to-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="relative bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-center py-2.5 px-4 overflow-hidden">
              <span className="relative z-10 inline-flex items-center gap-1.5 font-black text-[13px] uppercase tracking-wide">
                <Zap className="w-4 h-4" /> Само сега на тази цена
              </span>
            </div>

            <div className="px-5 sm:px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-7">
              <div className="mx-auto mb-3 flex items-center justify-center gap-1.5 bg-rose-100 text-rose-700 rounded-full px-3.5 py-1 w-max max-w-full">
                <span className="font-black text-[11px] sm:text-[12px] uppercase tracking-wide text-center">{U.tag}</span>
              </div>

              <h2 className="text-center text-[22px] sm:text-[26px] leading-tight font-black text-[#231018]">
                {U.title}
              </h2>
              <p className="text-center text-slate-500 text-[13px] sm:text-sm mt-1.5 mb-6">
                {U.lead}
              </p>

              <div className="uf-floaty">
                <ProductShot
                  src={U.img}
                  emoji={U.emoji}
                  badge={U.badge}
                  tone="linear-gradient(135deg,#fecdd3,#fed7aa)"
                />
              </div>

              <div className="mt-8 sm:mt-9 flex items-end justify-center gap-3">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Само +</p>
                  <p className="text-[42px] sm:text-5xl font-black text-[#231018] leading-none">{eur(U.addPrice)}</p>
                </div>
                <div className="pb-1.5">
                  <span className="line-through text-slate-400 font-bold">{eur(U.wasPrice)}</span>
                  <span className="block mt-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    + безплатна доставка
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {U.bullets.map(({ icon: Icon, t }, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-3 ring-1 ring-rose-100">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-[13.5px] text-slate-700 font-medium leading-snug pt-1">{t}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={acceptUpsell}
                className="uf-shimmer relative overflow-hidden w-full mt-5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/30 transition active:scale-[.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span className="flex flex-col items-center leading-tight text-center">
                  <span className="text-[16px] sm:text-lg">Да, искам я! Добави я към поръчката</span>
                  <span className="text-[12px] font-bold opacity-90">+ безплатна доставка за цялата поръчка</span>
                </span>
              </button>

              <button
                onClick={() => setStep('downsell')}
                className="w-full mt-3 py-2 rounded-2xl border border-slate-300 text-slate-400 hover:text-slate-600 text-sm font-semibold transition"
              >
                Не сега — продължи без офертата
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------- DOWNSELL (универсален, различаващ се от upsell-а) ---------- */}
      {step === 'downsell' && (
        <Modal>
          <div className="bg-gradient-to-b from-[#eefaf3] to-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-center py-2.5 px-4">
              <span className="inline-flex items-center gap-1.5 font-black text-[13px] uppercase tracking-wide">
                <Heart className="w-4 h-4" /> Специално и за вас
              </span>
            </div>

            <div className="px-5 sm:px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-7">
              <div className="mx-auto mb-3 flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-700 rounded-full px-3.5 py-1 w-max max-w-full">
                <span className="font-black text-[11px] sm:text-[12px] uppercase tracking-wide text-center">{DOWNSELL.tag}</span>
              </div>

              <h2 className="text-center text-[21px] sm:text-[25px] leading-tight font-black text-[#0f2a20]">
                Вземи <span className="text-emerald-600">един брой</span> за възрастни и се убеди в силата на надградената формула.
              </h2>
              <p className="text-center text-slate-500 text-[13px] sm:text-sm mt-2 mb-5">
                Само 1 опаковка на <b className="text-emerald-700">специална цена</b> — само сега.
              </p>

              <div className="uf-floaty">
                <ProductShot src={DOWNSELL.img} emoji={DOWNSELL.emoji} badge={DOWNSELL.badge} tone="linear-gradient(135deg,#a7f3d0,#99f6e4)" freeShipping={false} />
              </div>

              <div className="mt-8 sm:mt-9 text-center flex items-end justify-center gap-3">
                <div className="text-center">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Само +</p>
                  <p className="text-[42px] sm:text-5xl font-black text-[#0f2a20] leading-none">{eur(DOWNSELL.addPrice)}</p>
                </div>
                <span className="line-through text-slate-400 font-bold pb-1.5">{eur(DOWNSELL.wasPrice)}</span>
              </div>

              <div className="mt-6 space-y-2.5">
                {DOWNSELL.bullets.map(({ icon: Icon, t }, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-3 ring-1 ring-emerald-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[13.5px] text-slate-700 font-medium leading-snug pt-1">{t}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={acceptDownsell}
                className="uf-shimmer relative overflow-hidden w-full mt-5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/30 transition active:scale-[.98] flex flex-col items-center justify-center leading-tight gap-0.5"
              >
                <span className="inline-flex items-center gap-2 text-[16px] sm:text-lg"><Leaf className="w-5 h-5" /> Да! Искам да я пробвам</span>
                <span className="text-[12px] font-bold opacity-90">на специална цена — само сега</span>
              </button>

              <button
                onClick={declineAll}
                className="w-full mt-3 py-2 rounded-2xl border border-slate-300 text-slate-400 hover:text-slate-600 text-sm font-semibold transition"
              >
                Не сега — завърши поръчката
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------- БЛАГОДАРЯ ---------- */}
      {step === 'thankyou' && (
        <Modal>
          <div className="relative bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl px-6 sm:px-8 pt-11 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:pb-12 text-center">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="absolute top-0 w-2 h-3 rounded-sm"
                style={{
                  left: `${(i * 7 + 5) % 100}%`,
                  background: ['#e11d64', '#f59e0b', '#10b981', '#8b5cf6'][i % 4],
                  animation: `uf_conf ${1.4 + (i % 5) * 0.25}s ${i * 0.06}s ease-in forwards`,
                }}
              />
            ))}
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 uf-pop">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Успешна поръчка!</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              {path === 'upsell' && `Поръчката ти вече е ${U.result}, с безплатна доставка. `}
              {path === 'downsell' && 'Добавихме и опаковка Naturino за възрастни към пратката ти. '}
              Очаквайте обаждане за потвърждение на поръчката съвсем скоро.
            </p>
            <button
              onClick={onClose}
              className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
            >
              Затвори
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
