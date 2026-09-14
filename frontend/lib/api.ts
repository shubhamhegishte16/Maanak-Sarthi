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

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  getStandards: () => api.get('/api/admin/standards'),
  createStandard: (data: any) => api.post('/api/admin/standards', data),
  getLabs: () => api.get('/api/admin/labs'),
  createLab: (data: any) => api.post('/api/admin/labs', data),
  getSchemes: () => api.get('/api/admin/schemes'),
  createScheme: (data: any) => api.post('/api/admin/schemes', data),
  getQcos: () => api.get('/api/admin/qcos'),
  createQco: (data: any) => api.post('/api/admin/qcos', data),
  getDocuments: () => api.get('/api/admin/documents'),
  createDocument: (data: any) => api.post('/api/admin/documents', data),
  getLogs: () => api.get('/api/admin/logs'),
};

export const publicApi = {
  getLabs: (params?: { q?: string; state?: string; category?: string; standard?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.state && params.state !== 'All States') query.append('state', params.state);
    if (params?.category && params.category !== 'All Domains') query.append('category', params.category);
    if (params?.standard) query.append('standard', params.standard);
    const qs = query.toString();
    return api.get(`/api/public/labs${qs ? `?${qs}` : ''}`);
  },
  getStandards: (params?: { q?: string; sector?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.sector && params.sector !== 'All Sectors') query.append('sector', params.sector);
    if (params?.status && params.status !== 'All Status') query.append('status', params.status);
    const qs = query.toString();
    return api.get(`/api/public/standards${qs ? `?${qs}` : ''}`);
  },
  getStandardById: (id: string) => api.get(`/api/public/standards/${encodeURIComponent(id)}`),
  searchStandards: (q: string) => api.get(`/api/public/standards/search?q=${encodeURIComponent(q)}`),
  findApplicableStandard: (data: { productName: string; description: string; material?: string; industry?: string; intendedUse?: string }) =>
    api.post('/api/public/standards/find-applicable', data),
  getSchemes: () => api.get('/api/public/schemes'),
  getSchemeById: (id: string) => api.get(`/api/public/schemes/${encodeURIComponent(id)}`),
  getUpdates: (category?: string) => api.get(`/api/public/updates${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  compareStandards: (stdA: string, stdB: string) => api.get(`/api/public/standards/compare?stdA=${encodeURIComponent(stdA)}&stdB=${encodeURIComponent(stdB)}`),
};

export const documentApi = {
  analyzeDocument: (formData: FormData) =>
    api.post('/api/documents/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  analyzeText: (text: string, name?: string) =>
    api.post('/api/documents/analyze', { text, name }),
  askQuestion: (data: { id?: string; question: string; history?: { q: string; a: string }[]; docText?: string; docName?: string }) =>
    api.post('/api/documents/ask', data),
  getDocuments: () => api.get('/api/documents'),
};

export const userApi = {
  getDashboard: () => api.get('/api/user/dashboard'),
  getSavedStandards: () => api.get('/api/user/saved-standards'),
  toggleSaveStandard: (standardId: string) => api.post('/api/user/saved-standards/toggle', { standardId }),
  getProducts: () => api.get('/api/user/products'),
  createProduct: (data: { name: string; model?: string; standard_number?: string }) => api.post('/api/user/products', data),
  getReadiness: (productId?: string) => api.get(`/api/user/readiness${productId ? `?productId=${encodeURIComponent(productId)}` : ''}`),
  updateReadinessTask: (data: { productId?: string; pillarTitle: string; task: string; status: string; note?: string }) =>
    api.post('/api/user/readiness/update', data),
  getCompliance: (standard?: string) => api.get(`/api/user/compliance${standard ? `?standard=${encodeURIComponent(standard)}` : ''}`),
  saveCompliance: (data: any) => api.post('/api/user/compliance/save', data),
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || fallback;
  return fallback;
}
