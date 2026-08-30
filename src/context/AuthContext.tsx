import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile, BabyProfile, UserPreferences, LogEntry } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signUpWithEmail: (email: string, pass: string, name: string, babyName?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateBabyProfile: (data: Partial<BabyProfile>) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>;
  unlockMembership: () => Promise<void>;
  cloudEntries: LogEntry[];
  addCloudEntry: (entry: LogEntry) => Promise<void>;
  deleteCloudEntry: (id: string) => Promise<void>;
}

const defaultBabyProfile: BabyProfile = {
  name: 'Mi Bebé',
  gender: 'sorpresa',
  notes: '',
  soothingMethod: 'Ritual de calma con Método Vínculo',
};

const defaultPreferences: UserPreferences = {
  calmSoundVolume: 80,
  notifySleepWindows: true,
  nightMode: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudEntries, setCloudEntries] = useState<LogEntry[]>([]);

  const clearAuthError = () => setAuthError(null);

  // Initialize or fetch user document from Firestore
  const syncOrCreateUserProfile = async (firebaseUser: User, customDisplayName?: string, babyName?: string): Promise<UserProfile> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        return data;
      } else {
        const initialProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: customDisplayName || firebaseUser.displayName || 'Mamá / Papá',
          photoURL: firebaseUser.photoURL || undefined,
          isUnlocked: localStorage.getItem('metodo_vinculo_unlocked') === 'true',
          babyProfile: {
            ...defaultBabyProfile,
            name: babyName || 'Mi Bebé'
          },
          preferences: defaultPreferences,
          savedSignals: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, initialProfile);
        setProfile(initialProfile);
        return initialProfile;
      }
    } catch (err: any) {
      console.error('Error fetching or creating user profile in Firestore:', err);
      // Fallback local profile
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: customDisplayName || firebaseUser.displayName || 'Mamá / Papá',
        isUnlocked: localStorage.getItem('metodo_vinculo_unlocked') === 'true',
        babyProfile: defaultBabyProfile,
        preferences: defaultPreferences,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeEntries: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        await syncOrCreateUserProfile(currentUser);

        // Realtime listener for user profile changes
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const updated = docSnap.data() as UserProfile;
            setProfile(updated);
            if (updated.isUnlocked) {
              localStorage.setItem('metodo_vinculo_unlocked', 'true');
            }
          }
        }, (error) => {
          console.error('Snapshot error on user doc:', error);
        });

        // Realtime listener for bitacora entries in subcollection users/{uid}/bitacora
        const entriesRef = collection(db, 'users', currentUser.uid, 'bitacora');
        unsubscribeEntries = onSnapshot(entriesRef, (snapshot) => {
          const loaded: LogEntry[] = [];
          snapshot.forEach((doc) => {
            loaded.push({ id: doc.id, ...doc.data() } as LogEntry);
          });
          // Sort newest first
          loaded.sort((a, b) => (b.id > a.id ? 1 : -1));
          setCloudEntries(loaded);
        }, (error) => {
          console.warn('Snapshot error on bitacora entries:', error);
        });

        setLoading(false);
      } else {
        setProfile(null);
        setCloudEntries([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeEntries) unsubscribeEntries();
    };
  }, []);

  const signUpWithEmail = async (email: string, pass: string, name: string, babyName?: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateFirebaseProfile(cred.user, { displayName: name.trim() });
      }
      await syncOrCreateUserProfile(cred.user, name.trim(), babyName?.trim());
    } catch (err: any) {
      console.error('Sign up error:', err);
      let message = 'Error al registrarse. Por favor verifica los datos.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Este correo ya está registrado. Por favor inicia sesión.';
      } else if (err.code === 'auth/weak-password') {
        message = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'El formato de correo no es válido.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await syncOrCreateUserProfile(cred.user);
    } catch (err: any) {
      console.error('Sign in error:', err);
      let message = 'Credenciales inválidas. Verifica tu correo y contraseña.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Formato de correo no válido.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncOrCreateUserProfile(cred.user);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        const message = 'No se pudo iniciar sesión con Google. Inténtalo de nuevo o usa correo.';
        setAuthError(message);
        throw new Error(message);
      }
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
    setProfile(null);
    setCloudEntries([]);
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error('Password reset error:', err);
      let message = 'No pudimos enviar el correo de recuperación. Revisa la dirección ingresada.';
      if (err.code === 'auth/user-not-found') {
        message = 'No encontramos una cuenta con ese correo.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const updated = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    try {
      await updateDoc(userRef, updated);
      setProfile(prev => prev ? ({ ...prev, ...updated }) : null);
    } catch (err) {
      console.error('Error updating user profile:', err);
      // Fallback local update
      setProfile(prev => prev ? ({ ...prev, ...updated }) : null);
    }
  };

  const updateBabyProfile = async (data: Partial<BabyProfile>) => {
    if (!user || !profile) return;
    const newBaby = { ...profile.babyProfile, ...data };
    await updateUserProfile({ babyProfile: newBaby });
  };

  const updatePreferences = async (data: Partial<UserPreferences>) => {
    if (!user || !profile) return;
    const newPrefs = { ...profile.preferences, ...data };
    await updateUserProfile({ preferences: newPrefs });
  };

  const unlockMembership = async () => {
    localStorage.setItem('metodo_vinculo_unlocked', 'true');
    if (user) {
      await updateUserProfile({
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      });
    }
  };

  const addCloudEntry = async (entry: LogEntry) => {
    if (!user) return;
    try {
      const entryRef = doc(db, 'users', user.uid, 'bitacora', entry.id);
      await setDoc(entryRef, {
        timestamp: entry.timestamp,
        babyName: entry.babyName,
        signalType: entry.signalType,
        notes: entry.notes,
        calmedWith: entry.calmedWith,
        resolved: entry.resolved,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error adding cloud bitacora entry:', err);
    }
  };

  const deleteCloudEntry = async (id: string) => {
    if (!user) return;
    try {
      const entryRef = doc(db, 'users', user.uid, 'bitacora', id);
      await deleteDoc(entryRef);
    } catch (err) {
      console.error('Error deleting cloud bitacora entry:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        clearAuthError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        updateBabyProfile,
        updatePreferences,
        unlockMembership,
        cloudEntries,
        addCloudEntry,
        deleteCloudEntry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
