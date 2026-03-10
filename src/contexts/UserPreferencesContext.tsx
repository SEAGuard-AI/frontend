import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
}

interface UserPreferences {
  country: string;
  language: string;
  setupComplete: boolean;
  location: UserLocation | null;
  theme: 'light' | 'dark';
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  setLocation: (location: UserLocation) => void;
  completeSetup: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const storageKey = user ? `seaguard_preferences_${user.id}` : 'seaguard_preferences_guest';

  const [currentKey, setCurrentKey] = useState(storageKey);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      country: '',
      language: '',
      setupComplete: false,
      location: null,
      theme: 'dark',
    };
  });

  // Synchronously load from local storage when the user (storageKey) changes
  if (storageKey !== currentKey) {
    setCurrentKey(storageKey);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPreferences(JSON.parse(saved));
      } else {
        setPreferences({
          country: '',
          language: '',
          setupComplete: false,
          location: null,
          theme: 'dark',
        });
      }
    } catch {
      setPreferences({
        country: '',
        language: '',
        setupComplete: false,
        location: null,
        theme: 'dark',
      });
    }
  }

  // Save to local storage whenever preferences change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences, storageKey]);

  // Sync .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [preferences.theme]);

  const setCountry = (country: string) => setPreferences(p => ({ ...p, country }));
  const setLanguage = (language: string) => setPreferences(p => ({ ...p, language }));
  const setLocation = (location: UserLocation) => setPreferences(p => ({ ...p, location }));
  const completeSetup = () => setPreferences(p => ({ ...p, setupComplete: true }));
  const setTheme = (theme: 'light' | 'dark') => setPreferences(p => ({ ...p, theme }));

  return (
    <UserPreferencesContext.Provider value={{ preferences, setCountry, setLanguage, setLocation, completeSetup, setTheme }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within UserPreferencesProvider');
  return ctx;
};
