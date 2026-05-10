import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Database, ShieldAlert } from 'lucide-react';

export function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container-custom max-w-4xl">
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Назад към магазина
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Политика за поверителност
          </h1>
          <p className="text-slate-500 mb-10">Последна актуализация: 10 май 2026 г.</p>
          
          <div className="space-y-10 text-slate-600 leading-relaxed">
            
            {/* 1. Администратор на данни */}
            <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="text-emerald-600" /> 1. Администратор на лични данни
              </h2>
              <p className="mb-4 text-sm">
                Ники-2025 ЕООД (наричан по-долу „Продавач“ или „Администратор“), с ЕИК 208228805, обработва Вашите лични данни в пълно съответствие с Регламент (ЕС) 2016/679 (GDPR).
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium text-slate-700">
                <p>Адрес: гр. Казанлък, жк. Изток 48, №23</p>
                <p>Email: naturinokids@gmail.com</p>
              </div>
            </section>

            {/* 2. Какви данни събираме */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> 2. Какви данни събираме
              </h2>
              <p className="mb-3">За целите на Вашата поръчка събираме следните данни:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li><strong>Идентификационни данни:</strong> Име и фамилия.</li>
                <li><strong>Данни за контакт:</strong> Телефонен номер и имейл адрес.</li>
                <li><strong>Данни за доставка:</strong> Точен адрес за доставка на поръчаните стоки.</li>
                <li><strong>Технически данни:</strong> IP адрес, тип браузър и идентификатори на устройства (чрез бисквитки).</li>
              </ul>
            </section>

            {/* 3. Защо събираме тези данни */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" /> 3. Цели на обработването
              </h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>Изпълнение на договора за покупко-продажба и доставка на продуктите.</li>
                <li>Комуникация с Вас относно Вашата поръчка.</li>
                <li><strong>Маркетинг и анализ:</strong> Оптимизиране на нашите рекламни кампании чрез Facebook Pixel и Conversions API (CAPI).</li>
                <li>Предотвратяване на измами и сигурност на сайта.</li>
              </ul>
            </section>

            {/* 4. Споделяне с трети страни - Facebook Pixel/CAPI */}
            <section className="border-l-4 border-emerald-500 pl-6 py-2 bg-slate-50/50 p-4 rounded-r-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Споделяне на данни (Meta/Facebook)</h2>
              <p className="mb-4">
                Този сайт използва технологии за проследяване (Facebook Pixel и Conversions API), предоставени от Meta Platforms, Inc.
              </p>
              <p className="text-sm bg-white p-4 rounded-lg border border-slate-200 italic">
                <strong>Важно:</strong> При извършване на поръчка, част от Вашите данни (имейл и телефон) се изпращат в криптиран вид (hashed) към Meta. Това ни помага да измерваме ефективността на нашите реклами и да виждаме кои потребители са завършили поръчка. Meta не съхранява тези данни в чист вид, а ги използва само за съпоставка с вече съществуващи профили.
              </p>
            </section>

            {/* 5. Куриерски услуги */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Куриерски услуги</h2>
              <p>
                Вашите данни за доставка се споделят единствено с лицензирани куриерски фирми (<strong>Спиди</strong> или <strong>Еконт</strong>) с единствената цел продуктът да достигне до Вас.
              </p>
            </section>

            {/* 6. Вашите права */}
            <section className="bg-amber-50/30 p-6 rounded-2xl border border-amber-100">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" /> 6. Вашите права
              </h2>
              <p className="mb-2">Съгласно GDPR Вие имате право на:</p>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                <li>Достъп до Вашите лични данни.</li>
                <li>Коригиране на неточни данни.</li>
                <li><strong>Право „да бъдете забравени“</strong> (изтриване на Вашите данни от нашата система).</li>
                <li>Ограничаване на обработването.</li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                За да упражните тези права, моля свържете се с нас на: naturinokids@gmail.com
              </p>
            </section>

            {/* 7. Регулаторни органи */}
            <section className="text-xs text-slate-400 border-t border-slate-100 pt-6">
              <p className="font-bold mb-1 uppercase">Надзорни органи:</p>
              <p>Комисия за защита на личните данни (КЗЛД): бул. "Проф. Цветан Лазаров" № 2, София 1592, www.cpdp.bg</p>
            </section>

          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
            © 2026 Naturino Kids - Всички права запазени.
          </div>
        </div>
      </div>
    </div>
  );
}