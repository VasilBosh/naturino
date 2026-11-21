import { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, Clock, Gift } from 'lucide-react';
import { upsellFor, hasFreeShipping, DOWNSELL_PRICE } from '../utils/pricing';

/**
 * UpsellFlow — попъп потокът след записана поръчка: Upsell → Downsell → Благодаря.
 *
 * ВАЖНО (сигурност):
 * - Този компонент НЕ записва нова поръчка. Поръчката вече е записана от Checkout при "ПОРЪЧАЙ".
 * - При "Да" праща ОБНОВЯВАЩА заявка със същото eventId (action: 'upsell' | 'downsell'),
 *   за да може Apps Script да намери СЪЩИЯ ред и да обнови брой/сума + маркер в бележки.
 * - Използва същия SK ключ и същия URL като Checkout.
 *
 * 🚚 НОВО: доставката (order.shippingFee) е САМО за показване — „спестявате X €“ и
 *   „общо за плащане“. Към скрипта НЕ се праща и в таблицата НЕ се записва.
 *
 * Продуктови снимки: public/upsell/kids-3pack.webp и public/upsell/adult.webp
 * Ако липсват — показва се резервен вид, нищо не се чупи.
 */

// Същият endpoint като в Checkout (fire-and-forget, отговорът не се чете)
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzOwqXeF_u9MKXtJVkYDnTKHCDfuzZLIEs45dwAiFdcv4YJFJ6UsBeRlzsVo5GlUSUU/exec';

const BACKUP_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzKKvDPfL63m5k8XdrA9gwwI6Bp93i4YZAo_8sLIO1hqCwagTBWQssymHlwkZBun9zQsg/exec';

// 📦 НОВО: upsell-ът се нагажда към поръчката и винаги води ЕДНО НИВО НАГОРЕ (виж utils/pricing.ts):
//   1 бр. → +2 = пакет 3 (+44,90)   2 бр. → +2 = пакет 4 (+41,00)   3 бр. → +1 = пакет 4 (+18,10)
//   4+ бр. → няма upsell → показва се направо downsell-ът
const UPSELL_EMOJI = '🧴';
// 📸 Снимката показва ТОЧНО толкова шишенца, колкото се ДОБАВЯТ (офертата, а не целия пакет)
const UPSELL_IMG: Record<number, string> = { 1: '/images/product-main.webp', 2: '/upsell/kids-3pack.webp' };
// ⏱️ ТАЙМЕР НА ОФЕРТАТА — колко секунди е видима всяка оферта (upsell и downsell).
// Когато изтече, офертата НАИСТИНА изчезва: от upsell → downsell, от downsell → „Благодарим ви“.
const OFFER_SECONDS = 120;        // 2 минути
// От колко секунди нататък броячът става червен и мига
const OFFER_URGENT_SECONDS = 60;  // последната минута
// Възрастният е на редовна цена 24,90 → при даунсела се печели САМО безплатната доставка
// (ако поръчката вече е с безплатна доставка — просто се добавя в същата пратка)
const DOWNSELL = { addQty: 1, addPrice: DOWNSELL_PRICE, img: '/upsell/adult.webp', emoji: '🌿' };

const round2 = (n: number) => Math.round(n * 100) / 100;
const eur = (n: number) => round2(n).toFixed(2).replace('.', ',') + ' €';

export type OrderSnapshot = {
  eventId: string;
  quantity: number;
  total: number;
  // НОВО: пълните данни на поръчката (име, телефон, адрес...). Изпращат се заедно с
  // ъпсел/финализиращата заявка, за да може скриптът да ВЪЗСТАНОВИ поръчката,
  // ако първоначалният запис не е стигнал до таблицата.
  base?: Record<string, unknown>;
  // 🚚 НОВО: цена и текст на доставката — САМО за показване
  shippingFee?: number;
  shippingLabel?: string;
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

/* ---------- Снимка на офертата (компактна, със сигурен fallback) ---------- */
function OfferShot({ src, emoji, badge, contain = false }: { src: string; emoji: string; badge: string; contain?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative w-[104px] h-[104px] sm:w-32 sm:h-32 flex-shrink-0 uf-floaty">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-200 to-rose-200 blur-xl opacity-70" />
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-black/5 flex items-center justify-center">
        {!failed && src ? (
          <img src={src} alt="" onError={() => setFailed(true)} className={`w-full h-full ${contain ? 'object-contain p-1.5' : 'object-cover'}`} />
        ) : (
          <span className="text-5xl">{emoji}</span>
        )}
      </div>
      <div className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-black text-sm shadow-lg ring-2 ring-white">
        {badge}
      </div>
    </div>
  );
}

/* ---------- Горна лента: поръчката Е ПРИЕТА + брояч ---------- */
function OfferTop({ secondsLeft, label }: { secondsLeft: number; label: string }) {
  const urgent = secondsLeft <= OFFER_URGENT_SECONDS;
  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`; // 2:00 … 0:00
  return (
    <>
      <div className="bg-emerald-600 text-white px-4 py-2.5 text-center">
        <p className="font-black text-[20px] leading-tight flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4 flex-shrink-0" strokeWidth={3} /> Поръчката ви е приета успешно!
        </p>
        <p className="text-[13px] text-white/85 font-semibold">Ще се свържем с вас за потвърждение</p>
      </div>
      <div className="h-1.5 bg-rose-100">
        <div
          className={`h-full ${urgent ? 'bg-red-500' : 'bg-gradient-to-r from-rose-500 to-amber-400'}`}
          style={{ width: `${(secondsLeft / OFFER_SECONDS) * 100}%`, transition: 'width 1s linear' }}
        />
      </div>
      <div className="flex items-center justify-center pt-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[15px] font-black uppercase tracking-wide ${
            urgent ? 'bg-red-600 text-white animate-pulse' : 'bg-rose-100 text-rose-700'
          }`}
        >
                    <Clock className="w-5 h-5" /> {label} · <span className="text-[22px] leading-none tabular-nums">{mmss}</span>
        </span>
      </div>
    </>
  );
}

