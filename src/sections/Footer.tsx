import { Link } from 'react-router-dom';
import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">

      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16 lg:py-20">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          {/* ====================================================== */}
          {/* BRAND */}
          {/* ====================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">

            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">

              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>

              <div>
                <h3 className="font-bold text-lg md:text-xl">
                  Naturino Kids
                </h3>

                <p className="text-slate-400 text-xs md:text-sm">
                  Натурална защита за деца
                </p>
              </div>

            </div>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
              100% натурален билков екстракт с 10 български билки за силен имунитет на вашето дете.
            </p>

            <div className="flex items-center gap-3">

              <a
                href="https://www.facebook.com/p/Naturino-Kids-61578127216995/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>

              <a
                href="https://www.instagram.com/naturinokids/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 bg-slate-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>

            </div>

          </div>

          {/* ====================================================== */}
          {/* QUICK LINKS */}
          {/* ====================================================== */}

          <div>

            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">
              Бързи връзки
            </h4>

            <ul className="space-y-2 md:space-y-3">

              <li>
                <a
                  href="#problem"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  За продукта
                </a>
              </li>

              <li>
                <a
                  href="#ingredients"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Съставки
                </a>
              </li>

              <li>
                <a
                  href="#testimonials"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Отзиви
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  ЧЗВ
                </a>
              </li>

              <li>
                <a
                  href="#checkout"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Поръчай
                </a>
              </li>

              <li>
                <a
                  href="#physical-stores"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Физически обекти
                </a>
              </li>

            </ul>

          </div>

          {/* ====================================================== */}
          {/* CONTACT */}
          {/* ====================================================== */}

          <div>

            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">
              Контакти
            </h4>

            <ul className="space-y-3 md:space-y-4">

              <li className="flex items-start gap-3">

                <Phone className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Телефон
                  </p>

                  <a
                    href="tel:0896783751"
                    className="text-white hover:text-emerald-400 transition-colors text-sm md:text-base"
                  >
                    0896 783 751
                  </a>
                </div>

              </li>

              <li className="flex items-start gap-3">

                <Mail className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Имейл
                  </p>

                  <a
                    href="mailto:info@naturinokids.bg"
                    className="text-white hover:text-emerald-400 transition-colors text-sm md:text-base break-all"
                  >
                    info@naturinokids.bg
                  </a>
                </div>

              </li>

              <li className="flex items-start gap-3">

                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Адрес
                  </p>

                  <p className="text-white text-sm md:text-base">
                    гр. Казанлък, България
                  </p>
                </div>

              </li>

              <li className="flex items-start gap-3">

                <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />

                <div>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Работно време
                  </p>

                  <p className="text-white text-sm md:text-base">
                    Пон-Нед: 24/7
                  </p>
                </div>

              </li>

            </ul>

          </div>

          {/* ====================================================== */}
          {/* PHYSICAL LOCATIONS */}
          {/* ====================================================== */}

          <div>

            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">
              Физически обекти
            </h4>

            <div className="w-full">

              {/* Карта на България */}
              <div className="w-full overflow-hidden rounded-xl">

                <img
                  src="/images/NaturinoFooterMap.webp"
                  alt="Физически обекти на Naturino Kids в България"
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto object-contain"
                />

              </div>

              {/* Бутон към секцията с адресите */}
              <a
                href="#physical-stores"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Виж всички физически обекти →</span>
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* BOTTOM BAR */}
      {/* ======================================================== */}

      <div className="border-t border-slate-800">

        <div className="container-custom py-4 md:py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">

            <p className="text-slate-500 text-xs md:text-sm text-center sm:text-left">
              © 2024 Naturino Kids. Всички права запазени.
            </p>

            <div className="flex items-center gap-4 md:gap-6">

              <Link
                to="/terms"
                className="text-slate-500 hover:text-emerald-400 transition-colors text-xs md:text-sm"
              >
                Условия за ползване
              </Link>

              <Link
                to="/privacy"
                className="text-slate-500 hover:text-emerald-400 transition-colors text-xs md:text-sm"
              >
                Политика за поверителност
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}