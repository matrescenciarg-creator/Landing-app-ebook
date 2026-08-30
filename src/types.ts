export type SignalCategory = 'llanto' | 'sueno' | 'cuerpo' | 'estres' | 'hambre';

export interface SignalItem {
  id: string;
  name: string;
  soundName?: string;
  category: SignalCategory;
  description: string;
  soundCue?: string;
  physicalCues: string[];
  meaning: string;
  confidence: number;
  urgency: 'baja' | 'media' | 'alta';
  actionSteps: string[];
  vinculoTip: string;
  audioSimulationUrl?: string;
  recommendedAgeMonths?: string;
}

export interface WakeWindowGuide {
  ageRange: string;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  wakeWindowMinutes: string;
  napsPerDay: string;
  earlySleepCues: string[];
  lateSleepCues: string[];
  expertAdvice: string;
}

export type LogCategory = 'senal' | 'lactancia' | 'biberon' | 'sueno' | 'panal';

export interface LogEntry {
  id: string;
  timestamp: string;
  babyName: string;
  signalType: string;
  category?: LogCategory;
  notes: string;
  calmedWith: string;
  resolved: boolean;
  // Specific optional fields for comprehensive tracking
  durationMinutes?: number;
  breastSide?: 'izquierdo' | 'derecho' | 'ambos';
  bottleMl?: number;
  diaperType?: 'humedo' | 'sucio' | 'mixto';
}

export interface BonusResource {
  id: string;
  number: number;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  bgClass: string;
  highlights: string[];
  fullContent?: string;
}

export interface BabyProfile {
  name: string;
  birthDate?: string; // YYYY-MM-DD
  gender?: 'niño' | 'niña' | 'sorpresa';
  weightKg?: string;
  notes?: string;
  soothingMethod?: string;
}

export interface UserPreferences {
  calmSoundVolume: number;
  notifySleepWindows: boolean;
  nightMode: boolean;
}

export interface EbookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  readTime: string;
  excerpt: string;
  fullText: string[];
  keyTakeaways: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  babyProfile: BabyProfile;
  preferences: UserPreferences;
  savedSignals?: string[];
  createdAt: string;
  updatedAt: string;
}
