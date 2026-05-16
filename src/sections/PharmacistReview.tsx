import { useEffect, useRef } from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';

export function PharmacistReview() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-slate-50/50"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Видео блок с интегриран подпис */}
          <div className="reveal opacity-0 relative order-2 lg:order-1">
            <div className="absolute -top-4 -right-4 z-10 bg-amber-400 text-slate-900 text-[10px] md:text-xs font-black px-4 py-2 rounded-lg shadow-lg uppercase tracking-wider">
              Препоръчан от експерти
            </div>
            
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border-8 border-white bg-emerald-900">
              {/* Gumlet Video Embed */}
              <div style={{ position: 'relative', aspectRatio: '1/1' }}>
                <iframe
                  loading="lazy"
                  title="Gumlet video player"
                  src="https://play.gumlet.io/embed/69f06036a3dc19951f0ff028?autoplay=true&muted=true&preload=true&playsinline=1"
                  style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                  referrerPolicy="origin"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write;"
                ></iframe>
              </div>

              {/* Текстът под видеото, оставащ вътре в бялата рамка */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">Магистър-фармацевт</p>
                    <p className="text-emerald-100 text-sm mt-1">Аптеки Апостолов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Текст и Цитат */}
          <div className="text-center reveal opacity-0 space-y-6 md:space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Професионално Одобрение
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              „Като фармацевт с дългогодишен опит, <span className="text-emerald-600">препоръчвам Naturino Kids</span> на всички родители"
            </h2>

            <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <Quote className="absolute -top-4 -left-4 w-10 h-10 text-emerald-100 -z-0" />
              <div className="relative z-10 space-y-4">
                <p className="text-slate-600 italic leading-relaxed md:text-lg">
                  „В моята практика съм виждала стотици продукти за имунитет при деца, но Naturino Kids се отличава със своята <strong className="text-slate-900">100% натурална формула</strong> и <strong className="text-slate-900">доказани резултати</strong>. Комбинацията от 10 български билки е изключително добре балансирана и безопасна за децата.“
                </p>
                <p className="text-slate-600 italic leading-relaxed md:text-lg">
                  „Родителите, които го използват, споделят значително подобрение в имунитета на децата си – по-рядко боледуване, повече енергия и по-бързо възстановяване. Това е продукт, на който мога да се доверя.“
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {['Одобрен от фармацевтите in Аптеки Апостолов', 'Препоръчан от педиатри', 'Без странични ефекти'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-large font-bold">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}