/* ---------- Обвивка на модал (bottom-sheet на моб, център на десктоп) ---------- */
function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="absolute inset-0 bg-[#1b0d1a]/70 backdrop-blur-md" />
      <div className="relative flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="w-full sm:max-w-md uf-sheet-in">{children}</div>
      </div>
    </div>
  );
}

export function UpsellFlow({
  order,
  onClose,
  preview = false,
}: {
  order: OrderSnapshot;
  onClose: () => void;
  // 🧪 Само за тестовия преглед (src/dev/OfferPreview.tsx): НИЩО не се изпраща към таблиците
  preview?: boolean;
}) {
  // Офертата за тази поръчка (null при 4+ шишенца → започваме направо от downsell-а)
  const up = upsellFor(order.quantity);
  const [step, setStep] = useState<'upsell' | 'downsell' | 'thankyou'>(up ? 'upsell' : 'downsell');
  const [path, setPath] = useState<'upsell' | 'downsell' | 'none'>('none');

  // Гарантира, че към сървъра тръгва САМО ЕДНА финализираща заявка (един имейл).
  const sentRef = useRef(false);

  // ==========================================================
  // 🚚 НОВО: сметки само за показване (нищо от това не се праща към таблицата)
  // ==========================================================
  const shipFee = Number(order.shippingFee) || 0;                        // 2,50 / 3,75 / 4,50
  // 📦 НОВО: от 3 шишенца доставката вече е безплатна още в основната поръчка
  const baseFree = hasFreeShipping(order.quantity);
  const shipSaving = baseFree ? 0 : shipFee;                             // доставка, която офертата спестява
  const upsellProductSaving = up ? round2(up.wasPrice - up.addPrice) : 0; // 2,90 / 6,80 / 5,80
  const upsellSaving = round2(upsellProductSaving + shipSaving);
  const upsellPct = up && up.wasPrice > 0 ? Math.round((upsellProductSaving / up.wasPrice) * 100) : 0;

  // За благодарствения екран: краен брой детски опаковки и докъде
  const finalKidsQty = path === 'upsell' && up ? up.targetQty : order.quantity;
  const baseCity = typeof order.base?.city === 'string' ? order.base.city : '';
  const shipPlace = [order.shippingLabel || '', baseCity].filter(Boolean).join(', ');

  // Праща обновяване/финализиране със ФИНАЛНИ стойности. quantity = брой ДЕТСКИ опаковки.
  // 'complete' = клиентът отказа/не реагира → тръгва базовият имейл, редовете НЕ се пипат.
  const sendUpdate = (action: 'upsell' | 'downsell' | 'complete', quantity: number, total: number) => {
    if (sentRef.current) return; // вече е изпратено веднъж — не дублираме
    sentRef.current = true;
    if (preview) {
      console.info('🧪 Тестов режим — НЕ се изпраща:', action, quantity, total);
      return;
    }
    const payload = {
      SK: 'id:9307307573',
      action,
      eventId: order.eventId,
      quantity,
      total: Number(total.toFixed(2)),
    };

    // Към основния скрипт: + пълните данни на поръчката и базовите брой/сума (за възстановяване)
    const fullPayload = {
      ...(order.base || {}),
      ...payload,
      baseQuantity: order.quantity,
      baseTotal: order.total,
    };

    // keepalive: заявката стига до таблицата, дори клиентът веднага да затвори страницата
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(fullPayload),
      keepalive: true,
    }).catch((error) => console.error('Upsell sync error:', error));

    // Бекъп запис (независим — само обновява реда в бекъпа, без имейли/Tradefy) — същото като преди
    fetch(BACKUP_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((error) => console.error('Upsell backup sync error:', error));
  };


  const acceptUpsell = () => {
    // Upsell: до следващия пакет → детският брой расте с up.addQty
    // (Apps Script смята сумата сам от таблицата — по същото правило)
    if (!up) return;
    sendUpdate('upsell', up.targetQty, order.total + up.addPrice);
    setPath('upsell');
    setStep('thankyou');
  };
  const acceptDownsell = () => {
    // Downsell: +1 продукт за ВЪЗРАСТНИ (различен продукт).
    // Детският брой НЕ се променя — възрастният се разпознава от SKU_DOWNSELL в Tradefy.
    // Обновяваме само сумата.
    sendUpdate('downsell', order.quantity, order.total + DOWNSELL.addPrice);
    setPath('downsell');
    setStep('thankyou');
  };
  const declineAll = () => {
    // Отказ / липса на реакция → финализираме базовата поръчка (тръгва базовият имейл)
    sendUpdate('complete', order.quantity, order.total);
    setPath('none');
    setStep('thankyou');
  };

  // ЗАЩИТА СРЕЩУ ЗАГУБЕН ИМЕЙЛ: ако клиентът стигне до Upsell/Downsell и не натисне нищо,
  // броячът (OFFER_SECONDS) изтича → автоматично се финализира (базов имейл към клиента и админа).
  // Ако през това време натисне оферта или откаже — sendUpdate е защитен, няма двоен имейл.
  // НОВО: ако клиентът затвори страницата по време на ъпсела — финализираме веднага,
  // иначе поръчката оставаше без имейл (60-секундният таймер не успяваше да тръгне).
  useEffect(() => {
    const onPageHide = () => {
      if (!sentRef.current) sendUpdate('complete', order.quantity, order.total);
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⏱️ БРОЯЧ НА ОФЕРТАТА: OFFER_SECONDS за всеки екран. При 0 офертата изтича:
  // upsell → downsell, downsell → финализиране (базов имейл) и „Благодарим ви“.
  // Смята се по часовника (Date.now), затова е точен и ако телефонът приспи страницата.
  const [secondsLeft, setSecondsLeft] = useState(OFFER_SECONDS);
  useEffect(() => {
    if (step !== 'upsell' && step !== 'downsell') return;
    setSecondsLeft(OFFER_SECONDS);
    const started = Date.now();
    const id = setInterval(() => {
      if (sentRef.current) { clearInterval(id); return; } // клиентът вече е избрал
      const left = Math.max(0, OFFER_SECONDS - Math.floor((Date.now() - started) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(id);
        if (step === 'upsell') setStep('downsell');
        else declineAll();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* ---------- UPSELL ---------- */}
      {step === 'upsell' && up && (
        <Modal>
          <div className="bg-gradient-to-b from-[#fff1f5] to-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
            <OfferTop secondsLeft={secondsLeft} label="Еднократна оферта" />

            <div className="px-5 pt-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6">
              <h2 className="text-center text-[21px] sm:text-2xl leading-[1.15] font-black text-[#231018]">
                Добави още <span className="text-rose-600">{up.addQty === 1 ? '1 шишенце' : `${up.addQty} шишенца`}</span> на <span className="whitespace-nowrap">по-ниска цена</span>
              </h2>
              <p className="text-center text-[18px] text-slate-600 font-semibold mt-1">
                {shipSaving > 0 ? (
                  <>…и отключи <b className="text-emerald-600">БЕЗПЛАТНА доставка</b> за цялата поръчка 🚚</>
                ) : (
                  <>Тази цена я има <b className="text-rose-600">само сега</b>, само на този екран</>
                )}
              </p>

              <div className="mt-3 flex items-center gap-4">
                <OfferShot src={UPSELL_IMG[up.addQty] || UPSELL_IMG[2]} contain={up.addQty === 1} emoji={UPSELL_EMOJI} badge={`+${up.addQty}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="line-through text-slate-400 font-bold text-[15px]">{eur(up.wasPrice)}</span>
                    {upsellPct >= 10 && (
                      <span className="bg-rose-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded-md">-{upsellPct}%</span>
                    )}
                  </div>
                  <p className="text-[38px] sm:text-[42px] font-black text-[#231018] leading-none mt-0.5">{eur(up.addPrice)}</p>
                  <p className="mt-1.5 text-[14px] font-black text-emerald-700 leading-tight">🎉 Спестявате {eur(upsellSaving)}</p>
                  {shipSaving > 0 && (
                    <p className="text-[11.5px] font-bold text-emerald-700/80 leading-tight">
                      вкл. <span className="line-through">{eur(shipSaving)}</span> доставка → 0,00 €
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11.5px] font-bold text-slate-600">
                <span className="bg-white ring-1 ring-rose-100 rounded-full px-2.5 py-1">📦 Към същата пратка</span>
                <span className="bg-white ring-1 ring-rose-100 rounded-full px-2.5 py-1">🚚 Безплатна доставка </span>
                <span className="bg-white ring-1 ring-rose-100 rounded-full px-2.5 py-1">💶 Плащате при получаване</span>
              </div>

              <button
                onClick={acceptUpsell}
                className="uf-shimmer relative overflow-hidden w-full mt-3.5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/30 transition active:scale-[.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span className="flex flex-col items-center leading-tight text-center">
                  <span className="text-[16px] sm:text-lg whitespace-nowrap">ДА! Добави към поръчката</span>
                  <span className="text-[12px] font-bold opacity-90">само +{eur(up.addPrice)} · спестявам {eur(upsellSaving)}</span>
                </span>
              </button>

              <button
                onClick={() => setStep('downsell')}
                className="w-full mt-2 py-2 rounded-2xl border border-slate-300 text-slate-400 hover:text-slate-600 text-[13px] font-semibold transition"
              >
                Не, благодаря — поръчката ми остава както е
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------- DOWNSELL ---------- */}
      {step === 'downsell' && (
        <Modal>
          <div className="bg-gradient-to-b from-[#eefaf3] to-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
            <OfferTop secondsLeft={secondsLeft} label="Последна оферта" />

            <div className="px-5 pt-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6">
              <h2 className="text-center text-[24px] sm:text-2xl leading-[1.15] font-black text-[#eab308]">
                Вземи сега <span className="text-emerald-600">Naturino за възрастни с надградена формула с 13 билки и плодове</span>
              </h2>
              <p className="text-center text-[13px] text-slate-600 font-semibold mt-1">
                {shipSaving > 0 ? (
                  <span className="block text-[12px] leading-tight font-black text-red-600 animate-pulse">…и ОТКЛЮЧИ БЕЗПЛАТНА ДОСТАВКА ЗА ЦЯЛАТА ПОРЪЧКА 🚚</span>
                ) : (
                  <>В същата пратка — <b className="text-emerald-600">без доплащане за доставка</b></>
                )}
              </p>

              <div className="mt-3 flex items-center gap-4">
                <OfferShot src={DOWNSELL.img} emoji={DOWNSELL.emoji} badge="+1" />
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                    <Gift className="w-3 h-3" /> 13 билки и плодове
                  </span>
                  <p className="text-[38px] sm:text-[42px] font-black text-[#0f2a20] leading-none mt-1">{eur(DOWNSELL.addPrice)}</p>
                  {shipSaving > 0 ? (
                    <p className="mt-1.5 text-[13px] font-black text-emerald-700 leading-tight">
                      🚚 Спестявате {eur(shipSaving)} от доставката
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[12.5px] font-bold text-slate-600 leading-tight">🧑 За възрастни и деца 12+</p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11.5px] font-bold text-slate-600">
                <span className="bg-white ring-1 ring-emerald-100 rounded-full px-2.5 py-1">🍄 Рейши · Шийтаке · Астрагал</span>
                <span className="bg-white ring-1 ring-emerald-100 rounded-full px-2.5 py-1">⚡ Енергия и устойчивост</span>
                <span className="bg-white ring-1 ring-emerald-100 rounded-full px-2.5 py-1">📦 В същата пратка</span>
              </div>

              <button
                onClick={acceptDownsell}
                className="uf-shimmer relative overflow-hidden w-full mt-3.5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/30 transition active:scale-[.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span className="flex flex-col items-center leading-tight text-center">
                  <span className="text-[16px] sm:text-lg whitespace-nowrap">ДА! Добави и за мен</span>
                  <span className="text-[12px] font-bold opacity-90">
                    само +{eur(DOWNSELL.addPrice)}{shipSaving > 0 ? ' · доставката става безплатна' : ''}
                  </span>
                </span>
              </button>

              <button
                onClick={declineAll}
                className="w-full mt-2 py-2 rounded-2xl border border-slate-300 text-slate-400 hover:text-slate-600 text-[13px] font-semibold transition"
              >
                Не, благодаря — поръчката ми остава както е
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
            <h2 className="text-3xl font-black text-slate-900">Благодарим ви!</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              Поръчката ви е приета. Очаквайте обаждане за потвърждение съвсем скоро.
            </p>

            {/* Кратко: колко опаковки и докъде (подробностите са в имейла) */}
            <p className="mt-6 text-[13px] text-slate-500 font-semibold leading-snug">
              📦 {finalKidsQty} {finalKidsQty === 1 ? 'опаковка' : 'опаковки'} Naturino Kids
              {path === 'downsell' && ' + 1 за възрастни'}
              {shipPlace && ` · ${shipPlace}`}
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
