import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <>
      {/* PROBLEMA SECTION */}
      <section className="py-16 md:py-20 bg-[#fdfaf5]">
        <div className="container-custom max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#f4f1ec] border border-[#eeeae4] text-[#7a6f65] text-xs font-bold tracking-widest uppercase px-3.5 py-1 rounded-full mb-4">
            El Desafío Cotidiano
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            ¿Te cuesta entender qué necesita tu bebé?
          </h2>
          <p className="mt-5 text-[#7a6f65] text-base md:text-lg leading-relaxed">
            Llora y no sabes si es hambre, sueño o incomodidad. Cambia de humor de un minuto a otro. Buscas respuestas en internet a las 3 de la mañana y cada fuente dice algo distinto. <strong className="text-[#3d3229] font-semibold">No es falta de instinto: es falta de una guía clara.</strong>
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA SECTION */}
      <section id="como-funciona" className="py-20 bg-[#fffdfb] border-t border-[#eeeae4]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d47e62]">
              Paso a Paso
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229] mt-2" style={{ fontFamily: 'Georgia, serif' }}>
              Cómo funciona la app
            </h2>
            <p className="mt-3 text-[#7a6f65] text-base">
              Tres pasos, basados en el Método Vínculo, para pasar de la duda a la calma.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-[28px] border border-[#eeeae4] shadow-xs flex flex-col justify-between hover:border-[#d47e62]/40 transition-all">
              <div>
                <div className="w-12 h-12 mb-6 rounded-2xl bg-[#d47e62] text-white flex items-center justify-center font-bold text-lg shadow-xs" style={{ fontFamily: 'Georgia, serif' }}>
                  1
                </div>
                <h3 className="text-xl font-bold text-[#3d3229] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Registra la señal
                </h3>
                <p className="text-sm text-[#7a6f65] leading-relaxed">
                  Anota el llanto, el gesto reflejo o el patrón de vigilia que estás observando en tu bebé.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f4f1ec] text-[11px] font-bold text-[#d47e62] uppercase tracking-wider">
                Observación consciente
              </div>
            </div>

            <div className="bg-white p-8 rounded-[28px] border border-[#eeeae4] shadow-xs flex flex-col justify-between hover:border-[#d4a34b]/40 transition-all">
              <div>
                <div className="w-12 h-12 mb-6 rounded-2xl bg-[#d4a34b] text-white flex items-center justify-center font-bold text-lg shadow-xs" style={{ fontFamily: 'Georgia, serif' }}>
                  2
                </div>
                <h3 className="text-xl font-bold text-[#3d3229] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  La app la interpreta
                </h3>
                <p className="text-sm text-[#7a6f65] leading-relaxed">
                  El Método Vínculo traduce la señal en una posible necesidad con explicaciones sencillas y nivel de confianza.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f4f1ec] text-[11px] font-bold text-[#d4a34b] uppercase tracking-wider">
                Decodificación precisa
              </div>
            </div>

            <div className="bg-white p-8 rounded-[28px] border border-[#eeeae4] shadow-xs flex flex-col justify-between hover:border-[#688a4d]/40 transition-all">
              <div>
                <div className="w-12 h-12 mb-6 rounded-2xl bg-[#c8d6ba] text-[#3d3229] flex items-center justify-center font-bold text-lg shadow-xs" style={{ fontFamily: 'Georgia, serif' }}>
                  3
                </div>
                <h3 className="text-xl font-bold text-[#3d3229] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Actúas con calma
                </h3>
                <p className="text-sm text-[#7a6f65] leading-relaxed">
                  Recibes un protocolo de respuesta paso a paso con sonidos de calma para responder con seguridad.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#f4f1ec] text-[11px] font-bold text-[#688a4d] uppercase tracking-wider">
                Contención & Alivio
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
