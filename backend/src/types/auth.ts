import type { UserRole } from './index.js';

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}