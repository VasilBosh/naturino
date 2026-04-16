import { useEffect, useRef } from 'react';
import { Star, Quote, MessageCircle } from 'lucide-react';

export function SocialProof() {
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

  const testimonials = [
    {
      name: 'Мария Петрова',
      role: 'Майка на 5-годишно дете',
      content: 'Откакто давам Naturino Kids на дъщеря ми, тя боледува много по-рядко. Преди беше постоянно болна, а сега е пълна с енергия!',
      rating: 5,
    },
    {
      name: 'Иван Стоянов',
      role: 'Баща на близнаци',
      content: 'Пробвахме много продукти, но този наистина работи. Децата ми вече не пропускат детска градина заради болести. Препоръчвам!',
      rating: 5,
    },
    {
      name: 'Анна Димитрова',
      role: 'Майка на 3-годишно дете',
      content: 'Лекарят ни препоръча Naturino Kids и сме много доволни. Естествен продукт, който наистина помага на имунитета.',
      rating: 5,
    },
    {
      name: 'Петър Иванов',
      role: 'Баща на 7-годишно дете',
      content: 'Синът ми беше постоянно с хрема и кашлица. След 2 месеца с Naturino Kids разликата е огромна. Благодаря!',
      rating: 5,
    },
    {
      name: 'Елена Николова',
      role: 'Майка на две деца',
      content: 'Давам го и на двете си деца вече половин година. Резултатите са невероятни - здрави и жизнени деца!',
      rating: 5,
    },
    {
      name: 'Георги Петров',
      role: 'Баща на 4-годишно дете',
      content: 'Фармацевтът в Аптеки Апостолов ни препоръча този продукт. Много сме доволни от ефекта!',
      rating: 5,
    },
  ];

  const stats = [
    { value: '4000+', label: 'Доволни родители' },
    { value: '4.9/5', label: 'Среден рейтинг' },
    { value: '95%', label: 'Препоръчват продукта' },
    { value: '10', label: 'Натурални билки' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="testimonials"
      className="section-padding bg-slate-50"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 md:mb-6">
            <MessageCircle className="w-4 h-4" />
            <span>Отзиви от родители</span>
          </div>
          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Какво казват <span className="gradient-text">родителите</span>
          </h2>
          <p className="reveal opacity-0 text-base md:text-lg text-slate-600">
            Присъединете се към хилядите доволни родители, които вече се довериха на Naturino Kids
          </p>
        </div>

        {/* Stats */}
        <div className="reveal opacity-0 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-sm border border-slate-100"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-slate-600 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="reveal opacity-0 card-hover bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-1 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="relative mb-4 md:mb-5">
                <Quote className="absolute -top-2 -left-1 w-6 h-6 md:w-8 md:h-8 text-emerald-100" />
                <p className="text-slate-700 text-sm md:text-base leading-relaxed pl-4 md:pl-6">
                  {testimonial.content}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm md:text-base">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs md:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
