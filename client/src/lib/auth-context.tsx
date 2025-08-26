import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = (user: User) => {
    setAuth({
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
    });
  };

  const setUser = (user: User | null) => {
    setAuth({
      user,
      isAuthenticated: !!user,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setUser }}>
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
