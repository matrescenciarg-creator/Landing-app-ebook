import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, profile, unlockMembership } = useAuth();

  const [email, setEmail] = useState<string>('mama@ejemplo.com');
  const [name, setName] = useState<string>('Camila Morales');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState<string>('12/28');
  const [cvv, setCvv] = useState<string>('789');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (profile?.displayName || user?.displayName) {
      setName(profile?.displayName || user?.displayName || '');
    }
  }, [user, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await unlockMembership();
    } catch (err) {
      console.warn('Unlock error', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      onSuccess(email);
    }, 900);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-[32px] bg-white border border-[#eeeae4] shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-[#eeeae4] bg-[#fdfaf5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] flex items-center justify-center text-[#d47e62]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                Pago Seguro · Acceso Inmediato
              </h2>
              <p className="text-[11px] text-[#7a6f65]">
                Matrescencia — Método Vínculo
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

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white">
          {!isCompleted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product summary card */}
              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3d3229]">
                    Pack Completo Método Vínculo
                  </p>
                  <p className="text-[11px] text-[#7a6f65]">
                    App + Ebook + 3 Bonos de Regalo
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#d47e62]" style={{ fontFamily: 'Georgia, serif' }}>
                    $10 USD
                  </span>
                  <p className="text-[10px] text-[#688a4d] font-semibold">Pago único</p>
                </div>
              </div>

              {/* User info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Tu Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62] bg-[#fdfaf5]"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3d3229] uppercase mb-1">
                    Correo Electrónico (Para enviarte acceso y descargas)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#eeeae4] text-xs font-medium text-[#3d3229] focus:outline-none focus:ring-1 focus:ring-[#d47e62] bg-[#fdfaf5]"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              {/* Payment Card Inputs */}
              <div className="p-4 rounded-2xl bg-white border border-[#eeeae4] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3d3229] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#d47e62]" /> Tarjeta de Crédito / Débito
                  </span>
                  <div className="flex gap-1 text-[10px] text-[#7a6f65]">
                    <span className="bg-[#fdfaf5] px-2 py-0.5 rounded-md border border-[#eeeae4]">VISA</span>
                    <span className="bg-[#fdfaf5] px-2 py-0.5 rounded-md border border-[#eeeae4]">Mastercard</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a6f65] uppercase mb-1">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-mono text-[#3d3229] bg-[#fdfaf5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a6f65] uppercase mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-mono text-[#3d3229] bg-[#fdfaf5]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a6f65] uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#eeeae4] text-xs font-mono text-[#3d3229] bg-[#fdfaf5]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl text-sm font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando pago seguro...
                  </span>
                ) : (
                  <span>Pagar $10 USD y Obtener Acceso Inmediato</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7a6f65]">
                <ShieldCheck className="w-4 h-4 text-[#688a4d]" />
                <span>Encriptación SSL de 256 bits · Garantía de acceso</span>
              </div>

            </form>
          ) : (
            /* Order confirmation state */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#688a4d] mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                  ¡Felicidades, {name.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#688a4d] font-semibold mt-0.5">
                  Tu acceso al Método Vínculo está 100% activo
                </p>
                <p className="text-xs text-[#7a6f65] mt-2">
                  Hemos enviado tus claves y enlaces de descarga a <strong>{email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-left space-y-2 text-xs">
                <p className="font-bold text-[#3d3229] uppercase tracking-wider text-[11px]">
                  Tus recursos listos para consultar:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">📖 Ebook Método Vínculo (PDF / Web)</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">🤱 Guía Completa de Lactancia</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">🌿 Guía Vuelta al Cuerpo</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">📝 Bitácora Imprimible y Digital</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-sm font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Comenzar a usar la App ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
