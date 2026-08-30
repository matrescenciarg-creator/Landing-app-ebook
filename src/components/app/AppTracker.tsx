import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Clock,
  Heart,
  Moon,
  Baby,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  Calendar,
  Filter,
  Milk,
  Cloud
} from 'lucide-react';
import { LogEntry, LogCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AppTrackerProps {
  entries: LogEntry[];
  onAddEntry: (entry: LogEntry) => Promise<void> | void;
  onDeleteEntry: (id: string) => Promise<void> | void;
  babyName?: string;
}

export const AppTracker: React.FC<AppTrackerProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  babyName = 'Mi Bebé'
}) => {
  const { user, profile } = useAuth();
  const currentBabyName = profile?.babyProfile?.name || babyName || 'Mi Bebé';

  // Active Logger Mode
  const [logCategory, setLogCategory] = useState<LogCategory>('senal');

  // Breastfeeding stopwatch state
  const [isNursing, setIsNursing] = useState<boolean>(false);
  const [activeBreast, setActiveBreast] = useState<'izquierdo' | 'derecho'>('izquierdo');
  const [nursingSeconds, setNursingSeconds] = useState<number>(0);
  const [leftSeconds, setLeftSeconds] = useState<number>(0);
  const [rightSeconds, setRightSeconds] = useState<number>(0);

  // Nap timer state
  const [isNapping, setIsNapping] = useState<boolean>(false);
  const [napSeconds, setNapSeconds] = useState<number>(0);

  // Form Fields
  const [signalType, setSignalType] = useState<string>('Sonido "Neh" (Hambre temprana)');
  const [calmedWith, setCalmedWith] = useState<string>('Pecho / Biberón a demanda');
  const [notes, setNotes] = useState<string>('');
  const [bottleMl, setBottleMl] = useState<string>('90');
  const [diaperType, setDiaperType] = useState<'humedo' | 'sucio' | 'mixto'>('humedo');
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // Nursing stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (isNursing) {
      interval = setInterval(() => {
        setNursingSeconds((prev) => prev + 1);
        if (activeBreast === 'izquierdo') {
          setLeftSeconds((prev) => prev + 1);
        } else {
          setRightSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isNursing, activeBreast]);

  // Nap stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (isNapping) {
      interval = setInterval(() => {
        setNapSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isNapping]);

  const formatSeconds = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinishNursing = () => {
    const totalMinutes = Math.max(1, Math.round(nursingSeconds / 60));
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      babyName: currentBabyName,
      category: 'lactancia',
      signalType: `Lactancia materna (${totalMinutes} min)`,
      durationMinutes: totalMinutes,
      breastSide: leftSeconds > 0 && rightSeconds > 0 ? 'ambos' : activeBreast,
      calmedWith: `Pecho ${activeBreast} (${Math.round(leftSeconds/60)}m izq, ${Math.round(rightSeconds/60)}m der)`,
      notes: notes || 'Toma completada con buen agarre y saciedad.',
      resolved: true
    };
    onAddEntry(newEntry);
    setIsNursing(false);
    setNursingSeconds(0);
    setLeftSeconds(0);
    setRightSeconds(0);
    setNotes('');
  };

  const handleFinishNap = () => {
    const totalMinutes = Math.max(1, Math.round(napSeconds / 60));
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      babyName: currentBabyName,
      category: 'sueno',
      signalType: `Siesta (${totalMinutes} min)`,
      durationMinutes: totalMinutes,
      calmedWith: 'Ritual de sueño en penumbra con ruido blanco',
      notes: notes || 'Despertó tranquilo con energía.',
      resolved: true
    };
    onAddEntry(newEntry);
    setIsNapping(false);
    setNapSeconds(0);
    setNotes('');
  };

  const handleAddQuickEntry = (e: React.FormEvent) => {
    e.preventDefault();
    let name = signalType;
    let calm = calmedWith;

    if (logCategory === 'biberon') {
      name = `Biberón (${bottleMl} ml)`;
      calm = 'Alimentación respetuosa con método Kassing';
    } else if (logCategory === 'panal') {
      const diaperNames = {
        humedo: 'Pañal Mojado (Pipí)',
        sucio: 'Pañal Sucio (Deposición)',
        mixto: 'Pañal Mixto (Pipí + Deposición)'
      };
      name = diaperNames[diaperType];
      calm = 'Cambio de pañal e higiene suave';
    }

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      babyName: currentBabyName,
      category: logCategory,
      signalType: name,
      bottleMl: logCategory === 'biberon' ? Number(bottleMl) : undefined,
      diaperType: logCategory === 'panal' ? diaperType : undefined,
      calmedWith: calm,
      notes: notes || 'Registro completado.',
      resolved: true
    };

    onAddEntry(newEntry);
    setNotes('');
  };

  // Filtered entries
  const filteredEntries = entries.filter((e) => {
    if (filterCategory === 'todos') return true;
    return e.category === filterCategory || (filterCategory === 'senal' && !e.category);
  });

  // Calculate statistics for today
  const feedsCount = entries.filter(e => e.category === 'lactancia' || e.category === 'biberon' || e.signalType.includes('Hambre')).length;
  const napsCount = entries.filter(e => e.category === 'sueno' || e.signalType.includes('Sueño') || e.signalType.includes('Siesta')).length;
  const diapersCount = entries.filter(e => e.category === 'panal').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Stats */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-white via-[#fdfaf5] to-[#f4f1ec] border border-[#eeeae4] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#3d3229] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#688a4d]" />
              <span>Bitácora Digital de {currentBabyName}</span>
              {user && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#688a4d] font-semibold ml-1">
                  <Cloud className="w-3 h-3" /> Nube Sincronizada
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
              Registro Diario de Patrones y Cuidados
            </h2>
            <p className="text-sm text-[#7a6f65] max-w-xl">
              Descubre los ritmos naturales de tu bebé registrando tomas de pecho/biberón, siestas, pañales y señales biológicas observadas.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#f4f1ec] border border-[#eeeae4] text-[#3d3229] text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer transition-all"
              title="Imprimir plantilla o registros en PDF"
            >
              <Printer className="w-4 h-4 text-[#d47e62]" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Quick summary metric cards */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#eeeae4]">
          <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase text-[#7a6f65] flex items-center gap-1.5">
              <Milk className="w-3.5 h-3.5 text-[#d47e62]" /> Tomas
            </span>
            <span className="text-xl font-bold text-[#3d3229] mt-1">{feedsCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase text-[#7a6f65] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#dfa745]" /> Siestas
            </span>
            <span className="text-xl font-bold text-[#3d3229] mt-1">{napsCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase text-[#7a6f65] flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-[#688a4d]" /> Pañales
            </span>
            <span className="text-xl font-bold text-[#3d3229] mt-1">{diapersCount}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Live Timers Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* 1. Live Breastfeeding Stopwatch */}
        <div className="p-5 md:p-6 rounded-[28px] bg-white border border-[#eeeae4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-bold">
                🤱
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3d3229]">Cronómetro de Lactancia</h3>
                <p className="text-[11px] text-[#7a6f65]">Control de pecho izquierdo y derecho</p>
              </div>
            </div>
            {isNursing && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-center space-y-3">
            <div className="text-3xl font-mono font-bold text-[#3d3229]">
              {formatSeconds(nursingSeconds)}
            </div>
            
            {/* Side breakdown */}
            <div className="flex justify-center gap-6 text-xs text-[#7a6f65]">
              <span className={activeBreast === 'izquierdo' && isNursing ? 'font-bold text-rose-600' : ''}>
                Izq: {formatSeconds(leftSeconds)}
              </span>
              <span className={activeBreast === 'derecho' && isNursing ? 'font-bold text-rose-600' : ''}>
                Der: {formatSeconds(rightSeconds)}
              </span>
            </div>

            {/* Breast selector toggle */}
            <div className="flex gap-2 justify-center pt-1">
              <button
                type="button"
                onClick={() => setActiveBreast('izquierdo')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeBreast === 'izquierdo'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white border border-[#eeeae4] text-[#3d3229]'
                }`}
              >
                Pecho Izquierdo
              </button>
              <button
                type="button"
                onClick={() => setActiveBreast('derecho')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeBreast === 'derecho'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white border border-[#eeeae4] text-[#3d3229]'
                }`}
              >
                Pecho Derecho
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            {!isNursing ? (
              <button
                onClick={() => setIsNursing(true)}
                className="flex-1 py-3 rounded-2xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Toma de Pecho</span>
              </button>
            ) : (
              <button
                onClick={handleFinishNursing}
                className="flex-1 py-3 rounded-2xl bg-[#688a4d] hover:bg-[#5a7942] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar y Guardar Toma</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Live Nap Stopwatch */}
        <div className="p-5 md:p-6 rounded-[28px] bg-white border border-[#eeeae4] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
                💤
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3d3229]">Monitor de Siesta en Vivo</h3>
                <p className="text-[11px] text-[#7a6f65]">Registra duración de sueño actual</p>
              </div>
            </div>
            {isNapping && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-center space-y-3">
            <div className="text-3xl font-mono font-bold text-[#3d3229]">
              {formatSeconds(napSeconds)}
            </div>
            <p className="text-xs text-[#7a6f65]">
              {isNapping ? 'Bebé durmiendo plácidamente...' : 'Toca iniciar cuando comience la siesta'}
            </p>
          </div>

          <div className="flex gap-2">
            {!isNapping ? (
              <button
                onClick={() => setIsNapping(true)}
                className="flex-1 py-3 rounded-2xl bg-[#dfa745] hover:bg-[#cf9839] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Empezó a Dormir</span>
              </button>
            ) : (
              <button
                onClick={handleFinishNap}
                className="flex-1 py-3 rounded-2xl bg-[#688a4d] hover:bg-[#5a7942] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Bebé Despertó (Guardar)</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Manual Quick Entry Form */}
      <div className="p-6 rounded-[32px] bg-white border border-[#eeeae4] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#3d3229]">
          Registrar Rápido un Evento o Señal
        </h3>

        {/* Category switcher tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'senal', label: '🔍 Señal / Llanto' },
            { id: 'biberon', label: '🍼 Biberón' },
            { id: 'panal', label: '🧷 Pañal' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setLogCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                logCategory === cat.id
                  ? 'bg-[#d47e62] text-white shadow-xs'
                  : 'bg-[#f4f1ec] text-[#3d3229] hover:bg-[#eae5dd]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleAddQuickEntry} className="space-y-4 pt-2">
          {logCategory === 'senal' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Señal / Sonido Observado
                </label>
                <select
                  value={signalType}
                  onChange={(e) => setSignalType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                >
                  <option value='Sonido "Neh" (Hambre temprana)'>Sonido "Neh" (Hambre temprana)</option>
                  <option value='Sonido "Owh" (Ventana de sueño abierta)'>Sonido "Owh" (Ventana de sueño abierta)</option>
                  <option value='Sonido "Heh" (Incomodidad / Pañal / Temp)'>Sonido "Heh" (Incomodidad / Pañal / Temp)</option>
                  <option value='Sonido "Eairh" (Gases en bajo vientre)'>Sonido "Eairh" (Gases en bajo vientre)</option>
                  <option value='Sonido "Eh" (Eructo / Burbuja esófago)'>Sonido "Eh" (Eructo / Burbuja esófago)</option>
                  <option value='Sobreestimulación / Sobrecarga sensorial'>Sobreestimulación / Sobrecarga sensorial</option>
                  <option value='Llamado de Apego / Necesidad de Brazos'>Llamado de Apego / Necesidad de Brazos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  ¿Cómo se calmó? (Acción efectiva)
                </label>
                <input
                  type="text"
                  value={calmedWith}
                  onChange={(e) => setCalmedWith(e.target.value)}
                  placeholder="Ej. Pecho + sonido 'Shhh'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                />
              </div>
            </div>
          )}

          {logCategory === 'biberon' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Cantidad tomada (ml)
                </label>
                <input
                  type="number"
                  min="10"
                  max="350"
                  value={bottleMl}
                  onChange={(e) => setBottleMl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Tipo de leche
                </label>
                <input
                  type="text"
                  placeholder="Ej. Leche materna diferida / Fórmula"
                  defaultValue="Leche materna diferida"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                />
              </div>
            </div>
          )}

          {logCategory === 'panal' && (
            <div>
              <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                Estado del Pañal
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDiaperType('humedo')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    diaperType === 'humedo' ? 'bg-[#c8d6ba]/40 border-[#688a4d] text-[#688a4d]' : 'bg-[#fdfaf5] border-[#eeeae4] text-[#3d3229]'
                  }`}
                >
                  💧 Mojado (Pipí)
                </button>
                <button
                  type="button"
                  onClick={() => setDiaperType('sucio')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    diaperType === 'sucio' ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-[#fdfaf5] border-[#eeeae4] text-[#3d3229]'
                  }`}
                >
                  💩 Sucio (Caca)
                </button>
                <button
                  type="button"
                  onClick={() => setDiaperType('mixto')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    diaperType === 'mixto' ? 'bg-orange-100 border-orange-400 text-orange-800' : 'bg-[#fdfaf5] border-[#eeeae4] text-[#3d3229]'
                  }`}
                >
                  🔄 Mixto
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
              Notas Adicionales (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Estaba más irritable de lo normal por visita de familiares..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar a la Bitácora</span>
          </button>
        </form>
      </div>

      {/* History Log Timeline */}
      <div className="p-6 rounded-[32px] bg-white border border-[#eeeae4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#3d3229]">
              Historial de Registros ({filteredEntries.length})
            </h3>
            <p className="text-xs text-[#7a6f65]">
              Sincronizado automáticamente en tu dispositivo y nube
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#7a6f65] shrink-0" />
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'senal', label: 'Señales' },
              { id: 'lactancia', label: 'Pecho' },
              { id: 'sueno', label: 'Siestas' },
              { id: 'panal', label: 'Pañales' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === f.id
                    ? 'bg-[#3d3229] text-white'
                    : 'bg-[#f4f1ec] text-[#7a6f65] hover:text-[#3d3229]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entries list */}
        {filteredEntries.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#fdfaf5] border border-dashed border-[#eeeae4] text-center space-y-2">
            <Baby className="w-8 h-8 text-[#7a6f65] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#3d3229]">No hay registros en esta categoría</p>
            <p className="text-[11px] text-[#7a6f65]">Usa los cronómetros o el formulario superior para añadir tu primer evento.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] hover:border-[#d47e62]/40 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#3d3229]">
                      {entry.signalType}
                    </span>
                    <span className="text-[10px] text-[#7a6f65] font-mono">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a6f65]">
                    <strong className="text-[#3d3229]">Respuesta:</strong> {entry.calmedWith}
                  </p>
                  {entry.notes && (
                    <p className="text-[11px] text-[#7a6f65] italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-2 rounded-xl text-[#7a6f65] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
