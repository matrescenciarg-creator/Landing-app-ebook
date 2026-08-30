import React, { useState, useEffect, useRef } from 'react';
import { SIGNALS_DATABASE } from '../data/signalsData';
import { SignalItem } from '../types';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  ArrowRight,
  BookmarkPlus,
  Play,
  RotateCcw,
  Baby,
  Eye,
  Info
} from 'lucide-react';

interface InteractiveDecoderProps {
  onLogSignal?: (signal: SignalItem) => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const InteractiveDecoder: React.FC<InteractiveDecoderProps> = ({
  onLogSignal,
  onOpenCheckout,
  isUnlocked
}) => {
  const [selectedSignalId, setSelectedSignalId] = useState<string>('neh-hambre');
  const [activeTab, setActiveTab] = useState<'sounds' | 'gestures'>('sounds');
  const [selectedGestures, setSelectedGestures] = useState<string[]>([]);
  const [isPlayingCalmSound, setIsPlayingCalmSound] = useState<boolean>(false);
  const [calmSoundType, setCalmSoundType] = useState<'shhh' | 'heartbeat' | 'whitenoise'>('shhh');
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<any>(null);

  const currentSignal = SIGNALS_DATABASE.find(s => s.id === selectedSignalId) || SIGNALS_DATABASE[0];

  // Gestures list for multi-select matching
  const gestureOptions = [
    { id: 'chupa-manos', label: 'Se chupa las manos o puños', matches: ['neh-hambre'] },
    { id: 'gira-pecho', label: 'Gira la cabeza buscando con la boca', matches: ['neh-hambre'] },
    { id: 'bostezo-cejas', label: 'Bostezos o cejas enrojecidas', matches: ['owh-sueno'] },
    { id: 'frota-ojos', label: 'Se frota los ojos u orejas', matches: ['owh-sueno'] },
    { id: 'piernas-arriba', label: 'Flexiona piernas al abdomen con fuerza', matches: ['eairh-gases'] },
    { id: 'cara-roja-pujo', label: 'Cara roja y quejido al pujar', matches: ['eairh-gases'] },
    { id: 'arquea-espalda', label: 'Arquea la espalda tras comer', matches: ['eh-eructo', 'eairh-gases'] },
    { id: 'evita-mirada', label: 'Gira la cara evitando mirar estímulos', matches: ['sobreestimulacion', 'owh-sueno'] },
    { id: 'calma-brazos', label: 'Se calma de inmediato en brazos', matches: ['necesidad-contacto'] },
    { id: 'inquieto-nuca', label: 'Inquietud física / nuca sudada o pañal', matches: ['heh-incomodidad'] }
  ];

  const handleToggleGesture = (gestureId: string) => {
    let updated: string[];
    if (selectedGestures.includes(gestureId)) {
      updated = selectedGestures.filter(g => g !== gestureId);
    } else {
      updated = [...selectedGestures, gestureId];
    }
    setSelectedGestures(updated);

    // Auto calculate best matching signal
    if (updated.length > 0) {
      const counts: Record<string, number> = {};
      updated.forEach(gId => {
        const option = gestureOptions.find(o => o.id === gId);
        option?.matches.forEach(sId => {
          counts[sId] = (counts[sId] || 0) + 1;
        });
      });

      let topSignalId = selectedSignalId;
      let maxCount = -1;
      Object.entries(counts).forEach(([sId, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topSignalId = sId;
        }
      });
      setSelectedSignalId(topSignalId);
    }
  };

  const handleResetGestures = () => {
    setSelectedGestures([]);
    setSelectedSignalId('neh-hambre');
  };

  // Web Audio Synthesizer for maternal soothing sounds (Shhh, Uterine Heartbeat, White Noise)
  const stopCalmingAudio = () => {
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.stop();
        soundNodeRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      soundNodeRef.current = null;
    }
    setIsPlayingCalmSound(false);
  };

