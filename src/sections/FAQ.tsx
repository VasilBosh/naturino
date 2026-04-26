import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  const faqs = [
    {
      question: 'От каква възраст може да се дава Naturino Kids?',
      answer: 'Naturino Kids е подходящ за деца над 1.5 години (18 месеца). Може да се дава както превантивно, така и при първи симптоми.',
    },
    {
      question: 'Как се приема продукта?',
      answer: 'Препоръчителната доза е 25 капки (1.2ml), два пъти дневно - сутрин и вечер. Може да се разтвори в малко вода, сок или чай. Ако детето проявява първи симптоми може да се увеличи дозата х2, като за един прием се дава 4 пипети по 0,5мл. сутрин и 4 пипети вечер под езика. Поради 100% естествения си състав няма опасност от предозиране!',
    },
    {
      question: 'Има ли странични ефекти?',
      answer: 'Naturino Kids е направен от 100% натурални съставки и няма известни странични ефекти при препоръчителната дозировка. Ако детето има алергии към някоя от билките, не използвайте продукта. Вече повече от 3 години нямаме данни от наши клиенти за странични ефекти или да се повлиява зле на децата.',
    },
    {
      question: 'Колко време отнема, за да видя резултати?',
      answer: 'Повечето родители забелязват подобрение в имунитета на детето още първата седмица на редовен прием. За оптимални резултати, препоръчваме поне 3-месечен курс.',
    },
    {
      question: 'Може ли да се комбинира с други лекарства?',
      answer: 'Naturino Kids е натурален продукт, но ако детето ви приема други лекарства, препоръчваме да се консултирате с лекар преди употреба.',
    },
    {
      question: 'Къде мога да закупя продукта?',
      answer: 'Можете да закупите Naturino Kids в аптеките от верига Аптеки Апостолов или директно от този сайт с доставка до вашия адрес.',
    },
    {
      question: 'За колко време стига една опаковка?',
      answer: 'Едно шише от 50ml е достатъчно за около 20 дни прием при препоръчителната дозировка. След отваряне, съхранявайте в хладилник.',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="faq"
      className="section-padding bg-slate-50"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <HelpCircle className="w-4 h-4" />
            <span>Често задавани въпроси</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Отговори на вашите <span className="gradient-text">въпроси</span>
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Намерете отговори на най-често задаваните въпроси за Naturino Kids
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="reveal opacity-0 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-sm md:text-base pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
