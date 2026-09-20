import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorksSection } from './components/HowItWorksSection';
import { InteractiveDecoder } from './components/InteractiveDecoder';
import { SleepWindowCalculator } from './components/SleepWindowCalculator';
import { BenefitsSection } from './components/BenefitsSection';
import { MethodSection } from './components/MethodSection';
import { BonusesSection } from './components/BonusesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { EbookReaderModal } from './components/EbookReaderModal';
import { BitacoraTrackerModal } from './components/BitacoraTrackerModal';
import { BonusDetailModal } from './components/BonusDetailModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AppDashboard, AppTab } from './components/app/AppDashboard';
import { LogEntry, BonusResource, SignalItem } from './types';
import { HOTMART_CONFIG } from './config/hotmart';

function AppContent() {
  const { user, profile, cloudEntries, addCloudEntry, deleteCloudEntry, unlockMembership } = useAuth();

  // App View mode: 'landing' vs 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('acceso') === 'hotmart' ||
        urlParams.get('modo') === 'app' ||
        urlParams.get('app') === 'true' ||
        urlParams.get('unlocked') === 'true' ||
        urlParams.get('compra') === 'exitosa'
      ) {
        return 'app';
      }
    } catch {
      // ignore
    }
    return 'landing';
  });
  const [initialAppTab, setInitialAppTab] = useState<AppTab>('decoder');
  const [hotmartBannerVisible, setHotmartBannerVisible] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('acceso') === 'hotmart' || urlParams.get('compra') === 'exitosa';
    } catch {
      return false;
    }
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('acceso') === 'hotmart' || urlParams.get('unlocked') === 'true' || urlParams.get('compra') === 'exitosa') {
        localStorage.setItem('metodo_vinculo_unlocked', 'true');
        return true;
      }
      return localStorage.getItem('metodo_vinculo_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Check URL parameters for Hotmart purchase redirect
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('acceso') === 'hotmart' || urlParams.get('unlocked') === 'true' || urlParams.get('compra') === 'exitosa') {
        setIsUnlocked(true);
        setViewMode('app');
        setHotmartBannerVisible(true);
        localStorage.setItem('metodo_vinculo_unlocked', 'true');
        if (user && !profile?.isUnlocked) {
          unlockMembership();
        }
      }
    } catch {
      // ignore
    }
  }, [user, profile?.isUnlocked]);

  // Sync unlocked status with user profile
  useEffect(() => {
    if (profile?.isUnlocked) {
      setIsUnlocked(true);
      localStorage.setItem('metodo_vinculo_unlocked', 'true');
    }
  }, [profile?.isUnlocked]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isEbookReaderOpen, setIsEbookReaderOpen] = useState<boolean>(false);
  const [isBitacoraOpen, setIsBitacoraOpen] = useState<boolean>(false);
  const [selectedBonus, setSelectedBonus] = useState<BonusResource | null>(null);

  // Auth & Profile Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'baby' | 'resources' | 'account' | 'setup'>('setup');

  const openProfile = (tab: 'baby' | 'resources' | 'account' | 'setup' = 'setup') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  };

  // Local storage persisted log entries for guests
  const [localEntries, setLocalEntries] = useState<LogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('metodo_vinculo_entries');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'sample-1',
        timestamp: '14:20 - Hoy',
        babyName: 'Mi Bebé',
        category: 'hambre',
        signalType: 'Sonido "Neh" (Hambre temprana)',
        calmedWith: 'Pecho / Biberón a demanda',
        notes: 'Identificado a tiempo, tomó con calma sin tragar aire.',
        resolved: true
      },
      {
        id: 'sample-2',
        timestamp: '10:15 - Hoy',
        babyName: 'Mi Bebé',
        category: 'sueno',
        signalType: 'Sonido "Owh" (Ventana de sueño)',
        calmedWith: 'Bajar luces + ritual de 5 min con "Shhh"',
        notes: 'Se durmió plácidamente antes del sobrecansancio.',
        resolved: true
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('metodo_vinculo_entries', JSON.stringify(localEntries));
    } catch {
      // ignore
    }
  }, [localEntries]);

  // If user is logged in, use cloud entries; otherwise local entries
  const activeEntries = user && cloudEntries.length > 0 ? cloudEntries : localEntries;

  const handleCheckoutSuccess = (email: string) => {
    setIsUnlocked(true);
    try {
      localStorage.setItem('metodo_vinculo_unlocked', 'true');
    } catch {
      // ignore
    }
  };

  const handleAddLogEntry = async (newEntry: LogEntry) => {
    if (user) {
      await addCloudEntry(newEntry);
    }
    setLocalEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteLogEntry = async (id: string) => {
    if (user) {
      await deleteCloudEntry(id);
    }
    setLocalEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleLogSignalFromDecoder = async (signal: SignalItem) => {
    const babyName = profile?.babyProfile?.name || 'Mi Bebé';
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      babyName: babyName,
      category: 'senal',
      signalType: signal.name,
      calmedWith: signal.actionSteps[0] || 'Atención con Método Vínculo',
      notes: `Registrado desde el Traductor. Nivel de confianza: ${signal.confidence}%`,
      resolved: true
    };
    await handleAddLogEntry(newEntry);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const openAppTab = (tab: AppTab = 'decoder') => {
    setInitialAppTab(tab);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in 'app' view mode, render the dedicated App Dashboard Suite
  if (viewMode === 'app') {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfaf5] text-[#3d3229]">
        {hotmartBannerVisible && (
          <div className="bg-[#5c7c44] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs sticky top-0 z-50">
            <div className="flex items-center gap-2 max-w-4xl mx-auto flex-wrap">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#c8d6ba]" />
              <span>
                <strong>¡Acceso Hotmart Activado!</strong> Bienvenida a Método Vínculo.
              </span>
              <button
                type="button"
                onClick={() => openProfile('setup')}
                className="ml-2 px-3 py-1 bg-white text-[#5c7c44] font-bold text-xs rounded-full hover:bg-[#f4f1ec] transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                Guía de Configuración
              </button>
            </div>
            <button
              onClick={() => setHotmartBannerVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer shrink-0 ml-2"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <AppDashboard
          isUnlocked={isUnlocked}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenProfile={() => openProfile('setup')}
          onReturnToLanding={() => {
            setViewMode('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeEntries={activeEntries}
          onAddLogEntry={handleAddLogEntry}
          onDeleteLogEntry={handleDeleteLogEntry}
          initialTab={initialAppTab}
        />

        {/* Global Modals */}
        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={() => {
            setIsAuthOpen(false);
            setIsProfileOpen(true);
          }}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onOpenCheckout={() => {
            setIsProfileOpen(false);
            setIsCheckoutOpen(true);
          }}
          onOpenEbook={() => {
            setIsProfileOpen(false);
            openAppTab('ebook');
          }}
          onOpenBitacora={() => {
            setIsProfileOpen(false);
            openAppTab('tracker');
          }}
          onOpenAuth={(mode) => {
            setIsProfileOpen(false);
            openAuthModal(mode === 'login' ? 'login' : 'signup');
          }}
          initialTab={profileInitialTab}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      </div>
    );
  }

  // Otherwise render the Landing View
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf5] text-[#3d3229]">
      {hotmartBannerVisible && (
        <div className="bg-[#5c7c44] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-wrap">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#c8d6ba]" />
            <span>
              <strong>¡Acceso Hotmart Activado!</strong> Bienvenida a Método Vínculo.
            </span>
            <button
              onClick={() => openAppTab('decoder')}
              className="ml-2 px-3 py-1 bg-white text-[#5c7c44] font-bold text-xs rounded-full hover:bg-[#f4f1ec] transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              Entrar a la App
            </button>
            <button
              onClick={() => openProfile('setup')}
              className="px-3 py-1 bg-[#c8d6ba]/30 hover:bg-[#c8d6ba]/50 text-white font-bold text-xs rounded-full border border-[#c8d6ba] transition-all shrink-0 cursor-pointer"
            >
              Guía de Configuración
            </button>
          </div>
          <button
            onClick={() => setHotmartBannerVisible(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer shrink-0 ml-2"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenEbookPreview={() => openAppTab('ebook')}
        onOpenAuth={openAuthModal}
        onOpenProfile={() => openProfile('baby')}
        onOpenApp={() => openAppTab('decoder')}
        isUnlocked={isUnlocked}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onScrollToDemo={() => scrollToSection('traductor-interactivo')}
          onOpenApp={() => openAppTab('decoder')}
          isUnlocked={isUnlocked}
        />

        {/* Problem and How It Works */}
        <HowItWorksSection />

        {/* Interactive Cry & Signal Decoder Tool */}
        <InteractiveDecoder
          onLogSignal={handleLogSignalFromDecoder}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isUnlocked={isUnlocked}
        />

        {/* Interactive Sleep Window Calculator & Cues */}
        <SleepWindowCalculator
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isUnlocked={isUnlocked}
        />

        {/* Benefits Overview */}
        <BenefitsSection />

        {/* About Method & Ebook Bundle */}
        <MethodSection
          onOpenEbookPreview={() => openAppTab('ebook')}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isUnlocked={isUnlocked}
        />

        {/* 3 Bonuses Section */}
        <BonusesSection
          onOpenBonusModal={(bonus) => {
            if (bonus.id === 'bono-bitacora') {
              openAppTab('tracker');
            } else {
              openAppTab('bonuses');
            }
          }}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenBitacora={() => openAppTab('tracker')}
          isUnlocked={isUnlocked}
        />

        {/* Mother Testimonials */}
        <TestimonialsSection />

        {/* Pricing / $10 USD Access Card */}
        <PricingSection
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isUnlocked={isUnlocked}
        />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Final CTA Banner */}
        <FinalCtaSection
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isUnlocked={isUnlocked}
        />

      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          setIsProfileOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenCheckout={() => {
          setIsProfileOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenEbook={() => {
          setIsProfileOpen(false);
          openAppTab('ebook');
        }}
        onOpenBitacora={() => {
          setIsProfileOpen(false);
          openAppTab('tracker');
        }}
        onOpenAuth={(mode) => {
          setIsProfileOpen(false);
          openAuthModal(mode === 'login' ? 'login' : 'signup');
        }}
        initialTab={profileInitialTab}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      <EbookReaderModal
        isOpen={isEbookReaderOpen}
        onClose={() => setIsEbookReaderOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        isUnlocked={isUnlocked}
      />

      <BitacoraTrackerModal
        isOpen={isBitacoraOpen}
        onClose={() => setIsBitacoraOpen(false)}
        entries={activeEntries}
        onAddEntry={handleAddLogEntry}
        onDeleteEntry={handleDeleteLogEntry}
      />

      <BonusDetailModal
        bonus={selectedBonus}
        onClose={() => setSelectedBonus(null)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        isUnlocked={isUnlocked}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
