import React from 'react';
import { BONUSES_DATA } from '../data/ebookData';
import { BonusResource } from '../types';
import { Check, Eye } from 'lucide-react';

interface BonusesSectionProps {
  onOpenBonusModal: (bonus: BonusResource) => void;
  onOpenCheckout: () => void;
  onOpenBitacora: () => void;
  isUnlocked: boolean;
}

export const BonusesSection: React.FC<BonusesSectionProps> = ({
  onOpenBonusModal,
  onOpenCheckout,
  onOpenBitacora,
  isUnlocked
}) => {
  return (
    <section id="bonos" className="py-20 bg-[#fdfaf5] border-t border-[#eeeae4]">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
            Solo por hoy · Incluido con tu acceso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            3 bonos incluidos con tu compra
          </h2>
          <p className="mt-3 text-[#7a6f65] text-base">
            Además de la app, te llevas estos recursos para acompañar los primeros meses con calma y seguridad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {BONUSES_DATA.map((bonus) => (
            <div 
              key={bonus.id} 
              className="rounded-[28px] p-7 bg-white border border-[#eeeae4] flex flex-col justify-between shadow-xs hover:border-[#d47e62]/40 transition-all relative overflow-hidden"
            >
              <div>
                <div 
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-[#eeeae4]" 
                  style={{
                    backgroundColor: bonus.number === 1 ? '#f8f1e9' : bonus.number === 2 ? '#fdf8ec' : '#f0f5eb'
                  }}
                >
                  {bonus.emoji}
                </div>

                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#d47e62] mb-1.5">
                    Bono {bonus.number}
                  </p>
                  <h3 className="text-lg font-bold text-[#3d3229] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {bonus.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#688a4d] mb-3">
                    {bonus.subtitle}
                  </p>
                  <p className="text-xs text-[#7a6f65] leading-relaxed mb-5">
                    {bonus.description}
                  </p>
                </div>

                {/* Highlights preview */}
                <div className="bg-[#fdfaf5] rounded-2xl p-4 border border-[#eeeae4] mb-6">
                  <p className="text-[11px] font-bold text-[#3d3229] uppercase tracking-wider mb-2.5">
                    Lo que incluye:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#3d3229]">
                    {bonus.highlights.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#688a4d] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#eeeae4] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (bonus.id === 'bono-bitacora') {
                      onOpenBitacora();
                    } else {
                      onOpenBonusModal(bonus);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-[#3d3229] bg-[#f4f1ec] hover:bg-[#eae5dd] border border-[#eeeae4] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d47e62]" />
                  <span>{bonus.id === 'bono-bitacora' ? 'Abrir Bitácora Digital' : 'Ver Detalles del Bono'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner note */}
        <div className="mt-12 max-w-xl mx-auto text-center p-4 rounded-2xl bg-white border border-[#eeeae4] shadow-xs">
          <p className="text-xs text-[#7a6f65]">
            🎁 <strong className="text-[#3d3229]">Sin costes ocultos:</strong> Todos los bonos se desbloquean inmediatamente al adquirir la app por <strong className="text-[#3d3229]">$10 USD</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};
