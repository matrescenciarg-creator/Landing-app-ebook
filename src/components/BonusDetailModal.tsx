import React from 'react';
import { BonusResource } from '../types';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface BonusDetailModalProps {
  bonus: BonusResource | null;
  onClose: () => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const BonusDetailModal: React.FC<BonusDetailModalProps> = ({
  bonus,
  onClose,
  onOpenCheckout,
  isUnlocked
}) => {
  if (!bonus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-white border border-[#eeeae4] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-center text-2xl shadow-xs">
              {bonus.emoji}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-2.5 py-0.5 rounded-full">
                Bono {bonus.number} de Regalo
              </span>
              <h2 className="text-xl font-bold text-[#3d3229] mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                {bonus.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#eeeae4] hover:bg-[#f4f1ec] flex items-center justify-center text-[#3d3229] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex-1 bg-white">
          <p className="text-sm font-semibold text-[#688a4d]">
            {bonus.subtitle}
          </p>
          
          <p className="text-sm text-[#3d3229] leading-relaxed">
            {bonus.description}
          </p>

          <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3d3229] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4a34b]" />
              Contenido detallado incluido en este recurso:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#3d3229]">
              {bonus.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {isUnlocked ? (
            <div className="p-4 rounded-2xl bg-[#c8d6ba]/25 border border-[#c8d6ba] text-center">
              <p className="text-xs font-bold text-[#3d3229] mb-1">
                ✓ Recurso desbloqueado con tu compra
              </p>
              <p className="text-xs text-[#7a6f65]">
                Puedes consultar este recurso en cualquier momento o imprimirlo para tenerlo a mano.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-center">
              <p className="text-xs text-[#7a6f65]">
                Este recurso está incluido 100% gratis al adquirir la app y el Ebook por <strong className="text-[#3d3229]">$10 USD</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-[#eeeae4] bg-white text-xs font-semibold text-[#3d3229] hover:bg-[#f4f1ec] cursor-pointer"
          >
            Cerrar
          </button>

          {!isUnlocked && (
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs px-6 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <span>Obtener con la app · $10 USD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
