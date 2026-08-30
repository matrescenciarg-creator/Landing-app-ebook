import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Baby } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    authError,
    clearAuthError
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    clearAuthError();
    setLocalError(null);
    setResetSent(false);
    setMode(newMode);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          setLocalError('Por favor ingresa tu nombre.');
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, password, displayName, babyName);
        onSuccess?.();
        onClose();
      } else if (mode === 'login') {
        await signInWithEmail(email, password);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Ocurrió un error. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Error al conectar con Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-white border border-[#eeeae4] shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] flex items-center justify-center text-[#d47e62] font-bold">
              {mode === 'signup' ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                {mode === 'signup' && 'Crear tu Cuenta'}
                {mode === 'login' && 'Iniciar Sesión'}
                {mode === 'forgot' && 'Recuperar Contraseña'}
              </h2>
              <p className="text-xs text-[#7a6f65]">
                {mode === 'signup' && 'Guarda el perfil de tu bebé y tus registros'}
                {mode === 'login' && 'Accede a tu perfil, bitácora y recursos'}
                {mode === 'forgot' && 'Ingresa tu correo para recibir un enlace'}
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
        {mode !== 'forgot' && (
          <div className="px-6 pt-4 pb-1 bg-white flex gap-2 border-b border-[#f4f1ec]">
            <button
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#f4f1ec] text-[#d47e62] border border-[#eeeae4]'
                  : 'text-[#7a6f65] hover:text-[#3d3229]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => handleModeChange('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#f4f1ec] text-[#d47e62] border border-[#eeeae4]'
                  : 'text-[#7a6f65] hover:text-[#3d3229]'
              }`}
            >
              Registrarme
            </button>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-4 flex-1 bg-white">
          
          {/* Error Banner */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localError || authError}</span>
            </div>
          )}

          {/* Reset Sent Notice */}
          {resetSent && (
            <div className="p-4 rounded-2xl bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#3d3229] text-xs space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#688a4d] mx-auto" />
              <p className="font-bold">¡Correo enviado con éxito!</p>
              <p className="text-[#7a6f65]">
                Revisa tu bandeja de entrada en <strong>{email}</strong> para restablecer tu contraseña.
              </p>
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="mt-2 text-xs font-bold text-[#d47e62] hover:underline cursor-pointer"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          )}

          {!resetSent && (
            <>
              {/* Google Button */}
              {mode !== 'forgot' && (
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-2xl border border-[#eeeae4] bg-[#fdfaf5] hover:bg-[#f4f1ec] text-xs font-bold text-[#3d3229] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.5 0 12.8s.6 4.5 1.6 6.4l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"
                      />
                    </svg>
                    <span>Continuar con Google</span>
                  </button>

                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#eeeae4]"></div>
                    </div>
                    <span className="relative bg-white px-3 text-[11px] text-[#7a6f65] uppercase font-semibold">
                      o con tu correo
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {/* Sign Up Fields */}
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                        Tu Nombre
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-[#7a6f65] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Ej. Carolina Martínez"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                        Nombre o apodo de tu bebé <span className="text-[10px] font-normal text-[#7a6f65]">(Opcional)</span>
                      </label>
                      <div className="relative">
                        <Baby className="w-4 h-4 text-[#7a6f65] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={babyName}
                          onChange={(e) => setBabyName(e.target.value)}
                          placeholder="Ej. Mateo (o dejar en blanco)"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7a6f65] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#3d3229] uppercase">
                        Contraseña
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => handleModeChange('forgot')}
                          className="text-[11px] text-[#d47e62] hover:underline cursor-pointer"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7a6f65] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] bg-[#fdfaf5] focus:outline-none focus:ring-1 focus:ring-[#d47e62]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </span>
                  ) : (
                    <>
                      <span>
                        {mode === 'login' && 'Iniciar Sesión'}
                        {mode === 'signup' && 'Crear mi Cuenta Gratuita'}
                        {mode === 'forgot' && 'Enviar enlace de recuperación'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer note & switcher */}
          <div className="pt-3 border-t border-[#f4f1ec] text-center text-xs text-[#7a6f65]">
            {mode === 'login' && (
              <p>
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="font-bold text-[#d47e62] hover:underline cursor-pointer"
                >
                  Regístrate gratis
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="font-bold text-[#d47e62] hover:underline cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}

            {mode === 'forgot' && !resetSent && (
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="font-bold text-[#d47e62] hover:underline cursor-pointer"
              >
                Volver a Iniciar Sesión
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
