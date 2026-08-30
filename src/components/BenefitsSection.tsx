import React from 'react';
import { Volume2, Moon, Compass, BookCheck, Zap, Heart } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Volume2 className="w-6 h-6 text-[#d47e62]" />,
      title: 'Traductor de llanto',
      desc: 'Identifica los patrones más comunes de llanto y qué suelen significar.'
    },
    {
      icon: <Moon className="w-6 h-6 text-[#d4a34b]" />,
      title: 'Señales de sueño',
      desc: 'Reconoce las ventanas de sueño antes de que llegue el sobrecansancio.'
    },
    {
      icon: <Compass className="w-6 h-6 text-[#688a4d]" />,
      title: 'Guías de respuesta',
      desc: 'Pasos concretos y calmados para cada situación, sin juicios ni fórmulas rígidas.'
    },
    {
      icon: <BookCheck className="w-6 h-6 text-[#d47e62]" />,
      title: 'Basada en el Método Vínculo',
      desc: 'La misma base del ebook Método Vínculo, adaptada a un formato rápido de consulta.'
    },
    {
      icon: <Zap className="w-6 h-6 text-[#d4a34b]" />,
      title: 'Acceso inmediato',
      desc: 'Compras hoy, usas la app hoy. Sin listas de espera ni pasos complicados.'
    },
    {
      icon: <Heart className="w-6 h-6 text-[#688a4d]" />,
      title: 'Pensada para mamás cansadas',
      desc: 'Interfaz simple, respuestas cortas, lectura rápida a altas horas de la noche, cero letra pequeña.'
    }
  ];

  return (
    <section className="py-20 bg-[#fffdfb] border-t border-[#eeeae4]">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d47e62]">
            Beneficios Clave
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3229] mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            Todo lo que la app te da
          </h2>
          <p className="mt-3 text-[#7a6f65] text-base">
            Pensada para el día a día real de la crianza, no para leer un manual entero.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div key={idx} className="rounded-[28px] p-7 bg-white border border-[#eeeae4] shadow-xs hover:border-[#d47e62]/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f1ec] border border-[#eeeae4] flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#3d3229] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {item.title}
              </h3>
              <p className="text-sm text-[#7a6f65] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
