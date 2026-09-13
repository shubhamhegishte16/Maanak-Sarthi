"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

export type UserRole = 'consumer' | 'business' | 'lab';
export interface User { id: string; name: string; email: string; phone: string | null; role: UserRole; }
export const roleLabels: Record<UserRole, string> = { consumer: 'Citizen Consumer', business: 'Manufacturer', lab: 'BIS Lab Officer' };

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<User>;
  register: (input: { name: string; email: string; phone: string; password: string; role: UserRole }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'manak_saarthi_token';

function storeToken(token: string, remember: boolean) {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  (remember ? window.localStorage : window.sessionStorage).setItem(TOKEN_KEY, token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.user);
      return response.data.user;
    } catch {
      window.localStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    void refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    const response = await authApi.login({ email, password });
    storeToken(response.data.token, remember);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (input: { name: string; email: string; phone: string; password: string; role: UserRole }) => {
    const response = await authApi.register(input);
    storeToken(response.data.token, true);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => { window.localStorage.removeItem(TOKEN_KEY); window.sessionStorage.removeItem(TOKEN_KEY); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}