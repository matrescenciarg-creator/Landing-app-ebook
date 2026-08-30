import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onOpenCheckout: () => void;
  onScrollToDemo: () => void;
  isUnlocked: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCheckout,
  onScrollToDemo,
  isUnlocked
}) => {
  return (
    <section id="hero-section" className="relative overflow-hidden py-14 md:py-20 bg-[#fdfaf5] border-b border-[#eeeae4]">
      {/* Decorative background accents from Sleek theme */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#f8f1e9] rounded-full opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-96 h-96 bg-[#c8d6ba]/25 rounded-full opacity-50 blur-2xl pointer-events-none" />
      <div className="absolute bottom-6 left-1/3 w-64 h-64 bg-[#d4a34b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* Sleek Hero Highlight Box */}
        <div className="bg-white p-8 sm:p-12 md:p-14 rounded-[32px] border border-[#eeeae4] shadow-sm relative overflow-hidden text-center max-w-4xl mx-auto">
          
          {/* Subtle geometric circles inside card */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#f8f1e9] rounded-full opacity-50 pointer-events-none" />
          <div className="absolute right-10 top-10 w-24 h-24 bg-[#c8d6ba] rounded-full opacity-25 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f4f1ec] border border-[#eeeae4] text-[#7a6f65] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#d4a34b]" />
              <span>Método Vínculo · App + Ebook</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.18] text-[#3d3229] max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              ¿Qué te dice tu bebé ahora?
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-[#7a6f65] max-w-2xl mx-auto leading-relaxed">
              Usa el traductor del <strong className="font-semibold text-[#3d3229]">Método Vínculo</strong> para descifrar el llanto, el sueño y el lenguaje corporal en tiempo real. Respuestas claras y calmadas sin adivinar.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              {isUnlocked ? (
                <button
                  id="hero-unlocked-btn"
                  onClick={onScrollToDemo}
                  className="w-full sm:w-auto bg-[#d47e62] hover:bg-[#c46d52] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Abrir Traductor de Señales</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="hero-buy-btn"
                  onClick={onOpenCheckout}
                  className="w-full sm:w-auto bg-[#d47e62] hover:bg-[#c46d52] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Quiero la app por $10 USD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                id="hero-how-it-works-btn"
                onClick={onScrollToDemo}
                className="w-full sm:w-auto bg-white border-2 border-[#d47e62] text-[#d47e62] hover:bg-[#fff9f7] px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Señales & Demo</span>
              </button>
            </div>

            {/* Guarantee and trust tags */}
            <div className="mt-8 pt-6 border-t border-[#eeeae4] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#7a6f65]">
              <span className="flex items-center gap-1.5 bg-[#f4f1ec] px-3.5 py-1.5 rounded-full border border-[#eeeae4]">
                <Zap className="w-3.5 h-3.5 text-[#d4a34b]" />
                Pago único · Sin suscripción
              </span>
              <span className="flex items-center gap-1.5 bg-[#f4f1ec] px-3.5 py-1.5 rounded-full border border-[#eeeae4]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#688a4d]" />
                Acceso inmediato e ilimitado
              </span>
              <span className="flex items-center gap-1.5 bg-[#f4f1ec] px-3.5 py-1.5 rounded-full border border-[#eeeae4]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#d47e62]" />
                Ebook + 3 Bonos de regalo
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
