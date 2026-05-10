import { useEffect, useRef } from 'react';

import { Check, Sparkles, Shield, Leaf, Award, Baby, ArrowRight, Heart } from 'lucide-react';



export function Solution() {

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



  const scrollToCheckout = () => {

    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });

  };



  const benefits = [

    'Подсилва имунитета естествено',

    'Защитава от вируси и бактерии',

    'Подходящ за целогодишна употреба',

    'Без странични ефекти',

    'Лесен за прием от деца',

    'Резултати още от първата седмица',

  ];



  const features = [

    {

      icon: <Leaf className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />,

      title: '100% Натурален',

      description: 'Само билки и плодове',

    },

    {

      icon: <Baby className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,

      title: 'За деца над 18м',

      description: 'Безопасен за малките',

    },

    {

      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,

      title: 'Без консерванти',

      description: 'Чиста формула',

    },

    {

      icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />,

      title: 'Препоръчан',

      description: 'От лекари и фармацевти',

    },

  ];



  return (

    <section

      ref={sectionRef}

      className="section-padding bg-white"

    >

      <div className="container-custom">

        {/* Header */}

        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">

          <div className="reveal opacity-0 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">

            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />

            <span>Решението, което търсите</span>

          </div>

         

          <h2 className="reveal opacity-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">

            Naturino Kids —<br className="hidden sm:block" />

            <span className="gradient-text">Натуралният щит на детето</span>

          </h2>

         

          <p className="reveal opacity-0 text-base md:text-lg text-slate-600 leading-relaxed">

            Уникална комбинация от <strong>10 български билки и плодове</strong>,
            която подсилва имунната система по естествен начин.
            Без химия, без странични ефекти.

          </p>

        </div>



        {/* Main Content */}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-10 md:mb-16">

          {/* Left - Benefits */}

          <div className="reveal opacity-0">

            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">

              Какво получавате:

            </h3>

           

            <ul className="space-y-3 mb-6 md:mb-8">

              {benefits.map((benefit, index) => (

                <li key={index} className="flex items-start gap-3">

                  <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">

                    <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />

                  </div>

                  <span className="text-slate-700 text-sm md:text-base">{benefit}</span>

                </li>

              ))}

            </ul>



            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 md:p-5 rounded-r-xl mb-6">

              <p className="text-slate-800 text-sm md:text-base">

                <strong>Важно:</strong> Продуктът е наличен в

                <strong className="text-emerald-700"> Аптеки Апостолов</strong> —

                една от най-големите аптечни вериги в България!

              </p>

            </div>



            <button

              onClick={scrollToCheckout}

              className="btn-cta-primary flex items-center justify-center gap-2 w-full sm:w-auto"

            >

              <Heart className="w-5 h-5" />

              ИСКАМ ЗДРАВО ДЕТЕ

              <ArrowRight className="cta-arrow w-5 h-5" />

            </button>

          </div>



          {/* Right - Features Grid */}

          <div className="grid grid-cols-2 gap-3 md:gap-4">

            {features.map((feature, index) => (

              <div

                key={index}

                className="reveal opacity-0 card-hover bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100"

                style={{ animationDelay: `${index * 0.1}s` }}

              >

                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center mb-3">

                  {feature.icon}

                </div>

                <h4 className="text-sm md:text-base font-bold text-slate-900 mb-1">{feature.title}</h4>

                <p className="text-slate-600 text-xs md:text-sm">{feature.description}</p>

              </div>

            ))}

          </div>

        </div>



        {/* How to Use */}

        <div className="reveal opacity-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white">

          <div className="max-w-4xl mx-auto">

            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-8">

              Как се приема?

            </h3>

           

            <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">

              <p className="text-emerald-100 text-sm md:text-base lg:text-lg leading-relaxed text-center">

                <strong className="text-white">Прием:</strong> сутрин и вечер преди ядене по 25 капки (1.2 мл)

                в малко вода или сок, или директно под езика. Капките са с приятен, естествено сладък вкус.

              </p>

            </div>

           

            <div className="grid grid-cols-3 gap-3 md:gap-6">

              <div className="text-center">

                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">

                  1

                </div>

                <h4 className="font-bold text-sm md:text-base mb-1">Сутрин преди храна</h4>

                <p className="text-emerald-100 text-xs md:text-sm">Всеки ден</p>

              </div>

             

              <div className="text-center">

                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">

                  2

                </div>

                <h4 className="font-bold text-sm md:text-base mb-1">Вечер преди храна</h4>

                <p className="text-emerald-100 text-xs md:text-sm">Всеки ден</p>

              </div>

             

              <div className="text-center">

                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-lg md:text-xl font-bold">

                  3

                </div>

                <h4 className="font-bold text-sm md:text-base mb-1">Силен имунитет</h4>

                <p className="text-emerald-100 text-xs md:text-sm">Още от първата седмица</p>

              </div>

            </div>

           

            <p className="text-center mt-6 md:mt-8 text-emerald-100 text-sm md:text-base">

              <strong>Едно шише (50ml) стига за около 20 дни!</strong>

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}