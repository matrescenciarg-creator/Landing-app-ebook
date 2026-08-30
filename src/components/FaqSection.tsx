import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Incluye el ebook completo del Método Vínculo?',
      a: 'Sí. Tu compra incluye la app interactiva y el ebook completo en formato digital para leer online o descargar, donde se aborda en profundidad el sueño de tu bebé, los 5 sonidos reflejos y el resto del método.'
    },
    {
      q: '¿Sirve para bebés de cualquier edad?',
      a: 'Está pensada principalmente para los primeros meses (de 0 a 12 meses), cuando más cuesta interpretar las señales y cuando los sonidos reflejos universales están más activos. También incluye guías de transición de siestas hasta el primer año.'
    },
    {
      q: '¿Es una suscripción?',
      a: 'No. Es un pago único de $10 USD con acceso completo e ilimitado para siempre, sin cargos recurrentes ni costes sorpresa.'
    },
    {
      q: '¿Cómo accedo a la app y a los bonos tras pagar?',
      a: 'Recibes acceso inmediato directo en tu pantalla tras completar el pago, y además te enviamos una copia con todos los enlaces de descarga directa y claves a tu correo electrónico.'
    },
    {
      q: '¿Puedo usarla desde el teléfono móvil a las 3:00 AM?',
      a: 'Totalmente. La app está 100% optimizada para pantallas móviles, con diseño pensado para leer con poca luz y encontrar respuestas en menos de 30 segundos.'
    },
    {
      q: '¿Puedo imprimir la bitácora y las guías?',
      a: 'Sí, la bitácora incluye tanto la versión interactiva digital en la app como el formato PDF listo para imprimir en tamaño carta/A4 si prefieres anotar a mano en la mesita de noche.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#fffdfb] border-t border-[#eeeae4]">
      <div className="container-custom max-w-2xl">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3">
            Dudas Frecuentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-[24px] bg-white border border-[#eeeae4] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <h3 className="font-semibold text-base sm:text-lg text-[#3d3229]">
                    {faq.q}
                  </h3>
                  <ChevronDown className={`w-5 h-5 text-[#d47e62] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 pt-1 text-sm text-[#7a6f65] leading-relaxed border-t border-[#f4f1ec]">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