  const startCalmingAudio = (type: 'shhh' | 'heartbeat' | 'whitenoise') => {
    stopCalmingAudio();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 3; // 3 sec loop
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'shhh' || type === 'whitenoise') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink/Brown filter
          lastOut = (lastOut * 0.94) + (white * 0.06);
          // Modulate with rhythmic 'shhh' pulse
          const pulse = type === 'shhh' ? Math.sin((i / ctx.sampleRate) * Math.PI * 1.2) * 0.5 + 0.5 : 0.8;
          data[i] = lastOut * 0.25 * Math.max(0.1, pulse);
        }
      } else {
        // Heartbeat rhythmic thumps (Lub-Dub)
        for (let i = 0; i < bufferSize; i++) {
          const t = (i / ctx.sampleRate) % 1.0; // 60 bpm
          let sample = 0;
          if (t >= 0.0 && t < 0.12) {
            sample = Math.sin(t * Math.PI * 2 * 65) * Math.exp(-t * 25);
          } else if (t >= 0.25 && t < 0.38) {
            const t2 = t - 0.25;
            sample = Math.sin(t2 * Math.PI * 2 * 50) * Math.exp(-t2 * 25) * 0.7;
          }
          data[i] = sample * 0.4;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      soundNodeRef.current = source;
      setIsPlayingCalmSound(true);
      setCalmSoundType(type);
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  };

  useEffect(() => {
    return () => {
      stopCalmingAudio();
    };
  }, []);

  const handleSaveToLog = () => {
    if (onLogSignal) {
      onLogSignal(currentSignal);
      setLoggedNotification(`Señal "${currentSignal.name}" guardada en la bitácora.`);
      setTimeout(() => setLoggedNotification(null), 3000);
    }
  };

  return (
    <section id="traductor-interactivo" className="py-16 md:py-24 bg-[#fdfaf5]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
            Herramienta Interactiva
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            Traductor de Señales en Vivo
          </h2>
          <p className="mt-3 text-base text-[#7a6f65]">
            Selecciona el sonido vocal reflejo o los gestos corporales de tu bebé para recibir una interpretación inmediata y un protocolo de acción paso a paso.
          </p>
        </div>

        {/* Decoder Workspace Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selector controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tab switch */}
            <div className="p-1.5 rounded-2xl flex bg-[#f4f1ec] border border-[#eeeae4]">
              <button
                id="tab-sound-cues-btn"
                onClick={() => setActiveTab('sounds')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'sounds'
                    ? 'bg-[#d47e62] text-white shadow-xs'
                    : 'text-[#7a6f65] hover:text-[#3d3229]'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>5 Sonidos Vocales</span>
              </button>
              <button
                id="tab-gestures-cues-btn"
                onClick={() => setActiveTab('gestures')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'gestures'
                    ? 'bg-[#d47e62] text-white shadow-xs'
                    : 'text-[#7a6f65] hover:text-[#3d3229]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Gestos & Posturas</span>
              </button>
            </div>

            {/* SOUNDS TAB CONTENT */}
            {activeTab === 'sounds' && (
              <div className="bg-white rounded-[28px] p-5 md:p-6 shadow-xs border border-[#eeeae4] space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6f65]">
                    Sonidos biológicos universales
                  </p>
                  <span className="text-[11px] text-[#688a4d] font-semibold">Toca para traducir</span>
                </div>

                <div className="space-y-2">
                  {SIGNALS_DATABASE.map((signal) => {
                    const isSelected = signal.id === selectedSignalId;
                    return (
                      <button
                        key={signal.id}
                        onClick={() => setSelectedSignalId(signal.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#fff9f7] border-[#d47e62] shadow-xs'
                            : 'bg-[#fffdfb] border-[#eeeae4] hover:bg-[#faf7f2] hover:border-[#d47e62]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${
                            isSelected ? 'bg-[#d47e62] text-white' : 'bg-[#f4f1ec] text-[#3d3229]'
                          }`}>
                            {signal.category === 'hambre' && '🍼'}
                            {signal.category === 'sueno' && '🌙'}
                            {signal.category === 'cuerpo' && '🩹'}
                            {signal.category === 'estres' && '⚡'}
                            {signal.category === 'llanto' && '🤍'}
                          </div>
                          <div className="truncate">
                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-[#d47e62]' : 'text-[#3d3229]'}`} style={{ fontFamily: 'Georgia, serif' }}>
                              {signal.name}
                            </p>
                            <p className="text-xs text-[#7a6f65] truncate">
                              {signal.soundCue || signal.description}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          isSelected ? 'bg-[#d47e62] text-white' : 'bg-[#f4f1ec] text-[#7a6f65]'
                        }`}>
                          {signal.confidence}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GESTURES TAB CONTENT */}
            {activeTab === 'gestures' && (
              <div className="bg-white rounded-[28px] p-5 md:p-6 shadow-xs border border-[#eeeae4] space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#7a6f65]">
                    ¿Qué señales físicas ves ahora?
                  </p>
                  {selectedGestures.length > 0 && (
                    <button
                      onClick={handleResetGestures}
                      className="text-xs text-[#d47e62] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" /> Limpiar
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#7a6f65] mb-3">
                  Marca una o más señales corporales para calcular la necesidad más probable:
                </p>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {gestureOptions.map((opt) => {
                    const isChecked = selectedGestures.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleGesture(opt.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                          isChecked
                            ? 'bg-[#fff9f7] border-[#d47e62] text-[#3d3229] font-semibold'
                            : 'bg-[#fffdfb] border-[#eeeae4] text-[#7a6f65] hover:bg-[#faf7f2]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                          isChecked ? 'bg-[#d47e62] border-[#d47e62] text-white' : 'border-[#d5ceC4] bg-white'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="flex-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Audio Calming Helper Module */}
            <div className="bg-[#f4f1ec] rounded-[24px] p-5 border border-[#eeeae4]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎧</span>
                  <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider">
                    Herramienta Sonora de Calma
                  </p>
                </div>
                {isPlayingCalmSound && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#d47e62] bg-[#d47e62]/15 px-2 py-0.5 rounded-full animate-pulse">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7a6f65] mb-3">
                Sonidos sintetizados para regular el sistema nervioso del bebé:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => isPlayingCalmSound && calmSoundType === 'shhh' ? stopCalmingAudio() : startCalmingAudio('shhh')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    isPlayingCalmSound && calmSoundType === 'shhh'
                      ? 'bg-[#d47e62] text-white border-[#d47e62]'
                      : 'bg-white text-[#3d3229] border-[#eeeae4] hover:border-[#d47e62]'
                  }`}
                >
                  {isPlayingCalmSound && calmSoundType === 'shhh' ? 'Detener "Shhh"' : '🔊 Sonido "Shhh"'}
                </button>
                <button
                  onClick={() => isPlayingCalmSound && calmSoundType === 'heartbeat' ? stopCalmingAudio() : startCalmingAudio('heartbeat')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    isPlayingCalmSound && calmSoundType === 'heartbeat'
                      ? 'bg-[#d4a34b] text-white border-[#d4a34b]'
                      : 'bg-white text-[#3d3229] border-[#eeeae4] hover:border-[#d4a34b]'
                  }`}
                >
                  {isPlayingCalmSound && calmSoundType === 'heartbeat' ? 'Detener Latido' : '💓 Latido Uterino'}
                </button>
                <button
                  onClick={() => isPlayingCalmSound && calmSoundType === 'whitenoise' ? stopCalmingAudio() : startCalmingAudio('whitenoise')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    isPlayingCalmSound && calmSoundType === 'whitenoise'
                      ? 'bg-[#688a4d] text-white border-[#688a4d]'
                      : 'bg-white text-[#3d3229] border-[#eeeae4] hover:border-[#688a4d]'
                  }`}
                >
                  {isPlayingCalmSound && calmSoundType === 'whitenoise' ? 'Detener Ruido' : '🌧️ Ruido Rosa'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Diagnostic & Action Plan Result Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#eeeae4] shadow-sm relative overflow-hidden">
              
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#eeeae4]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-3 py-1 rounded-full">
                    Interpretación en Vivo
                  </span>
                  <span className="text-xs text-[#7a6f65] font-medium">
                    Edad: {currentSignal.recommendedAgeMonths || '0-12 meses'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7a6f65]">Precisión:</span>
                  <span className="text-xs font-bold text-[#688a4d] bg-[#c8d6ba]/30 border border-[#c8d6ba] px-2.5 py-0.5 rounded-full">
                    {currentSignal.confidence}% coincidencia
                  </span>
                </div>
              </div>

              {/* Title & Meaning */}
              <div className="my-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] text-[#d47e62] flex items-center justify-center shrink-0 text-2xl font-bold">
                    {currentSignal.category === 'hambre' && '🍼'}
                    {currentSignal.category === 'sueno' && '🌙'}
                    {currentSignal.category === 'cuerpo' && '🌡️'}
                    {currentSignal.category === 'estres' && '💨'}
                    {currentSignal.category === 'llanto' && '🤱'}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                      {currentSignal.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#d47e62] mt-0.5">
                      {currentSignal.meaning}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#7a6f65] leading-relaxed">
                  {currentSignal.description}
                </p>
              </div>

              {/* Physical Cues Checklist */}
              <div className="my-5 bg-[#fffdfb] rounded-[24px] p-5 border border-[#eeeae4]">
                <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#d47e62]" />
                  Señales físicas asociadas:
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 text-xs text-[#3d3229]">
                  {currentSignal.physicalCues.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#eeeae4]">
                      <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Action Guide */}
              <div className="my-5">
                <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4a34b]" />
                  Protocolo de Respuesta Inmediata (3 Pasos):
                </p>
                <div className="space-y-2.5">
                  {currentSignal.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#eeeae4] shadow-2xs">
                      <span className="w-6 h-6 rounded-lg bg-[#d47e62] text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ fontFamily: 'Georgia, serif' }}>
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#3d3229] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vinculo Gold Tip */}
              <div className="my-5 bg-[#f4f1ec] border-l-4 border-[#d47e62] p-4 rounded-r-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-[#d47e62] fill-[#d47e62]" />
                  <p className="text-xs font-bold text-[#3d3229] uppercase tracking-wider">
                    Clave del Método Vínculo
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#7a6f65] italic leading-relaxed">
                  "{currentSignal.vinculoTip}"
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-[#eeeae4] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleSaveToLog}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#3d3229] bg-[#f4f1ec] hover:bg-[#eae5dd] border border-[#eeeae4] px-4 py-2.5 rounded-full transition-all cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-[#d47e62]" />
                  <span>Guardar en mi Bitácora</span>
                </button>

                {loggedNotification && (
                  <span className="text-xs font-semibold text-[#3d3229] bg-[#c8d6ba]/40 border border-[#c8d6ba] px-3 py-1 rounded-full animate-fade-in">
                    ✓ {loggedNotification}
                  </span>
                )}

                {!isUnlocked && (
                  <button
                    onClick={onOpenCheckout}
                    className="bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <span>Desbloquear acceso ilimitado · $10</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
