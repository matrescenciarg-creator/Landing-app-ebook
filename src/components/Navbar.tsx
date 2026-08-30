import React from 'react';
import { Sparkles, BookOpen, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCheckout: () => void;
  onOpenEbookPreview: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  isUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckout,
  onOpenEbookPreview,
  onOpenAuth,
  onOpenProfile,
  isUnlocked
}) => {
  const { user, profile } = useAuth();
  const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eeeae4] transition-all">
      <div className="container-custom flex items-center justify-between py-3.5">
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#d47e62] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:scale-105 transition-transform" style={{ fontFamily: 'Georgia, serif' }}>
              M
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#3d3229]" style={{ fontFamily: 'Georgia, serif' }}>
                Matrescencia
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-[11px] uppercase tracking-widest font-semibold text-[#7a6f65] bg-[#f4f1ec] px-2.5 py-0.5 rounded-full border border-[#eeeae4]">
                Método Vínculo
              </span>
            </div>
          </a>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#7a6f65]">
          <a href="#como-funciona" className="hover:text-[#d47e62] transition-colors">
            Cómo funciona
          </a>
          <a href="#traductor-interactivo" className="hover:text-[#d47e62] transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a34b]" />
            Traductor en vivo
          </a>
          <a href="#ventanas-sueno" className="hover:text-[#d47e62] transition-colors">
            Ventanas de sueño
          </a>
          <a href="#sobre-el-metodo" className="hover:text-[#d47e62] transition-colors">
            El Método
          </a>
          <a href="#bonos" className="hover:text-[#d47e62] transition-colors">
            Bonos
          </a>
          <a href="#faq" className="hover:text-[#d47e62] transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="nav-ebook-preview-btn"
            onClick={onOpenEbookPreview}
            className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#3d3229] hover:text-[#d47e62] bg-[#f4f1ec] hover:bg-[#eae5dd] border border-[#eeeae4] px-3.5 py-2 rounded-full transition-all"
            title="Ver índice y capítulos del Ebook"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#d47e62]" />
            <span>{isUnlocked ? 'Leer Ebook' : 'Ver Ebook'}</span>
          </button>

          {/* User Auth / Profile CTA */}
          {user ? (
            <button
              id="nav-user-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 text-xs font-bold text-[#3d3229] bg-[#fdfaf5] hover:bg-[#f4f1ec] border border-[#eeeae4] px-3.5 py-2 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#d47e62] text-white flex items-center justify-center text-[11px] font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : 'M'}
              </div>
              <span className="max-w-[90px] sm:max-w-[120px] truncate">{displayName || 'Mi Perfil'}</span>
            </button>
          ) : (
            <button
              id="nav-login-btn"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#3d3229] hover:text-[#d47e62] px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}

          {isUnlocked ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#3d3229] bg-[#c8d6ba]/40 border border-[#c8d6ba] px-3.5 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#688a4d] animate-pulse" />
              Acceso Activo
            </span>
          ) : (
            <button
              id="nav-cta-buy-btn"
              onClick={onOpenCheckout}
              className="bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2 rounded-full shadow-sm hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Acceso Full · $10</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

