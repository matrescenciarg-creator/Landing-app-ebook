import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: '"Antes buscaba en internet a cualquier hora. Ahora abro la app y en dos minutos tengo una respuesta que tiene sentido."',
      name: 'Camila',
      role: 'Mamá primeriza',
      babyAge: 'Bebé de 2 meses',
      verified: true
    },
    {
      quote: '"Me ayudó a distinguir el llanto de sueño del de hambre. Suena simple pero cambió completamente mis noches."',
      name: 'Valentina',
      role: 'Mamá de Mateo',
      babyAge: 'Bebé de 6 semanas',
      verified: true
    },
    {
      quote: '"Por $10 esperaba poco. Es justo lo que necesitaba: algo rápido, claro, sin vueltas y súper respetuoso con el apego."',
      name: 'Renata',
      role: 'Mamá de Sofía',
      babyAge: 'Bebé de 4 meses',
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-[#fdfaf5] border-t border-[#eeeae4]">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d47e62] bg-[#f4f1ec] border border-[#eeeae4] px-4 py-1.5 rounded-full mb-3 inline-block">
            Experiencias Reales
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
            Mamás que ya la están usando
          </h2>
          <p className="mt-3 text-sm text-[#7a6f65]">
            Historias de familias que transformaron las noches de incertidumbre en momentos de calma y conexión.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="rounded-[28px] p-7 bg-white border border-[#eeeae4] shadow-xs flex flex-col justify-between relative hover:border-[#d47e62]/40 transition-all">
              <Quote className="w-8 h-8 text-[#d47e62]/15 absolute top-6 right-6" />
              <div>
                <div className="flex items-center gap-1 mb-4 text-[#d4a34b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4a34b]" />
                  ))}
                </div>
                <p className="text-sm text-[#3d3229] italic leading-relaxed mb-6">
                  {t.quote}
                </p>
              </div>

              <div className="pt-4 border-t border-[#eeeae4] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#3d3229]">
                    — {t.name}, <span className="font-normal text-xs text-[#7a6f65]">{t.role}</span>
                  </p>
                </div>
                <span className="text-[11px] font-semibold bg-[#f4f1ec] text-[#688a4d] px-3 py-1 rounded-full border border-[#eeeae4]">
                  {t.babyAge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#7a6f65]/70 mt-8">
          * Testimonios de familias de la comunidad Matrescencia.
        </p>
      </div>
    </section>
  );
};
