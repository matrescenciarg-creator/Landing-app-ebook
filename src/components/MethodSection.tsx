import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { METHOD_PILLARS } from '../data/signalsData';

interface MethodSectionProps {
  onOpenEbookPreview: () => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const MethodSection: React.FC<MethodSectionProps> = ({
  onOpenEbookPreview,
  onOpenCheckout,
  isUnlocked
}) => {
  return (
    <section id="sobre-el-metodo" className="py-20 bg-[#fdfaf5] border-t border-[#eeeae4]">
      <div className="container-custom">
        {/* Main 2-column description */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
              Fundamentos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              El Método Vínculo, detrás de la app
            </h2>
            <p className="mt-5 text-[#7a6f65] leading-relaxed text-base">
              El Método Vínculo nació para ayudar a madres y padres a leer el lenguaje real de sus bebés: señales de hambre, sueño, sobreestimulación o simple necesidad de brazos. La app toma esa misma base y la convierte en respuestas rápidas para el momento exacto en que las necesitas.
            </p>
            <p className="mt-4 text-[#7a6f65] leading-relaxed text-base">
              Y no te quedas solo con la app: tu compra incluye también el <strong className="text-[#3d3229] font-semibold">ebook completo del Método Vínculo</strong>, donde se aborda en profundidad el sueño de tu bebé y el resto de las señales que la app te ayuda a interpretar en el momento.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenEbookPreview}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3d3229] bg-white border border-[#eeeae4] hover:border-[#d47e62] px-6 py-3 rounded-2xl transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#d47e62]" />
                <span>Explorar capítulos del Ebook</span>
              </button>
            </div>
          </div>

          {/* Special Sleek Highlight Card */}
          <div className="rounded-[32px] p-8 md:p-10 text-center relative overflow-hidden bg-white border border-[#eeeae4] shadow-sm">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#c8d6ba]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#f8f1e9] rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] mx-auto mb-4 flex items-center justify-center text-3xl shadow-xs">
                📖
              </div>
              <p className="text-xs uppercase tracking-widest font-bold text-[#d47e62] mb-2">
                Incluido en tu acceso
              </p>
              <h3 className="text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                App + Ebook Completo
              </h3>
              <p className="mt-2 text-sm text-[#7a6f65]">
                Método Vínculo — by Matrescencia
              </p>

              <div className="mt-6 pt-6 border-t border-[#eeeae4] flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#3d3229]">
                <span className="flex items-center gap-1.5 bg-[#f4f1ec] px-3 py-1.5 rounded-full border border-[#eeeae4]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#688a4d]" /> 5 Capítulos completos
                </span>
                <span className="flex items-center gap-1.5 bg-[#f4f1ec] px-3 py-1.5 rounded-full border border-[#eeeae4]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#688a4d]" /> + 3 Bonos de regalo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#7a6f65] mb-6">
            Los 4 Pilares del Método Vínculo
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {METHOD_PILLARS.map((p, idx) => (
              <div key={idx} className="rounded-[28px] p-6 bg-white border border-[#eeeae4] shadow-xs flex flex-col justify-between hover:border-[#d47e62]/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-[#f4f1ec] border border-[#eeeae4] flex items-center justify-center text-xs font-bold text-[#d47e62]" style={{ fontFamily: 'Georgia, serif' }}>
                      0{p.step}
                    </span>
                    <span className="text-[11px] text-[#688a4d] font-semibold bg-[#c8d6ba]/30 border border-[#c8d6ba] px-2 py-0.5 rounded-full">
                      Pilar
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#3d3229] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {p.title}
                  </h4>
                  <p className="text-xs font-semibold text-[#d47e62] mb-2.5">
                    {p.subtitle}
                  </p>
                  <p className="text-xs text-[#7a6f65] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
