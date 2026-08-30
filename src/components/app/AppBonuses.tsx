import React, { useState } from 'react';
import { BONUSES_DATA } from '../../data/ebookData';
import { Sparkles, Lock, CheckCircle2, Heart, Download, Printer, ChevronRight, ShieldCheck } from 'lucide-react';
import { BonusResource } from '../../types';

interface AppBonusesProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
}

export const AppBonuses: React.FC<AppBonusesProps> = ({ isUnlocked, onOpenCheckout }) => {
  const [selectedBonusId, setSelectedBonusId] = useState<string>('bono-lactancia');
  const selectedBonus = BONUSES_DATA.find((b) => b.id === selectedBonusId) || BONUSES_DATA[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-white via-[#fdfaf5] to-[#f4f1ec] border border-[#eeeae4] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa745]/15 border border-[#dfa745]/30 text-[#dfa745] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 Bonos Exclusivos Incluidos en tu Acceso</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              Guías Prácticas & Recursos de Acompañamiento
            </h2>
            <p className="text-sm text-[#7a6f65] max-w-xl">
              Diseñadas para complementar el Método Vínculo con herramientas directas para tu lactancia, tu bienestar físico y el registro de tu bebé.
            </p>
          </div>

          {!isUnlocked && (
            <button
              onClick={onOpenCheckout}
              className="px-5 py-3 rounded-2xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            >
              Desbloquear Suite Completa ($10 USD)
            </button>
          )}
        </div>
      </div>

      {/* Bonus Selector Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {BONUSES_DATA.map((bonus) => {
          const isSelected = selectedBonusId === bonus.id;
          return (
            <div
              key={bonus.id}
              onClick={() => setSelectedBonusId(bonus.id)}
              className={`p-5 rounded-[28px] border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-white border-[#d47e62] shadow-md ring-2 ring-[#d47e62]/20'
                  : 'bg-white border-[#eeeae4] hover:border-[#d47e62]/40 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex items-center justify-center text-2xl shadow-xs">
                  {bonus.emoji}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f4f1ec] text-[#7a6f65]">
                  Bono #{bonus.number}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#3d3229] mb-1">
                  {bonus.title}
                </h3>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  {bonus.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-[#f4f1ec] flex items-center justify-between text-[11px] font-bold text-[#d47e62]">
                <span>{isSelected ? '● Seleccionado' : 'Ver contenido'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Bonus Detail View */}
      <div className="p-6 md:p-8 rounded-[32px] bg-white border border-[#eeeae4] shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeae4] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex items-center justify-center text-2xl">
              {selectedBonus.emoji}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#d47e62] tracking-wider">
                Bono #{selectedBonus.number}
              </span>
              <h3 className="text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                {selectedBonus.title}
              </h3>
            </div>
          </div>

          {selectedBonus.id === 'bono-bitacora' && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-[#688a4d] text-white hover:bg-[#5a7942] text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Plantilla A4</span>
            </button>
          )}
        </div>

        {/* Bonus 1 Specific Content */}
        {selectedBonus.id === 'bono-lactancia' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Step by step deep latch */}
              <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <h4 className="text-sm font-bold text-[#3d3229] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#d47e62] text-white flex items-center justify-center text-xs">1</span>
                  Técnica del Agarre Asimétrico (Cero Dolor)
                </h4>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  El dolor en los pezones no es normal ni algo que "haya que aguantar". Sigue estos tres pasos para lograr un agarre profundo:
                </p>
                <ul className="space-y-2 text-xs text-[#3d3229]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d47e62] font-bold">1.</span>
                    <span><strong>Alineación nariz-pezón:</strong> Coloca la nariz del bebé apuntando a tu pezón, nunca directo a su boca. Esto le obligará a extender el cuello y abrir grande la boca.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d47e62] font-bold">2.</span>
                    <span><strong>Mentón pegado al pecho:</strong> El mentón debe clavarse primero en la parte inferior de la areola antes de que la nariz toque el pecho.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d47e62] font-bold">3.</span>
                    <span><strong>Labios evertidos:</strong> Ambos labios deben quedar hacia afuera como una flor ("boca de pez").</span>
                  </li>
                </ul>
              </div>

              {/* Troubleshooting */}
              <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <h4 className="text-sm font-bold text-[#3d3229] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#dfa745] text-white flex items-center justify-center text-xs">2</span>
                  Solucionador Rápido de Molestias
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                    <p className="font-bold text-[#3d3229]">¿Sientes que te muerde o pellizca?</p>
                    <p className="text-[#7a6f65] mt-0.5">Rompe el vacío metiendo tu dedo meñique limpio por la comisura de sus labios antes de retirarlo. Nunca tires hacia atrás.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                    <p className="font-bold text-[#3d3229]">¿Pechos duros o congestión?</p>
                    <p className="text-[#7a6f65] mt-0.5">Aplica compresión suave en flor alrededor de la areola durante 1 minuto antes de prenderlo para ablandar el tejido.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bonus 2 Specific Content */}
        {selectedBonus.id === 'bono-vuelta-cuerpo' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <h4 className="text-sm font-bold text-[#3d3229] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#688a4d] text-white flex items-center justify-center text-xs">1</span>
                  Reconexión Diafragmática y Postura
                </h4>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  Durante el embarazo tus costillas se expandieron y la faja abdominal cedió. La primera semana de recuperación no requiere abdominales, sino respiración restauradora.
                </p>
                <div className="space-y-2 text-xs text-[#3d3229]">
                  <p><strong>Rutina de 3 minutos diarios:</strong></p>
                  <p className="text-[#7a6f65]">Acuéstate boca arriba con rodillas flexionadas. Coloca una mano en tus costillas y otra en tu bajo vientre. Inhala expandiendo tus costillas en 360 grados sin inflar bruscamente el abdomen. Exhala emitiendo un sonido "Sss" suave mientras sientes cómo el suelo pélvico se eleva sutilmente.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <h4 className="text-sm font-bold text-[#3d3229] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#dfa745] text-white flex items-center justify-center text-xs">2</span>
                  Límites y Gestión de la Energía
                </h4>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  El posparto es un período sagrado de reposo. Proteger tu tranquilidad reduce drásticamente el cortisol y favorece la eyección de leche por oxitocina.
                </p>
                <div className="p-3 rounded-xl bg-white border border-[#eeeae4] text-xs text-[#7a6f65] space-y-1">
                  <p className="font-bold text-[#3d3229]">Frase escudo sugerida para visitas:</p>
                  <p className="italic">"Estamos adaptándonos al ritmo de sueño del bebé en el cuarto trimestre. Te avisaremos con amor cuando tengamos un espacio para recibirte."</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bonus 3 Specific Content */}
        {selectedBonus.id === 'bono-bitacora' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-4">
              <h4 className="text-sm font-bold text-[#3d3229]">
                Plantilla Semanal de Seguimiento Lista para Imprimir
              </h4>
              <p className="text-xs text-[#7a6f65] leading-relaxed">
                Diseñada con cuadrículas de alta legibilidad para pegar en el refrigerador o llevar a las consultas con el pediatra.
              </p>

              {/* Printable mock preview */}
              <div className="p-4 rounded-xl bg-white border border-[#eeeae4] shadow-xs text-xs space-y-3 font-mono">
                <div className="flex justify-between border-b pb-2">
                  <span>MÉTODO VÍNCULO · BITÁCORA SEMANAL</span>
                  <span>FECHA: _________</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] font-bold text-[#7a6f65]">
                  <span>HORA</span>
                  <span>TOMA (PECHO/BIB)</span>
                  <span>SIESTA / DESPIERTO</span>
                  <span>SEÑAL / PAÑAL</span>
                </div>
                <div className="space-y-1.5 text-[10px] text-[#7a6f65]">
                  <div className="grid grid-cols-4 gap-2 border-b border-dashed py-1">
                    <span>08:00 AM</span>
                    <span>Pecho Izq (15 min)</span>
                    <span>Despierto (Ventana 60m)</span>
                    <span>Sonido Neh / Pañal Mojado</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 border-b border-dashed py-1">
                    <span>09:15 AM</span>
                    <span>-</span>
                    <span>Siesta 1 (45 min)</span>
                    <span>Sonido Owh / Ojos frotados</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 border-b border-dashed py-1">
                    <span>11:00 AM</span>
                    <span>Pecho Der (20 min)</span>
                    <span>Despierto</span>
                    <span>Sonido Eh (Eructo liberado)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Highlights Checklist */}
        <div className="pt-4 border-t border-[#eeeae4] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a6f65]">
            Lo que incluye este recurso:
          </h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {selectedBonus.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#3d3229]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#688a4d] shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
