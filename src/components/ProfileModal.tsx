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
  Award,
  Smartphone,
  Mail,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Compass,
  AlertCircle,
  Share2,
  Globe,
  ShoppingCart,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BabyProfile } from '../types';
import { HOTMART_CONFIG } from '../config/hotmart';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  onOpenEbook: () => void;
  onOpenBitacora: () => void;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  initialTab?: 'baby' | 'resources' | 'account' | 'setup';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onOpenEbook,
  onOpenBitacora,
  onOpenAuth,
  initialTab
}) => {
  const {
    user,
    profile,
    logout,
    updateUserProfile,
    updateBabyProfile,
    cloudEntries
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'baby' | 'account' | 'resources' | 'setup'>('setup');
  
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

  // Setup Guide State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Sync state when profile loads/updates or initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (!user) {
      setActiveTab('setup');
    }
  }, [initialTab, isOpen, user]);

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

  const handleCopyText = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  };

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
        <div className="px-6 pt-3 bg-white flex gap-1.5 border-b border-[#f4f1ec] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'setup'
                ? 'border-[#d47e62] text-[#d47e62] bg-[#fdfaf5]'
                : 'border-transparent text-[#7a6f65] hover:text-[#3d3229]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#d47e62]" />
            <span>Guía de Configuración</span>
            <span className="text-[10px] bg-[#d47e62]/10 text-[#d47e62] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
              Hotmart
            </span>
          </button>

          <button
            onClick={() => setActiveTab('baby')}
            className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
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
            className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
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
            className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
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
          
          {/* TAB 0: GUÍA DE CONFIGURACIÓN & ACCESO HOTMART */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              
              {/* Top Welcome Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-[#fdfaf5] via-white to-[#f4f1ec] border border-[#d47e62]/20 shadow-xs relative overflow-hidden">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#d47e62] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47e62] bg-[#d47e62]/10 px-2 py-0.5 rounded-full">
                        Acceso de Alumnas Hotmart
                      </span>
                      <span className="text-[10px] font-semibold text-[#688a4d] bg-[#c8d6ba]/30 px-2 py-0.5 rounded-full">
                        Acceso Vitalicio Incluido
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                      Guía de Configuración y Respaldo en la Nube
                    </h3>
                    <p className="text-xs text-[#7a6f65] leading-relaxed">
                      ¡Felicidades por tu compra en Hotmart! Para que nunca pierdas los registros de sueño, lactancia y bitácora de tu bebé, sigue estos 4 sencillos pasos para asegurar tu aplicación.
                    </p>
                  </div>
                </div>

                {/* Cloud Sync Status Pill */}
                <div className="mt-4 pt-3 border-t border-[#eeeae4]/80">
                  {user ? (
                    <div className="p-3 rounded-xl bg-[#c8d6ba]/25 border border-[#c8d6ba] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0" />
                        <div>
                          <p className="font-bold text-[#3d3229]">
                            ¡Tu cuenta ya está sincronizada y protegida en la nube!
                          </p>
                          <p className="text-[11px] text-[#5c7c44]">
                            Correo vinculado: <strong>{user.email}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#688a4d] uppercase px-2 py-0.5 rounded-md bg-white border border-[#c8d6ba]">
                        Activo
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#d47e62]/10 border border-[#d47e62]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#d47e62] shrink-0" />
                        <div>
                          <p className="font-bold text-[#3d3229]">
                            Modo temporal activo en este navegador
                          </p>
                          <p className="text-[11px] text-[#7a6f65]">
                            Registra tu correo gratis para guardar tus datos permanentemente en la nube.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAuth?.('signup');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#d47e62] hover:bg-[#c46d52] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Registrar Correo Ahora</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Step by Step Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d3229]">
                    Paso a Paso Visual para Completar tu Acceso
                  </h4>
                  <span className="text-[11px] text-[#7a6f65]">Tiempo estimado: 2 minutos</span>
                </div>

                {/* PASO 1: Guardar App en Pantalla de Inicio */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eeeae4] shadow-2xs space-y-3 relative hover:border-[#d47e62]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#fdfaf5] border border-[#d47e62]/20 text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#d47e62]" />
                        <h5 className="text-sm font-bold text-[#3d3229]">
                          Guarda la App en la pantalla de inicio de tu celular
                        </h5>
                      </div>
                      <p className="text-xs text-[#7a6f65] leading-relaxed">
                        Método Vínculo es una Web App ligera. No necesitas buscarla en App Store ni Google Play. Agrégala como icono directo para abrirla con 1 solo toque cuando tu bebé llore o vayas a dormirlo:
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#524439]">
                    <div className="p-3 rounded-xl bg-[#fdfaf5] border border-[#eeeae4]">
                      <p className="font-bold text-[#3d3229] mb-1 flex items-center gap-1.5">
                        🍏 En iPhone (Safari):
                      </p>
                      <p className="text-[11px] text-[#7a6f65] leading-relaxed">
                        Toca el botón <strong>Compartir</strong> (icono cuadrado con flecha hacia arriba 📤 abajo en tu pantalla) y elige <strong>"Agregar a la pantalla de inicio"</strong>.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#fdfaf5] border border-[#eeeae4]">
                      <p className="font-bold text-[#3d3229] mb-1 flex items-center gap-1.5">
                        🤖 En Android (Chrome):
                      </p>
                      <p className="text-[11px] text-[#7a6f65] leading-relaxed">
                        Toca el <strong>menú de 3 puntos</strong> (⋮ arriba a la derecha) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Copy Link Helper */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/?acceso=hotmart`}
                      className="w-full text-[11px] font-mono px-3 py-2 rounded-xl bg-[#f4f1ec] border border-[#eeeae4] text-[#7a6f65] truncate focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyText(`${window.location.origin}/?acceso=hotmart`, 'step1_app')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-[#fdfaf5] border border-[#d47e62]/30 text-[#d47e62] text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedKey === 'step1_app' ? <Check className="w-3.5 h-3.5 text-[#688a4d]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'step1_app' ? '¡Enlace copiado!' : 'Copiar Enlace'}</span>
                    </button>
                  </div>
                </div>

                {/* PASO 2: Registrar Correo y Sincronizar en la Nube */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eeeae4] shadow-2xs space-y-3 relative hover:border-[#d47e62]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#fdfaf5] border border-[#d47e62]/20 text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#d47e62]" />
                        <h5 className="text-sm font-bold text-[#3d3229]">
                          Registra tu correo para sincronizar y respaldar tus datos
                        </h5>
                      </div>
                      <p className="text-xs text-[#7a6f65] leading-relaxed">
                        El enlace de Hotmart te concede acceso completo, pero vincular tu correo electrónico es lo que garantiza que tus datos queden respaldados permanentemente en nuestra nube segura.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#eeeae4] text-xs text-[#524439] space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                      <span>
                        <strong>Seguridad Multi-dispositivo:</strong> Si cambias de teléfono, borras el historial o abres la app en tu tablet o laptop, al iniciar sesión tu bitácora y perfil estarán intactos.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                      <span>
                        <strong>Membresía vinculada a tu cuenta:</strong> Tu estatus VIP vitalicio queda sellado para siempre con tu correo electrónico.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#688a4d] shrink-0 mt-0.5" />
                      <span>
                        <strong>Consejo:</strong> Te sugerimos usar preferiblemente el mismo correo electrónico con el que realizaste el pago en Hotmart.
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-3 flex-wrap">
                    {user ? (
                      <div className="flex items-center gap-2 text-xs text-[#5c7c44]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sincronizado con: <strong>{user.email}</strong></span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAuth?.('signup');
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Crear Cuenta / Registrar Correo Gratis</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!user && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAuth?.('login');
                        }}
                        className="text-xs text-[#7a6f65] hover:text-[#d47e62] font-semibold underline cursor-pointer"
                      >
                        ¿Ya te habías registrado antes? Iniciar Sesión
                      </button>
                    )}
                  </div>
                </div>

                {/* PASO 3: Configurar Perfil del Bebé */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eeeae4] shadow-2xs space-y-3 relative hover:border-[#d47e62]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#fdfaf5] border border-[#d47e62]/20 text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-[#d47e62]" />
                        <h5 className="text-sm font-bold text-[#3d3229]">
                          Configura la fecha de nacimiento de tu bebé
                        </h5>
                      </div>
                      <p className="text-xs text-[#7a6f65] leading-relaxed">
                        Al ingresar la fecha exacta de nacimiento, el algoritmo de Método Vínculo calculará automáticamente las <strong>Ventanas de Sueño personalizadas</strong> para su edad y te indicará los tiempos óptimos de vigilia para prevenir el sobrecansancio.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('baby')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#fdfaf5] hover:bg-[#f4f1ec] border border-[#d47e62]/30 text-[#d47e62] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Baby className="w-3.5 h-3.5" />
                      <span>Ir a Configurar Perfil del Bebé</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* PASO 4: Acceder a Ebook y Recursos */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#eeeae4] shadow-2xs space-y-3 relative hover:border-[#d47e62]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#fdfaf5] border border-[#d47e62]/20 text-[#d47e62] flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#d47e62]" />
                        <h5 className="text-sm font-bold text-[#3d3229]">
                          Lee tu Ebook y utiliza las herramientas integradas
                        </h5>
                      </div>
                      <p className="text-xs text-[#7a6f65] leading-relaxed">
                        Tienes a tu disposición el libro completo interactivo, la guía de lactancia ergonómica, el calculador de siestas y el generador de sonido blanco continuo (Shhh, Ruido Uterino y Latido Cardíaco Materno).
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenEbook();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Abrir Lector del Ebook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('resources')}
                      className="px-4 py-2 rounded-xl bg-[#fdfaf5] hover:bg-[#f4f1ec] border border-[#eeeae4] text-[#3d3229] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Ver Todos Mis Recursos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* MASTER CIRCUITO DE ENLACES PARA CAMPAÑAS Y VENTAS */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#d47e62]/40 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#d47e62] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47e62]">
                        Centro de Control de la Creadora
                      </span>
                      <h4 className="text-sm font-bold text-[#3d3229]">
                        Tus 3 Enlaces del Circuito de Ventas (Para no fallar)
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#5c7c44] bg-[#c8d6ba]/30 border border-[#c8d6ba] px-2 py-0.5 rounded-full shrink-0">
                    Listo para Usar
                  </span>
                </div>

                <p className="text-xs text-[#7a6f65] leading-relaxed">
                  Copia cada enlace exactamente donde corresponde para que tus anuncios de Meta Ads y tus compradores de Hotmart fluyan en orden automático sin perder clientes ni registros:
                </p>

                {/* Grid de los 3 enlaces */}
                <div className="space-y-3">
                  
                  {/* ENLACE 1: PÁGINA DE VENTAS PARA META ADS */}
                  <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#eeeae4] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3d3229]">
                        <Globe className="w-4 h-4 text-[#d47e62]" />
                        <span>1. Enlace para tu Anuncio en Facebook / Instagram Ads (URL de Destino)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#d47e62]/10 text-[#d47e62]">
                        Página de Ventas
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7a6f65]">
                      Pega este enlace en el campo <strong>"URL del sitio web"</strong> dentro del Administrador de Anuncios de Meta. Lleva directo a la Landing Page con la oferta de $10 USD.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={window.location.origin}
                        className="w-full text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white border border-[#eeeae4] text-[#3d3229] truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(window.location.origin, 'link_landing')}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4f1ec] border border-[#d47e62]/30 text-[#d47e62] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        {copiedKey === 'link_landing' ? <Check className="w-3.5 h-3.5 text-[#688a4d]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'link_landing' ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* ENLACE 2: CHECKOUT DE HOTMART */}
                  <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#eeeae4] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3d3229]">
                        <ShoppingCart className="w-4 h-4 text-[#5c7c44]" />
                        <span>2. Enlace a tu Pasarela de Pago (Checkout Oficial de Hotmart)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#c8d6ba]/40 text-[#5c7c44]">
                        Hotlink de Pago
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7a6f65]">
                      Es el enlace donde la mamá ingresa su tarjeta o PayPal. Ya está conectado directamente a los botones de compra de esta página.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={HOTMART_CONFIG.checkoutUrl}
                        className="w-full text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white border border-[#eeeae4] text-[#3d3229] truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(HOTMART_CONFIG.checkoutUrl, 'link_checkout')}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4f1ec] border border-[#5c7c44]/30 text-[#5c7c44] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        {copiedKey === 'link_checkout' ? <Check className="w-3.5 h-3.5 text-[#688a4d]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'link_checkout' ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* ENLACE 3: ACCESO DIRECTO PARA EL PDF DE HOTMART */}
                  <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#eeeae4] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#3d3229]">
                        <Layers className="w-4 h-4 text-[#d47e62]" />
                        <span>3. Enlace de Entrega de la App (Para colocar dentro del PDF y Hotmart)</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#d47e62]/10 text-[#d47e62]">
                        Entrega Post-Compra
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7a6f65]">
                      Coloca este enlace en el botón <strong>"Abrir App Web"</strong> de tu PDF de bienvenida y en la <strong>Página de Gracias</strong> de Hotmart. Desbloquea toda la suite sin pedir pago de nuevo.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/?acceso=hotmart`}
                        className="w-full text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white border border-[#eeeae4] text-[#3d3229] truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyText(`${window.location.origin}/?acceso=hotmart`, 'link_delivery')}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#f4f1ec] border border-[#d47e62]/30 text-[#d47e62] text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        {copiedKey === 'link_delivery' ? <Check className="w-3.5 h-3.5 text-[#688a4d]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'link_delivery' ? '¡Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Resumen del flujo infalible */}
                <div className="p-3 rounded-xl bg-[#f4f1ec] text-[11px] text-[#524439] space-y-1">
                  <p className="font-bold text-[#3d3229] flex items-center gap-1.5">
                    💡 Resumen del Circuito:
                  </p>
                  <p>
                    Anuncio de Facebook ➔ <strong>Enlace 1 (Landing)</strong> ➔ Botón de compra ➔ <strong>Enlace 2 (Checkout Hotmart)</strong> ➔ La mamá paga ➔ Descarga PDF con <strong>Enlace 3 (App desbloqueada)</strong>.
                  </p>
                </div>
              </div>

              {/* Preguntas Frecuentes de Hotmart */}
              <div className="p-5 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3d3229]">
                  <HelpCircle className="w-4 h-4 text-[#d47e62]" />
                  <span>Preguntas Frecuentes sobre el Acceso</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    {
                      q: '¿Tengo que volver a pagar en algún momento?',
                      a: 'No, bajo ninguna circunstancia. Tu compra única en Hotmart te otorga acceso vitalicio completo a la Web App y a futuras actualizaciones de contenido sin suscripciones mensuales.'
                    },
                    {
                      q: '¿Puedo usar la aplicación en varios dispositivos al mismo tiempo?',
                      a: 'Sí. Al registrar tu correo y contraseña en el Paso 2, puedes iniciar sesión simultáneamente en tu teléfono móvil, tablet o computadora y tus registros se sincronizarán al instante.'
                    },
                    {
                      q: '¿Dónde descargo los archivos PDF originales?',
                      a: 'Los archivos PDF imprimibles y descargables están alojados en tu área de estudiante de Hotmart. Sin embargo, también puedes leerlos en cualquier momento directamente en el lector interactivo de esta app.'
                    },
                    {
                      q: '¿Qué hago si cambié de celular o borré las cookies?',
                      a: 'Solo debes ingresar al enlace de la app, tocar el icono de usuario o menú, seleccionar "Iniciar Sesión" y colocar el correo y contraseña que registraste. Todos tus datos aparecerán intactos.'
                    }
                  ].map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-[#eeeae4] transition-all">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full text-left font-bold text-[#3d3229] flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#d47e62] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#7a6f65] shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <p className="mt-2 text-[#7a6f65] text-[11px] leading-relaxed pt-2 border-t border-[#f4f1ec]">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Support note */}
                <div className="pt-2 text-center">
                  <p className="text-[11px] text-[#7a6f65]">
                    ¿Tienes dudas con tu cuenta o necesitas ayuda adicional? Escríbenos a{' '}
                    <a
                      href="mailto:matrescencia.rg@gmail.com"
                      className="text-[#d47e62] font-bold underline hover:opacity-80"
                    >
                      matrescencia.rg@gmail.com
                    </a>
                  </p>
                </div>
              </div>

            </div>
          )}

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
