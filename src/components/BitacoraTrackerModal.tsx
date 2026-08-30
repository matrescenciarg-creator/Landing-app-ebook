import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Printer, Cloud, ShieldCheck } from 'lucide-react';
import { LogEntry } from '../types';
import { useAuth } from '../context/AuthContext';

interface BitacoraTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LogEntry[];
  onAddEntry: (entry: LogEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const BitacoraTrackerModal: React.FC<BitacoraTrackerModalProps> = ({
  isOpen,
  onClose,
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const { user, profile } = useAuth();
  const [babyName, setBabyName] = useState<string>(profile?.babyProfile?.name || 'Mi Bebé');
  const [selectedSignal, setSelectedSignal] = useState<string>('Sonido "Neh" (Hambre)');
  const [calmedWith, setCalmedWith] = useState<string>('Pecho / Biberón a demanda');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (profile?.babyProfile?.name) {
      setBabyName(profile.babyProfile.name);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString([], { day: '2-digit', month: 'short' }),
      babyName: babyName || profile?.babyProfile?.name || 'Mi Bebé',
      signalType: selectedSignal,
      calmedWith: calmedWith || 'Brazos y contención',
      notes: notes || 'Respuesta rápida en calma',
      resolved: true
    };
    onAddEntry(newEntry);
    setNotes('');
  };


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-white border border-[#eeeae4] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c8d6ba]/30 border border-[#c8d6ba] flex items-center justify-center text-xl">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                  Bitácora de Señales y Patrones
                </h2>
                {user && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#688a4d] bg-[#c8d6ba]/30 border border-[#c8d6ba] px-2 py-0.5 rounded-full">
                    <Cloud className="w-3 h-3" /> Nube Activa
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7a6f65]">
                {user ? `Registros sincronizados con la cuenta de ${profile?.displayName || 'tu perfil'}` : 'Registra y descubre la rutina natural de tu bebé'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#eeeae4] hover:bg-[#f4f1ec] flex items-center justify-center text-[#3d3229] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* New Entry Form */}
          <form onSubmit={handleSubmit} className="p-5 rounded-[24px] bg-[#fdfaf5] border border-[#eeeae4] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d47e62]">
                + Registrar Nueva Señal
              </span>
              <span className="text-xs text-[#7a6f65]">
                Hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Nombre del bebé
                </label>
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eeeae4] text-xs font-medium text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  placeholder="Ej. Mateo"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Señal observada
                </label>
                <select
                  value={selectedSignal}
                  onChange={(e) => setSelectedSignal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eeeae4] text-xs font-medium text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                >
                  <option value='Sonido "Neh" (Hambre)'>Sonido "Neh" (Hambre)</option>
                  <option value='Sonido "Owh" (Sueño)'>Sonido "Owh" (Sueño)</option>
                  <option value='Sonido "Heh" (Incomodidad/Pañal)'>Sonido "Heh" (Incomodidad/Pañal)</option>
                  <option value='Sonido "Eairh" (Gases/Cólico)'>Sonido "Eairh" (Gases/Cólico)</option>
                  <option value='Sonido "Eh" (Eructo)'>Sonido "Eh" (Eructo)</option>
                  <option value='Sobrecarga Sensorial'>Sobrecarga Sensorial</option>
                  <option value='Llamado de Contacto / Brazos'>Llamado de Contacto / Brazos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Respuesta aplicada
                </label>
                <select
                  value={calmedWith}
                  onChange={(e) => setCalmedWith(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#eeeae4] text-xs font-medium text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                >
                  <option value="Pecho / Biberón a demanda">Pecho / Biberón a demanda</option>
                  <option value="Bajar luces + ritual de sueño">Bajar luces + ritual de sueño</option>
                  <option value="Cambio de pañal y revisión ropa">Cambio de pañal y revisión ropa</option>
                  <option value="Postura del perezoso / Masaje tripita">Postura del perezoso / Masaje tripita</option>
                  <option value="Palmaditas espalda para eructo">Palmaditas espalda para eructo</option>
                  <option value="Porteo piel con piel + 'Shhh'">Porteo piel con piel + 'Shhh'</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales (ej. se durmió en 5 minutos, eructó fácil...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#eeeae4] text-xs text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
              />
              <button
                type="submit"
                className="bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </form>

          {/* History List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#3d3229]">
                Historial de Registros ({entries.length})
              </p>
              <button
                onClick={handlePrint}
                className="text-xs text-[#3d3229] hover:text-[#d47e62] font-semibold flex items-center gap-1.5 bg-[#fdfaf5] px-3.5 py-1.5 rounded-full border border-[#eeeae4] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir Hoja de Registro
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[#eeeae4] rounded-2xl bg-[#fdfaf5]/50">
                <p className="text-sm text-[#7a6f65]">Aún no has registrado señales.</p>
                <p className="text-xs text-[#7a6f65]/70 mt-1">Usa el formulario arriba o guarda desde el Traductor.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-between gap-3 shadow-2xs hover:border-[#d47e62]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#d47e62]">
                          {entry.signalType}
                        </span>
                        <span className="text-[10px] text-[#7a6f65] bg-[#fdfaf5] px-2 py-0.5 rounded-md border border-[#eeeae4]">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#3d3229]">
                        <strong>Acción:</strong> {entry.calmedWith}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-[#7a6f65] italic mt-0.5 truncate">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between text-xs text-[#7a6f65]">
          <span>💡 Lleva esta bitácora a tus controles pediátricos para mostrar la evolución.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-[#eeeae4] hover:bg-[#ded8cf] text-[#3d3229] font-semibold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
