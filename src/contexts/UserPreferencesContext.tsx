import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  setLocation: (location: UserLocation) => void;
  completeSetup: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    country: '',
    language: '',
    setupComplete: false,
    location: null,
  });

  const setCountry = (country: string) => setPreferences(p => ({ ...p, country }));
  const setLanguage = (language: string) => setPreferences(p => ({ ...p, language }));
  const setLocation = (location: UserLocation) => setPreferences(p => ({ ...p, location }));
  const completeSetup = () => setPreferences(p => ({ ...p, setupComplete: true }));

  return (
    <UserPreferencesContext.Provider value={{ preferences, setCountry, setLanguage, setLocation, completeSetup }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within UserPreferencesProvider');
  return ctx;
};
