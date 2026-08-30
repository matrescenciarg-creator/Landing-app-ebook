import React, { useState } from 'react';
import {
  Sparkles,
  Baby,
  Moon,
  Milk,
  BookOpen,
  Volume2,
  Gift,
  User,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { InteractiveDecoder } from '../InteractiveDecoder';
import { SleepWindowCalculator } from '../SleepWindowCalculator';
import { AppTracker } from './AppTracker';
import { AppCalmCenter } from './AppCalmCenter';
import { AppEbookReader } from './AppEbookReader';
import { AppBonuses } from './AppBonuses';
import { LogEntry, SignalItem } from '../../types';

export type AppTab = 'decoder' | 'sleep' | 'tracker' | 'calm' | 'ebook' | 'bonuses';

interface AppDashboardProps {
  isUnlocked: boolean;
  onOpenCheckout: () => void;
  onOpenProfile: () => void;
  onReturnToLanding: () => void;
  activeEntries: LogEntry[];
  onAddLogEntry: (entry: LogEntry) => Promise<void> | void;
  onDeleteLogEntry: (id: string) => Promise<void> | void;
  initialTab?: AppTab;
}

export const AppDashboard: React.FC<AppDashboardProps> = ({
  isUnlocked,
  onOpenCheckout,
  onOpenProfile,
  onReturnToLanding,
  activeEntries,
  onAddLogEntry,
  onDeleteLogEntry,
  initialTab = 'decoder'
}) => {
  const { user, profile } = useAuth();
  const [currentTab, setCurrentTab] = useState<AppTab>(initialTab);

  const babyName = profile?.babyProfile?.name || 'Mi Bebé';
  const babyBirthDate = profile?.babyProfile?.birthDate;

  // Calculate age string if birthDate is set
  const calculateBabyAge = () => {
    if (!babyBirthDate) return 'Primeros meses';
    try {
      const birth = new Date(babyBirthDate);
      const now = new Date();
      const diffMs = now.getTime() - birth.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const months = Math.floor(diffDays / 30.4);

      if (weeks < 8) return `${weeks} semanas`;
      if (months < 12) return `${months} meses`;
      return `${Math.floor(months / 12)} año(s)`;
    } catch {
      return '0 - 12 meses';
    }
  };

  const handleLogSignalFromDecoder = async (signal: SignalItem) => {
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
      babyName: babyName,
      category: 'senal',
      signalType: signal.name,
      calmedWith: signal.actionSteps[0] || 'Atención con Método Vínculo',
      notes: `Registrado desde el Traductor. Confianza: ${signal.confidence}%`,
      resolved: true
    };
    await onAddLogEntry(newEntry);
  };

  const navTabs = [
    { id: 'decoder', label: 'Traductor de Señales', icon: Sparkles, color: 'text-[#d47e62]' },
    { id: 'sleep', label: 'Ventanas de Sueño', icon: Moon, color: 'text-[#dfa745]' },
    { id: 'tracker', label: 'Bitácora & Lactancia', icon: Milk, color: 'text-[#688a4d]' },
    { id: 'calm', label: 'Centro de Calma & Audio', icon: Volume2, color: 'text-[#d47e62]' },
    { id: 'ebook', label: 'Ebook Completo', icon: BookOpen, color: 'text-[#3d3229]' },
    { id: 'bonuses', label: '3 Bonos Exclusivos', icon: Gift, color: 'text-[#dfa745]' }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#3d3229] flex flex-col">
      
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eeeae4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Return to landing + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToLanding}
              className="p-2 rounded-xl bg-[#f4f1ec] text-[#3d3229] hover:bg-[#eae5dd] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Volver a la página principal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Página Principal</span>
            </button>

            <div className="h-4 w-px bg-[#eeeae4] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#d47e62] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                MV
              </span>
              <div>
                <span className="text-sm font-bold tracking-tight text-[#3d3229] hidden sm:inline" style={{ fontFamily: 'Georgia, serif' }}>
                  Método Vínculo
                </span>
                <span className="text-[10px] font-bold text-[#d47e62] bg-[#d47e62]/10 px-1.5 py-0.5 rounded-md ml-1.5 uppercase">
                  App Suite
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Baby Badge & User profile / Checkout */}
          <div className="flex items-center gap-2.5">
            
            {/* Baby Pill */}
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-full bg-[#fdfaf5] hover:bg-[#f4f1ec] border border-[#eeeae4] text-xs font-medium text-[#3d3229] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Baby className="w-3.5 h-3.5 text-[#d47e62]" />
              <span className="font-bold">{babyName}</span>
              <span className="text-[10px] text-[#7a6f65] hidden md:inline">({calculateBabyAge()})</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-full bg-[#f4f1ec] text-[#3d3229] hover:bg-[#eae5dd] transition-colors cursor-pointer"
              title="Ajustes de Perfil"
            >
              <User className="w-4 h-4" />
            </button>

            {/* If not unlocked, show upgrade button */}
            {!isUnlocked && (
              <button
                onClick={onOpenCheckout}
                className="px-3.5 py-1.5 rounded-full bg-[#d47e62] hover:bg-[#c46d52] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desbloquear Todo</span>
                <span>$10</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Strip (Horizontal scroll on mobile) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar border-t border-[#f4f1ec]">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as AppTab)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#3d3229] text-white shadow-xs'
                      : 'bg-transparent text-[#7a6f65] hover:bg-[#f4f1ec] hover:text-[#3d3229]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentTab === 'decoder' && (
          <div className="space-y-6">
            <InteractiveDecoder
              onLogSignal={handleLogSignalFromDecoder}
              onOpenCheckout={onOpenCheckout}
              isUnlocked={isUnlocked}
            />
          </div>
        )}

        {currentTab === 'sleep' && (
          <div className="space-y-6">
            <SleepWindowCalculator
              onOpenCheckout={onOpenCheckout}
              isUnlocked={isUnlocked}
            />
          </div>
        )}

        {currentTab === 'tracker' && (
          <div className="space-y-6">
            <AppTracker
              entries={activeEntries}
              onAddEntry={onAddLogEntry}
              onDeleteEntry={onDeleteLogEntry}
              babyName={babyName}
            />
          </div>
        )}

        {currentTab === 'calm' && (
          <div className="space-y-6">
            <AppCalmCenter
              onLogCalmAction={(sound, mins) => {
                const newEntry: LogEntry = {
                  id: Date.now().toString(),
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - Hoy',
                  babyName: babyName,
                  category: 'senal',
                  signalType: `Calma con ${sound} (${mins} min)`,
                  calmedWith: 'Generador de Ruido Blanco & Sonidos del Método Vínculo',
                  notes: 'Sesión de relajación completada.',
                  resolved: true
                };
                onAddLogEntry(newEntry);
              }}
            />
          </div>
        )}

        {currentTab === 'ebook' && (
          <div className="space-y-6">
            <AppEbookReader
              isUnlocked={isUnlocked}
              onOpenCheckout={onOpenCheckout}
            />
          </div>
        )}

        {currentTab === 'bonuses' && (
          <div className="space-y-6">
            <AppBonuses
              isUnlocked={isUnlocked}
              onOpenCheckout={onOpenCheckout}
            />
          </div>
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-[#eeeae4] py-6 text-center text-xs text-[#7a6f65]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Matrescencia · Método Vínculo</p>
          <div className="flex items-center gap-4">
            <button onClick={onReturnToLanding} className="hover:text-[#3d3229] font-medium cursor-pointer">
              Ver Landing Informativa
            </button>
            <span>·</span>
            <button onClick={onOpenProfile} className="hover:text-[#3d3229] font-medium cursor-pointer">
              Mi Perfil & Bebé
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
