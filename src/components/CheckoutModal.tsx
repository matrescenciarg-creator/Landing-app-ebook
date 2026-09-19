import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, CreditCard, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HOTMART_CONFIG } from '../config/hotmart';

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

  const handleOpenHotmart = () => {
    // Redirige a la pasarela de Hotmart
    const targetUrl = HOTMART_CONFIG.checkoutUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
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
                Pago Seguro con Hotmart
              </h2>
              <p className="text-[11px] text-[#7a6f65]">
                Garantía de satisfacción · Acceso Inmediato
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
            <div className="space-y-5">
              
              {/* Product summary card */}
              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3d3229]">
                    Pack Completo Método Vínculo
                  </p>
                  <p className="text-[11px] text-[#7a6f65]">
                    App Suite + Ebook + 3 Bonos Exclusivos
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#d47e62]" style={{ fontFamily: 'Georgia, serif' }}>
                    $10 USD
                  </span>
                  <p className="text-[10px] text-[#688a4d] font-semibold">Pago único</p>
                </div>
              </div>

              {/* Hotmart Features Box */}
              <div className="p-4 rounded-2xl bg-[#fff9f7] border border-[#d47e62]/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d47e62]">
                  <Sparkles className="w-4 h-4" />
                  <span>Beneficios del Checkout Seguro de Hotmart:</span>
                </div>
                <ul className="text-xs text-[#524439] space-y-1.5 list-disc list-inside">
                  <li>Paga en tu moneda local con tarjeta, PayPal o efectivo (Oxxo, Baloto, etc.)</li>
                  <li>Acceso automático instantáneo a la App y al Área de Miembros</li>
                  <li>Garantía incondicional de 7 días respaldada por Hotmart</li>
                </ul>
              </div>

              {/* Main CTA: Go to Hotmart */}
              <button
                type="button"
                id="btn-go-to-hotmart-checkout"
                onClick={handleOpenHotmart}
                className="w-full py-4.5 rounded-2xl text-base font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ir al Checkout Seguro de Hotmart ($10 USD)</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7a6f65] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#688a4d]" />
                <span>Procesado por Hotmart · Encriptación SSL 256-bit</span>
              </div>

              {/* Dev / Preview quick unlock tool */}
              <div className="pt-4 border-t border-[#eeeae4]">
                <details className="text-[11px] text-[#7a6f65] cursor-pointer">
                  <summary className="font-semibold hover:text-[#3d3229]">
                    ⚙️ ¿Modo de prueba / Desbloqueo directo? (Haz clic aquí)
                  </summary>
                  <div className="mt-3 p-3 rounded-xl bg-[#fdfaf5] border border-[#eeeae4] space-y-2">
                    <p className="text-[11px] text-[#7a6f65]">
                      Para probar el flujo de la app como cliente sin realizar un pago real en Hotmart:
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#3d3229] hover:bg-[#221c17] text-white transition-colors"
                    >
                      {isProcessing ? 'Activando...' : 'Desbloquear acceso demo en esta sesión'}
                    </button>
                  </div>
                </details>
              </div>

            </div>
          ) : (
            /* Order confirmation state */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-[#c8d6ba]/30 border border-[#c8d6ba] text-[#688a4d] mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                  ¡Acceso Desbloqueado!
                </h3>
                <p className="text-xs text-[#688a4d] font-semibold mt-0.5">
                  Tu suscripción a Método Vínculo está 100% activa
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#eeeae4] text-left space-y-2 text-xs">
                <p className="font-bold text-[#3d3229] uppercase tracking-wider text-[11px]">
                  Tus herramientas activas:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">📱 App Web Suite Completa</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">📖 Ebook Método Vínculo (PDF / Web)</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#eeeae4]">
                  <span className="text-[#3d3229]">🎁 3 Bonos de Acompañamiento</span>
                  <span className="text-[#688a4d] font-bold">Desbloqueado</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-sm font-bold bg-[#d47e62] hover:bg-[#c46d52] text-white shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Entrar a la App ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
