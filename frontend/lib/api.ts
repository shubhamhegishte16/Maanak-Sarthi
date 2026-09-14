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

export interface ChatMessage {
  id: string;
  sessionId?: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  mode?: 'bis_grounded' | 'general' | 'clarification';
  confidence?: 'high' | 'medium' | 'low';
  evidence?: {
    sourceTitle: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    verifiedDate?: string;
    confidence: 'high' | 'medium' | 'low';
  };
  actions?: {
    label: string;
    href: string;
    icon: 'standard' | 'certification' | 'lab';
  }[];
  sources?: {
    title: string;
    url: string;
    domain: string;
    documentNumber?: string;
    clause?: string;
    excerpt?: string;
    confidence: 'high' | 'medium' | 'low';
  }[];
  followUpQuestions?: string[];
  disclaimer?: string;
  createdAt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  mode: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export const authApi = {
  register: (input: { name: string; email: string; phone?: string; password: string; role: User['role'] }) => api.post<AuthResponse>('/api/auth/register', input),
  login: (input: { email: string; password: string }) => api.post<AuthResponse>('/api/auth/login', input),
  me: () => api.get<{ success: boolean; user: User }>('/api/auth/me'),
};

export const chatApi = {
  sendMessage: (data: { sessionId?: string; message: string }) =>
    api.post<{ success: boolean; sessionId: string; message: ChatMessage }>('/api/chat', data),
  getChats: () =>
    api.get<{ success: boolean; sessions: ChatSession[] }>('/api/chats'),
  createChat: (title?: string) =>
    api.post<{ success: boolean; session: ChatSession }>('/api/chats', { title }),
  getChatMessages: (sessionId: string) =>
    api.get<{ success: boolean; messages: ChatMessage[] }>(`/api/chats/${sessionId}`),
  deleteChat: (sessionId: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/chats/${sessionId}`),
  submitFeedback: (messageId: string, rating: 'positive' | 'negative', comment?: string) =>
    api.post<{ success: boolean; message: string }>(`/api/messages/${messageId}/feedback`, { rating, comment }),
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || fallback;
  return fallback;
}