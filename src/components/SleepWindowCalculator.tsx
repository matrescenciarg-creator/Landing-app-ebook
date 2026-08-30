import React, { useState } from 'react';
import { WAKE_WINDOWS_DATA } from '../data/signalsData';
import { Moon, Clock, Sparkles, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface SleepWindowCalculatorProps {
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const SleepWindowCalculator: React.FC<SleepWindowCalculatorProps> = ({
  onOpenCheckout,
  isUnlocked
}) => {
  const [selectedAgeIndex, setSelectedAgeIndex] = useState<number>(1); // Default ~1-2 months
  const [lastWakeTime, setLastWakeTime] = useState<string>('09:30');
  const [calculatedNapTarget, setCalculatedNapTarget] = useState<string>('10:45');

  const currentWindow = WAKE_WINDOWS_DATA[selectedAgeIndex];

  const handleWakeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLastWakeTime(val);
    if (!val) return;

    try {
      const [hours, minutes] = val.split(':').map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(hours, minutes, 0, 0);

      // Average minutes for index
      const avgMinutes = [45, 75, 95, 135, 180, 210][selectedAgeIndex] || 75;
      const nextNap = new Date(wakeDate.getTime() + avgMinutes * 60000);
      const nextH = nextNap.getHours().toString().padStart(2, '0');
      const nextM = nextNap.getMinutes().toString().padStart(2, '0');
      setCalculatedNapTarget(`${nextH}:${nextM}`);
    } catch (err) {
      // ignore
    }
  };

  const handleAgeChange = (index: number) => {
    setSelectedAgeIndex(index);
    if (lastWakeTime) {
      const [hours, minutes] = lastWakeTime.split(':').map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(hours, minutes, 0, 0);
      const avgMinutes = [45, 75, 95, 135, 180, 210][index] || 75;
      const nextNap = new Date(wakeDate.getTime() + avgMinutes * 60000);
      const nextH = nextNap.getHours().toString().padStart(2, '0');
      const nextM = nextNap.getMinutes().toString().padStart(2, '0');
      setCalculatedNapTarget(`${nextH}:${nextM}`);
    }
  };

  return (
    <section id="ventanas-sueno" className="py-16 md:py-24 bg-[#fffdfb] border-t border-[#eeeae4]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d4a34b] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
            Guía de Sueño Infantil
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            Calculadora de Ventanas de Sueño
          </h2>
          <p className="mt-3 text-base text-[#7a6f65]">
            Reconoce cuándo acostar a tu bebé antes de que el sobrecansancio active cortisol y dificulte el descanso.
          </p>
        </div>

        {/* Age Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {WAKE_WINDOWS_DATA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleAgeChange(idx)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedAgeIndex === idx
                  ? 'bg-[#d47e62] text-white shadow-xs'
                  : 'bg-white text-[#7a6f65] border border-[#eeeae4] hover:border-[#d47e62] hover:text-[#3d3229]'
              }`}
            >
              {item.ageRange}
            </button>
          ))}
        </div>

        {/* Interactive Calculation Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Column: Quick Time Calculator */}
          <div className="lg:col-span-5 rounded-[32px] p-6 md:p-8 bg-white border border-[#eeeae4] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#f4f1ec] border border-[#eeeae4] flex items-center justify-center text-[#d4a34b]">
                  <Clock className="w-5 h-5 text-[#d4a34b]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                    Calcula la próxima siesta
                  </h3>
                  <p className="text-xs text-[#7a6f65]">Para: {currentWindow.ageRange}</p>
                </div>
              </div>

              <div className="space-y-4 my-6">
                <div>
                  <label className="block text-xs font-bold text-[#3d3229] uppercase tracking-wider mb-2">
                    ¿A qué hora despertó tu bebé?
                  </label>
                  <input
                    type="time"
                    value={lastWakeTime}
                    onChange={handleWakeTimeChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#eeeae4] bg-[#fdfaf5] font-semibold text-lg text-[#3d3229] focus:outline-none focus:border-[#d47e62]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4]">
                  <p className="text-xs font-medium text-[#7a6f65]">
                    Ventana óptima de vigilia:
                  </p>
                  <p className="text-xl font-bold text-[#d47e62] mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                    {currentWindow.wakeWindowMinutes}
                  </p>
                  <p className="text-xs text-[#7a6f65] mt-1">
                    Número de siestas diarias recomendadas: <strong className="text-[#3d3229]">{currentWindow.napsPerDay}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#eeeae4] bg-[#fdfaf5] -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 rounded-b-[32px] text-center border-b border-x border-[#eeeae4]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#688a4d]">
                🎯 Hora ideal para iniciar ritual de sueño:
              </span>
              <p className="text-3xl font-bold text-[#3d3229] mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                {calculatedNapTarget} hrs
              </p>
              <p className="text-[11px] text-[#7a6f65] mt-1">
                Comienza a bajar estímulos y luces 10 min antes
              </p>
            </div>
          </div>

          {/* Right Column: Early vs Late Sleep Cues */}
          <div className="lg:col-span-7 rounded-[32px] p-6 md:p-8 bg-white border border-[#eeeae4] shadow-xs flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#688a4d] bg-[#c8d6ba]/30 border border-[#c8d6ba] px-3 py-1 rounded-full">
                  Semáforo de Señales de Sueño
                </span>
                <Moon className="w-5 h-5 text-[#d4a34b]" />
              </div>

              {/* Early cues (Green) */}
              <div className="p-4 rounded-2xl bg-[#c8d6ba]/15 border border-[#c8d6ba]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#688a4d]" />
                  <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider">
                    Señales Tempranas (Momento ideal para acostar)
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-[#3d3229]">
                  {currentWindow.earlySleepCues.map((cue, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#688a4d] shrink-0" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Late cues (Red / Overtired) */}
              <div className="p-4 rounded-2xl bg-[#d47e62]/10 border border-[#d47e62]/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d47e62]" />
                  <p className="text-xs font-bold text-[#d47e62] uppercase tracking-wider">
                    Señales Tardías (Sobrecansancio — Requiere contención)
                  </p>
                </div>
                <ul className="space-y-1.5 text-xs text-[#3d3229]">
                  {currentWindow.lateSleepCues.map((cue, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#d47e62] shrink-0" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expert Advice */}
              <div className="p-4 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4]">
                <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4a34b]" />
                  Consejo del Método Vínculo:
                </p>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  {currentWindow.expertAdvice}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#eeeae4] flex items-center justify-between text-xs text-[#7a6f65]">
              <span>Capítulo 3 del Ebook incluye el mapa completo de siestas.</span>
              <a href="#precio" className="font-semibold text-[#d47e62] hover:underline">
                Ver oferta $10 →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
