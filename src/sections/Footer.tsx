import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Clock, Facebook, Instagram, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl">Naturino Kids</h3>
                <p className="text-slate-400 text-xs md:text-sm">Натурална защита за деца</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
              100% натурален имуностимулатор с 10 български билки за силен имунитет на вашето дете.
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

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">Бързи връзки</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#problem" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  За продукта
                </a>
              </li>
              <li>
                <a href="#ingredients" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Съставки
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Отзиви
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  ЧЗВ
                </a>
              </li>
              <li>
                <a href="#checkout" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Поръчай
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">Контакти</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Телефон</p>
                  <a href="tel:0896783751" className="text-white hover:text-emerald-400 transition-colors text-sm md:text-base">
                    0896 783 751
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Имейл</p>
                  <a href="mailto:naturinokids@gmail.com" className="text-white hover:text-emerald-400 transition-colors text-sm md:text-base break-all">
                    naturinokids@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Адрес</p>
                  <p className="text-white text-sm md:text-base">гр. Казанлък, България</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs md:text-sm">Работно време</p>
                  <p className="text-white text-sm md:text-base">Пон-Нед: 24/7 </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Pharmacy */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">Налично в</h4>
            <div className="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5">
              <p className="text-amber-400 font-bold text-base md:text-lg mb-1 md:mb-2">Аптеки Апостолов</p>
              <p className="text-slate-400 text-xs md:text-sm mb-3 md:mb-4">
                Можете да закупите Naturino Kids във всички аптеки от веригата Аптеки Апостолов.
              </p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Аптека+Апостолов+Казанлък+бул+23-ти+пехотен+Шипченски+полк+7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm md:text-base"
              >
                <span>Намери аптека</span>
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
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
                  
              <Link to="/privacy" 
              className="text-slate-500 hover:text-emerald-400 transition-colors text-xs md:text-sm">
                Политика за поверителност
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
