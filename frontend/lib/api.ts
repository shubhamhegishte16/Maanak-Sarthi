import axios from 'axios';
import type { User } from '@/context/AuthContext';

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('manak_saarthi_token') || window.sessionStorage.getItem('manak_saarthi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (input: { name: string; email: string; phone: string; password: string; role: User['role'] }) => api.post<AuthResponse>('/api/auth/register', input),
  login: (input: { email: string; password: string }) => api.post<AuthResponse>('/api/auth/login', input),
  me: () => api.get<{ success: boolean; user: User }>('/api/auth/me'),
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || fallback;
  return fallback;
}