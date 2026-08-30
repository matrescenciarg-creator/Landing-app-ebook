import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

interface PricingSectionProps {
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenCheckout,
  isUnlocked
}) => {
  return (
    <section id="precio" className="py-20 bg-[#fffdfb] border-t border-[#eeeae4]">
      <div className="container-custom max-w-xl">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
            Inversión única en tu tranquilidad
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            Empieza a entender a tu bebé hoy
          </h2>
        </div>

        <div className="rounded-[36px] p-8 sm:p-12 text-center shadow-md bg-white border border-[#eeeae4] relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#c8d6ba]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#f8f1e9] rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#fff9f7] border border-[#d47e62]/30 px-3.5 py-1 rounded-full mb-4">
              Acceso Completo + Ebook + Bonos
            </span>

            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>$</span>
              <span className="text-6xl sm:text-7xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>10</span>
              <span className="text-sm font-semibold text-[#7a6f65] ml-1">USD</span>
            </div>

            <p className="text-sm font-medium text-[#7a6f65] mb-8">
              Pago único · Sin suscripción ni cuotas recurrentes
            </p>

            <ul className="text-left text-sm space-y-3.5 mb-9 max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span className="text-[#3d3229] font-medium">Acceso completo e ilimitado a la app Método Vínculo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span className="text-[#3d3229] font-medium">Ebook completo Método Vínculo (incluye guía profunda de sueño)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span className="text-[#3d3229] font-medium">Traductor de 5 reflejos vocales y gestos corporales</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span className="text-[#3d3229] font-medium">Protocolos de respuesta inmediata y sintetizador de calma</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                <span className="text-[#3d3229] font-medium">Calculadora de ventanas de vigilia y semáforo de sueño</span>
              </li>
              
              {/* Bonuses highlighted */}
              <li className="flex items-start gap-3 pt-3 border-t border-[#eeeae4]">
                <span className="text-base shrink-0">🎁</span>
                <span className="text-[#3d3229] font-semibold">Bono 1: Guía completa de lactancia materna</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base shrink-0">🎁</span>
                <span className="text-[#3d3229] font-semibold">Bono 2: Guía Vuelta al Cuerpo & Autocuidado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base shrink-0">🎁</span>
                <span className="text-[#3d3229] font-semibold">Bono 3: Bitácora interactiva y digital de patrones</span>
              </li>
            </ul>

            {isUnlocked ? (
              <div className="bg-[#c8d6ba]/25 border border-[#c8d6ba] rounded-2xl p-4 mb-4 text-[#3d3229] font-semibold text-sm">
                ✨ ¡Ya tienes acceso completo activo! Disfruta de la app, el ebook y todos los bonos.
              </div>
            ) : (
              <button
                id="pricing-checkout-btn"
                onClick={onOpenCheckout}
                className="w-full text-center font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white px-8 py-4.5 rounded-2xl text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Quiero la app por $10 USD
              </button>
            )}

            <div className="mt-5 flex items-center justify-center gap-4 text-xs text-[#7a6f65]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#688a4d]" /> Compra 100% segura
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#d4a34b]" /> Acceso inmediato
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
