import React, { useState, useEffect } from 'react';
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

function AppContent() {
  const { user, profile, cloudEntries, addCloudEntry, deleteCloudEntry } = useAuth();

  // App View mode: 'landing' vs 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [initialAppTab, setInitialAppTab] = useState<AppTab>('decoder');

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('metodo_vinculo_unlocked') === 'true';
    } catch {
      return false;
    }
  });

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
        <AppDashboard
          isUnlocked={isUnlocked}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
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
      
      {/* Sticky Navigation */}
      <Navbar
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenEbookPreview={() => openAppTab('ebook')}
        onOpenAuth={openAuthModal}
        onOpenProfile={() => setIsProfileOpen(true)}
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
