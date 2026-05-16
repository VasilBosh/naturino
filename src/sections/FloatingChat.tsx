import { X } from 'lucide-react';
import { useState } from 'react';

export function FloatingChat() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-50 flex flex-col items-end gap-3">
      {/* Опциите (Messenger и Viber) */}
      <div 
        className={`flex flex-col items-center gap-3 transition-all duration-300 ease-in-out transform ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Messenger */}
        <a 
          href="https://m.me/61578127216995"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg hover:scale-110 transition-transform"
          aria-label="Messenger"
        >
          <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.91 1.45 5.49 3.72 7.12V22l3.44-1.89c.89.25 1.83.39 2.84.39 5.52 0 10-4.14 10-9.25S17.52 2 12 2zm1.09 11.96l-2.55-2.72-4.97 2.72 5.46-5.8 2.61 2.72 4.91-2.72-5.46 5.8z"/>
          </svg>
        </a>

        {/* Viber */}
        <a 
          href="viber://chat?number=%2B359896783751"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          aria-label="Viber"
        >
          <img src="images/viber.png" alt="Viber" className="h-12 w-auto block" />
        </a>
      </div>

      {/* Основно 3D балонче - С комбинирана мазна анимация (Плуване + Поклащане) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex h-12 w-12 items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          // Създаваме динамична анимация на място (inline)
          animation: !isMenuOpen ? 'combined-float-wiggle 10s ease-in-out infinite' : 'none'
        }}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#33bb5a] text-white transition-transform duration-300 rotate-90">
            <X className="w-6 h-6 stroke-[2.5]" />
          </div>
        ) : (
          <img src="images/message.png" alt="Чат" className="h-full w-full object-contain block" />
        )}
      </button>

      {/* Инжектираме фините keyframes директно, за да не пипаме tailwind.config.js */}
      <style>{`
        @keyframes combined-float-wiggle {
          /* Бавното плуване нагоре-надолу върви през целия 10-секунден цикъл */
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(0deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(0deg); }
          
          /* Точно на 5-тата секунда (в средата) прави едно нежно поклащане наляво-надясно */
          46% { transform: translateY(-2px) rotate(-3deg); }
          48% { transform: translateY(-2px) rotate(3deg); }
          50% { transform: translateY(0) rotate(-2deg); }
          52% { transform: translateY(-2px) rotate(2deg); }
          54% { transform: translateY(-2px) rotate(0deg); }
          
          /* На 10-тата секунда (в края) прави второто нежно поклащане преди рестарта */
          92% { transform: translateY(-2px) rotate(-3deg); }
          94% { transform: translateY(-2px) rotate(3deg); }
          96% { transform: translateY(0) rotate(-2deg); }
          98% { transform: translateY(-2px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}