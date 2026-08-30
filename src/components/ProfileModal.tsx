import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Baby,
  Heart,
  BookOpen,
  Calendar,
  Save,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BabyProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  onOpenEbook: () => void;
  onOpenBitacora: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onOpenEbook,
  onOpenBitacora
}) => {
  const {
    user,
    profile,
    logout,
    updateUserProfile,
    updateBabyProfile,
    cloudEntries
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'baby' | 'account' | 'resources'>('baby');
  
  // User name
  const [userName, setUserName] = useState(profile?.displayName || user?.displayName || '');
  
  // Baby profile form state
  const [babyName, setBabyName] = useState(profile?.babyProfile?.name || 'Mi Bebé');
  const [birthDate, setBirthDate] = useState(profile?.babyProfile?.birthDate || '');
  const [gender, setGender] = useState<'niño' | 'niña' | 'sorpresa'>(profile?.babyProfile?.gender || 'sorpresa');
  const [weightKg, setWeightKg] = useState(profile?.babyProfile?.weightKg || '');
  const [soothingMethod, setSoothingMethod] = useState(profile?.babyProfile?.soothingMethod || 'Ritual de calma con Método Vínculo');
  const [notes, setNotes] = useState(profile?.babyProfile?.notes || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when profile loads/updates
  useEffect(() => {
    if (profile) {
      setUserName(profile.displayName || user?.displayName || '');
      setBabyName(profile.babyProfile?.name || 'Mi Bebé');
      setBirthDate(profile.babyProfile?.birthDate || '');
      setGender(profile.babyProfile?.gender || 'sorpresa');
      setWeightKg(profile.babyProfile?.weightKg || '');
      setSoothingMethod(profile.babyProfile?.soothingMethod || 'Ritual de calma con Método Vínculo');
      setNotes(profile.babyProfile?.notes || '');
    }
  }, [profile, user]);

  if (!isOpen) return null;

  // Calculate baby's age from birthDate
  const calculateBabyAge = (dateString?: string) => {
    if (!dateString) return null;
    const birth = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    if (diffMs < 0) return 'Fecha futura';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const months = Math.floor(diffDays / 30.44);
    
    if (weeks < 4) {
      return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} (${diffDays} días)`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? 'mes' : 'meses'} (${weeks} semanas)`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} año${years > 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatedBaby: BabyProfile = {
        name: babyName.trim() || 'Mi Bebé',
        birthDate: birthDate || undefined,
        gender: gender,
        weightKg: weightKg.trim() || undefined,
        soothingMethod: soothingMethod.trim() || undefined,
        notes: notes.trim() || undefined
      };

      await updateBabyProfile(updatedBaby);
      if (userName.trim() && userName !== profile?.displayName) {
        await updateUserProfile({ displayName: userName.trim() });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isUnlocked = profile?.isUnlocked || localStorage.getItem('metodo_vinculo_unlocked') === 'true';

  // Stats calculation
  const totalEntries = cloudEntries.length;
  const signalCounts: { [key: string]: number } = {};
  cloudEntries.forEach(entry => {
    signalCounts[entry.signalType] = (signalCounts[entry.signalType] || 0) + 1;
  });
  const topSignal = Object.entries(signalCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-white border border-[#eeeae4] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#d47e62] text-white flex items-center justify-center font-bold text-xl shadow-xs" style={{ fontFamily: 'Georgia, serif' }}>
              {userName ? userName.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'M')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                  {userName || 'Tu Perfil'}
                </h2>
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#688a4d] bg-[#c8d6ba]/30 border border-[#c8d6ba] px-2.5 py-0.5 rounded-full">
                    <Award className="w-3 h-3" /> Acceso Full
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7a6f65] bg-[#f4f1ec] border border-[#eeeae4] px-2.5 py-0.5 rounded-full">
                    Cuenta Básica
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7a6f65]">
                {user?.email}
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

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-white flex gap-2 border-b border-[#f4f1ec] shrink-0">
          <button
            onClick={() => setActiveTab('baby')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'baby'
                ? 'border-[#d47e62] text-[#d47e62] bg-[#fdfaf5]'
                : 'border-transparent text-[#7a6f65] hover:text-[#3d3229]'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>Perfil de {babyName || 'tu Bebé'}</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'resources'
                ? 'border-[#d47e62] text-[#d47e62] bg-[#fdfaf5]'
                : 'border-transparent text-[#7a6f65] hover:text-[#3d3229]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mis Recursos</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 ${
              activeTab === 'account'
                ? 'border-[#d47e62] text-[#d47e62] bg-[#fdfaf5]'
                : 'border-transparent text-[#7a6f65] hover:text-[#3d3229]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Cuenta</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* TAB 1: BABY PROFILE */}
          {activeTab === 'baby' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Baby summary banner */}
              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#eeeae4] flex items-center justify-center text-xl shadow-xs">
                    👶
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3d3229]">
                      {babyName || 'Mi Bebé'}
                    </h3>
                    <p className="text-xs text-[#7a6f65]">
                      {birthDate ? (
                        <>Edad: <strong>{calculateBabyAge(birthDate)}</strong></>
                      ) : (
                        'Configura la fecha de nacimiento para calcular ventanas de sueño automáticamente'
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBitacora();
                  }}
                  className="text-xs font-bold text-[#d47e62] bg-white hover:bg-[#f4f1ec] border border-[#eeeae4] px-3 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ver Bitácora ({totalEntries})</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-2xl bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#3d3229] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#688a4d]" />
                  <span>¡Perfil actualizado y guardado en la nube exitosamente!</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Nombre o Apodo del Bebé
                  </label>
                  <input
                    type="text"
                    required
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="Ej. Mateo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Género / Identidad
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  >
                    <option value="sorpresa">Prefiero no especificar</option>
                    <option value="niño">Niño</option>
                    <option value="niña">Niña</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Peso Actual o de Nacimiento (Opcional)
                  </label>
                  <input
                    type="text"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="Ej. 4.2 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Método que mejor calma a tu bebé
                </label>
                <input
                  type="text"
                  value={soothingMethod}
                  onChange={(e) => setSoothingMethod(e.target.value)}
                  placeholder="Ej. Sonido 'Shhh' + porteo + balanceo suave"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                  Notas Particulares / Indicaciones Médicas
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Reflujo leve después de tomas, le gusta que lo cambien en diagonal..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                />
              </div>

              {/* Bitácora Quick Stats */}
              {totalEntries > 0 && (
                <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#3d3229]">
                    📊 Estadísticas de tu Bitácora
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#7a6f65]">
                    <div className="p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                      <span className="block text-[10px] uppercase font-bold text-[#3d3229]">Señales Registradas</span>
                      <span className="text-lg font-bold text-[#d47e62]">{totalEntries}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                      <span className="block text-[10px] uppercase font-bold text-[#3d3229]">Señal más Frecuente</span>
                      <span className="text-xs font-semibold text-[#3d3229] truncate block mt-1">
                        {topSignal ? topSignal[0] : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando en la nube...' : 'Guardar Cambios del Bebé'}</span>
              </button>

            </form>
          )}

          {/* TAB 2: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#3d3229]">
                      Tus Recursos Método Vínculo
                    </h3>
                    <p className="text-xs text-[#7a6f65]">
                      {isUnlocked ? 'Todos tus recursos están 100% desbloqueados y listos para consultar' : 'Accede a vistas previas o desbloquea el paquete completo'}
                    </p>
                  </div>
                  {!isUnlocked && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCheckout();
                      }}
                      className="text-xs font-bold bg-[#d47e62] text-white px-3.5 py-1.5 rounded-full shadow-xs cursor-pointer"
                    >
                      Desbloquear Todo · $10
                    </button>
                  )}
                </div>
              </div>

              {/* Resources List */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold">
                      📖
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3d3229]">Ebook: El Método Vínculo</h4>
                      <p className="text-[11px] text-[#7a6f65]">5 capítulos completos · Guía paso a paso</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEbook();
                    }}
                    className="text-xs font-bold text-[#d47e62] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Leer</span> <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold">
                      📝
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3d3229]">Bitácora Digital de Señales</h4>
                      <p className="text-[11px] text-[#7a6f65]">Seguimiento diario sincronizado en la nube</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBitacora();
                    }}
                    className="text-xs font-bold text-[#d47e62] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Abrir</span> <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold">
                      🤱
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3d3229]">Bono 1: Guía de Lactancia sin Dolor</h4>
                      <p className="text-[11px] text-[#7a6f65]">Agarre profundo, prevención de grietas y posturas</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#688a4d]">
                    {isUnlocked ? '✓ Activo' : 'Incluido en Pack'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#eeeae4] flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f4f1ec] text-[#d47e62] flex items-center justify-center font-bold">
                      🌿
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3d3229]">Bono 2: Vuelta al Cuerpo Postparto</h4>
                      <p className="text-[11px] text-[#7a6f65]">Cuidado del suelo pélvico y bienestar materno</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#688a4d]">
                    {isUnlocked ? '✓ Activo' : 'Incluido en Pack'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3d3229]">
                  Datos de tu Cuenta
                </h3>
                
                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-white focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-medium text-[#7a6f65] bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#7a6f65]">ID de Usuario:</span>
                  <span className="font-mono text-[11px] text-[#3d3229] truncate max-w-[180px]">{user?.uid}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3d3229]">Seguridad y Sesión</p>
                  <p className="text-[11px] text-[#7a6f65]">Cierra tu sesión en este dispositivo</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between text-xs text-[#7a6f65]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#688a4d]" />
            <span>Datos protegidos y sincronizados en la nube</span>
          </div>

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
