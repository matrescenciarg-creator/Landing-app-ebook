import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-14 text-center bg-[#3d3229] border-t border-[#4f4237]">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-[#d47e62] fill-[#d47e62]" />
          <p className="text-2xl font-bold tracking-wide text-[#fdfaf5]" style={{ fontFamily: 'Georgia, serif' }}>
            Matrescencia
          </p>
        </div>
        <p className="text-sm font-medium text-[#c9bfb5]">
          Método Vínculo — descifra las señales de tu bebé
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs mt-6 text-[#c9bfb5]/80">
          <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#traductor-interactivo" className="hover:text-white transition-colors">Traductor</a>
          <a href="#ventanas-sueno" className="hover:text-white transition-colors">Ventanas de sueño</a>
          <a href="#precio" className="hover:text-white transition-colors">Precio</a>
          <a href="#faq" className="hover:text-white transition-colors">Preguntas frecuentes</a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#c9bfb5]/60 max-w-xl mx-auto">
          <p>© 2026 Matrescencia. Todos los derechos reservados.</p>
          <p className="mt-2 text-[11px] leading-relaxed">
            La información y herramientas brindadas tienen propósitos pedagógicos y de apoyo a la crianza. Ante cualquier señal de alarma o duda médica sobre la salud de tu bebé, consulta siempre a tu pediatra de cabecera.
          </p>
        </div>
      </div>
    </footer>
  );
};
