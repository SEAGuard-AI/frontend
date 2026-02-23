import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    // Mock auth
    setUser({ id: '1', email, name: email.split('@')[0], isGuest: false });
  };

  const guestLogin = () => {
    setUser({ id: 'guest', email: '', name: 'Guest User', isGuest: true });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, guestLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
