import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Moon, Wind, Heart, CloudRain, Music, Clock, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface AppCalmCenterProps {
  onLogCalmAction?: (soundName: string, minutes: number) => void;
}

export const AppCalmCenter: React.FC<AppCalmCenterProps> = ({ onLogCalmAction }) => {
  const [activeSound, setActiveSound] = useState<'shhh' | 'womb' | 'heartbeat' | 'rain' | 'lullaby' | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [breathePhase, setBreathePhase] = useState<'inhala' | 'sosten' | 'exhala'>('inhala');
  const [breatheSeconds, setBreatheSeconds] = useState<number>(4);

  // Sound selection handler
  const handleToggleSound = (soundType: 'shhh' | 'womb' | 'heartbeat' | 'rain' | 'lullaby') => {
    if (activeSound === soundType && isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setActiveSound(null);
    } else {
      soundEngine.startSound(soundType, volume);
      setActiveSound(soundType);
      setIsPlaying(true);
    }
  };

  const handleStopAll = () => {
    soundEngine.stop();
    setIsPlaying(false);
    setActiveSound(null);
    setTimerMinutes(null);
    setRemainingSeconds(null);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  // Timer countdown
  useEffect(() => {
    if (!timerMinutes || !isPlaying) {
      setRemainingSeconds(null);
      return;
    }
    setRemainingSeconds(timerMinutes * 60);

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          handleStopAll();
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMinutes, isPlaying]);

  // Breathing pacer animation (4-4-4 box calming rhythm for mother)
  useEffect(() => {
    const cycle = setInterval(() => {
      setBreathePhase((current) => {
        if (current === 'inhala') return 'sosten';
        if (current === 'sosten') return 'exhala';
        return 'inhala';
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const SOUND_OPTIONS = [
    {
      id: 'shhh',
      title: 'Sonido "Shhh" Rítmico',
      description: 'El sonido biológico universal que activa el reflejo de calma.',
      icon: Wind,
      color: 'bg-[#d47e62]/10 border-[#d47e62]/30 text-[#d47e62]',
      activeColor: 'bg-[#d47e62] text-white shadow-md'
    },
    {
      id: 'womb',
      title: 'Ruido Blanco Uterino',
      description: 'Sonido profundo que recrea el flujo sanguíneo de la placenta.',
      icon: Moon,
      color: 'bg-[#dfa745]/10 border-[#dfa745]/30 text-[#dfa745]',
      activeColor: 'bg-[#dfa745] text-white shadow-md'
    },
    {
      id: 'heartbeat',
      title: 'Latido Cardíaco Materno',
      description: 'Ritmo fisiológico de 65 BPM para sincronización cardíaca.',
      icon: Heart,
      color: 'bg-rose-50 border-rose-200 text-rose-600',
      activeColor: 'bg-rose-500 text-white shadow-md'
    },
    {
      id: 'rain',
      title: 'Lluvia Suave Continua',
      description: 'Frecuencias constantes que bloquean ruidos repentinos de la casa.',
      icon: CloudRain,
      color: 'bg-[#c8d6ba]/30 border-[#c8d6ba] text-[#688a4d]',
      activeColor: 'bg-[#688a4d] text-white shadow-md'
    },
    {
      id: 'lullaby',
      title: 'Canción de Cuna Suave',
      description: 'Caja musical pentatónica suave sin percusión agresiva.',
      icon: Music,
      color: 'bg-[#f4f1ec] border-[#eeeae4] text-[#3d3229]',
      activeColor: 'bg-[#3d3229] text-white shadow-md'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero card of Calm Center */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-white via-[#fdfaf5] to-[#f4f1ec] border border-[#eeeae4] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#3d3229] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#688a4d]" />
              <span>Generador Biológico de Calma · Sin anuncios ni cortes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              Centro de Calma & Ruido Blanco
            </h2>
            <p className="text-sm text-[#7a6f65] max-w-xl">
              Utiliza el sintetizador de frecuencias maternas en tiempo real para activar el sistema parasimpático de tu bebé y acompañar el arrullo.
            </p>
          </div>

          {/* Quick status & Stop button */}
          {isPlaying && (
            <div className="p-4 rounded-2xl bg-white border border-[#eeeae4] shadow-xs flex items-center gap-4 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#688a4d] animate-ping" />
              <div>
                <p className="text-xs font-bold text-[#3d3229]">
                  Reproduciendo sonido
                </p>
                <p className="text-[11px] text-[#7a6f65]">
                  {remainingSeconds !== null ? `Apagado en: ${formatTimer(remainingSeconds)}` : 'Sonido continuo'}
                </p>
              </div>
              <button
                onClick={handleStopAll}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Detener sonido"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          )}
        </div>

        {/* Master Controls: Volume and Sleep Timers */}
        <div className="mt-6 pt-6 border-t border-[#eeeae4] grid sm:grid-cols-2 gap-4 items-center">
          {/* Volume slider */}
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#eeeae4]">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#7a6f65] shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#d47e62] shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-bold text-[#3d3229] mb-1">
                <span>Volumen</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#eeeae4] rounded-lg appearance-none cursor-pointer accent-[#d47e62]"
              />
            </div>
          </div>

          {/* Sleep Timer Preset Buttons */}
          <div className="flex items-center gap-2 bg-white p-3.5 rounded-2xl border border-[#eeeae4]">
            <Clock className="w-4 h-4 text-[#7a6f65] shrink-0" />
            <span className="text-[11px] font-bold text-[#3d3229] shrink-0">Apagado auto:</span>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setTimerMinutes(timerMinutes === mins ? null : mins)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    timerMinutes === mins
                      ? 'bg-[#d47e62] text-white shadow-xs'
                      : 'bg-[#f4f1ec] text-[#3d3229] hover:bg-[#eae5dd]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sound Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOUND_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isThisPlaying = activeSound === item.id && isPlaying;

          return (
            <div
              key={item.id}
              onClick={() => handleToggleSound(item.id as any)}
              className={`p-5 rounded-[28px] border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isThisPlaying
                  ? 'bg-white border-[#d47e62] shadow-md ring-2 ring-[#d47e62]/20'
                  : 'bg-white border-[#eeeae4] hover:border-[#d47e62]/40 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${isThisPlaying ? item.activeColor : item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isThisPlaying
                      ? 'bg-[#d47e62] text-white shadow-xs scale-105'
                      : 'bg-[#f4f1ec] text-[#3d3229] hover:bg-[#d47e62] hover:text-white'
                  }`}
                >
                  {isThisPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#3d3229] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#f4f1ec] flex items-center justify-between text-[11px]">
                <span className="text-[#7a6f65]">
                  {isThisPlaying ? '● Activo ahora' : 'Listo para reproducir'}
                </span>
                <span className="font-bold text-[#d47e62]">
                  {isThisPlaying ? 'Tocar para pausar' : 'Tocar para activar'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maternal Corregulation Breathing Bubble */}
      <div className="p-6 md:p-8 rounded-[32px] bg-white border border-[#eeeae4] shadow-xs">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47e62]">
              Paso 1 del Método Vínculo · Corregulación Materna
            </span>
            <h3 className="text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              Guía de Respiración Rítmica para Mamá
            </h3>
            <p className="text-xs text-[#7a6f65] leading-relaxed">
              El sistema nervioso del recién nacido es inmaduro; no puede calmarse solo. Regula tu propia respiración primero para que su ritmo cardíaco disminuya al estar pegado a tu pecho.
            </p>
            <div className="p-3.5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-xs text-[#3d3229] space-y-1">
              <p className="font-bold">💡 Consejo Práctico de la Dra.:</p>
              <p className="text-[#7a6f65]">
                Sostén a tu bebé contra tu pecho izquierdo (sobre tu corazón) mientras sigues este ciclo de respiración durante 2 minutos.
              </p>
            </div>
          </div>

          {/* Animated Visual Breathing Pacer */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] min-h-[220px]">
            <div
              className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-3000 ease-in-out shadow-inner ${
                breathePhase === 'inhala'
                  ? 'scale-115 border-[#d47e62] bg-[#d47e62]/15 text-[#d47e62]'
                  : breathePhase === 'sosten'
                  ? 'scale-115 border-[#dfa745] bg-[#dfa745]/15 text-[#dfa745]'
                  : 'scale-90 border-[#688a4d] bg-[#688a4d]/15 text-[#688a4d]'
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-widest">
                {breathePhase === 'inhala' && 'Inhala'}
                {breathePhase === 'sosten' && 'Sostén'}
                {breathePhase === 'exhala' && 'Exhala'}
              </span>
              <span className="text-[11px] opacity-75 font-medium mt-0.5">
                {breathePhase === 'inhala' && 'Por la nariz'}
                {breathePhase === 'sosten' && 'En calma'}
                {breathePhase === 'exhala' && 'Por la boca'}
              </span>
            </div>
            <p className="text-xs text-[#7a6f65] mt-4 font-medium">
              Sincronizando ritmo biológico de 4 segundos
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
