import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export function Terms() {
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
            Общи условия
          </h1>
          <p className="text-slate-500 mb-10">Последна актуализация: 24 октомври 2024 г.</p>
          
          <div className="space-y-10 text-slate-600 leading-relaxed">
            
            {/* 1. Данни за продавача */}
            <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" /> 1. Данни за Продавача
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <p><strong>Наименование:</strong> Ники-2025 ЕООД</p>
                <p><strong>ЕИК/Булстат:</strong> 208228805</p>
                <p><strong>Адрес:</strong> гр. Казанлък, жк. Изток 48, №23</p>
                <p><strong>Телефон:</strong> 0896 783 751</p>
                <p><strong>Имейл:</strong> naturinokids@gmail.com</p>
              </div>
            </section>

            {/* 2. Предмет на общите условия */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Предмет</h2>
              <p>
                Настоящите общи условия уреждат отношенията между Продавача и Потребителите на електронния магазин <strong>Naturino Kids</strong>. С извършването на поръчка, Потребителят заявява, че е запознат с настоящите условия и ги приема.
              </p>
            </section>

            {/* 3. Поръчка и Доставка */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" /> 3. Поръчка и Доставка
              </h2>
              <ul className="list-disc ml-5 space-y-2">
                <li>Поръчки се приемат 24 часа в денонощието чрез формата за поръчка в сайта.</li>
                <li>Доставката се извършва чрез куриерски фирми <strong>Спиди</strong> или <strong>Еконт</strong>.</li>
                <li>Срокът за доставка е от 1 до 3 работни дни.</li>
                <li>Цената на доставката се калкулира според тарифите на куриера, освен ако не е упоменато "Безплатна доставка".</li>
              </ul>
            </section>

            {/* 4. Плащане */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Начин на плащане</h2>
              <p>
                Основният метод за плащане е <strong>"Наложен платеж"</strong> (плащане при доставка) след преглед на пратката. Всички цени в сайта са в български лева (BGN).
              </p>
            </section>

            {/* 5. Право на отказ и връщане */}
            <section className="border-l-4 border-amber-400 pl-6 py-2">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-500" /> 5. Право на отказ и връщане
              </h2>
              <p className="mb-3">
                Според ЗЗП, Потребителят има право да се откаже от договора в <strong>14-дневен срок</strong> от получаване на стоката.
              </p>
              <p className="text-sm bg-slate-100 p-4 rounded-lg italic">
                <strong>Важно:</strong> Поради естеството на продукта (хранителна добавка), правото на отказ е валидно САМО ако целостта на защитната опаковка (бандерол/фолио) не е нарушена и продуктът не е отварян.
              </p>
            </section>

            {/* 6. Рекламации */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Рекламации</h2>
              <p>
                При установяване на дефекти или несъответствие на получената стока (например счупена опаковка при транспорт), Потребителят трябва да уведоми Продавача незабавно на тел. 0896 783 751.
              </p>
            </section>

            {/* 7. Защита на личните данни */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">7. Поверителност</h2>
              <p>
                Продавачът обработва личните данни на Потребителите (имена, телефон и адрес) единствено за целите на обработка и доставка на поръчката, съгласно изискванията на GDPR.
              </p>
            </section>

          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
            © 2024 Naturino Kids - Всички права запазени.
          </div>
        </div>
      </div>
    </div>
  );
}