import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserPreferences {
  country: string;
  language: string;
  setupComplete: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setCountry: (country: string) => void;
  setLanguage: (language: string) => void;
  completeSetup: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    country: '',
    language: '',
    setupComplete: false,
  });

  const setCountry = (country: string) => setPreferences(p => ({ ...p, country }));
  const setLanguage = (language: string) => setPreferences(p => ({ ...p, language }));
  const completeSetup = () => setPreferences(p => ({ ...p, setupComplete: true }));

  return (
    <UserPreferencesContext.Provider value={{ preferences, setCountry, setLanguage, completeSetup }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within UserPreferencesProvider');
  return ctx;
};
