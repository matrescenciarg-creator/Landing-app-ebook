import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenCheckout,
  isUnlocked
}) => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#fdfaf5] border-t border-[#eeeae4]">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c8d6ba]/25 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom text-center max-w-2xl relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#eeeae4] shadow-xs mx-auto mb-5 flex items-center justify-center text-2xl">
          🤱
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d3229] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Empieza a entender a tu bebé hoy
        </h2>
        <p className="mt-5 text-base md:text-lg text-[#7a6f65] leading-relaxed">
          Por $10 USD, tienes en tu bolsillo una guía clara para los momentos en que más la necesitas. Sin adivinar, sin culpa y con respuestas respaldadas por el Método Vínculo.
        </p>

        <div className="mt-9">
          {isUnlocked ? (
            <a 
              href="#traductor-interactivo" 
              className="inline-flex items-center gap-2 font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white px-9 py-4 rounded-2xl text-base shadow-md hover:shadow-lg transition-all"
            >
              <span>Ir al Traductor de Señales</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-2 font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white px-9 py-4 rounded-2xl text-base shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <span>Quiero la app por $10 USD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-[#7a6f65]">
          Pago único · Acceso inmediato · Ebook y 3 Bonos incluidos
        </p>
      </div>
    </section>
  );
};
