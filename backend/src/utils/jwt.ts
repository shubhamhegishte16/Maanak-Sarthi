import jwt from 'jsonwebtoken';
import type { UserRole } from '../types/index.js';
import { config } from '../config/index.js';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

function getJwtSecret(): string {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return config.jwtSecret;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, getJwtSecret());
  if (typeof payload !== 'object' || !payload || typeof payload.userId !== 'string') {
    throw new Error('Invalid token payload');
  }
  if (
    payload.role !== 'consumer' &&
    payload.role !== 'business' &&
    payload.role !== 'lab' &&
    payload.role !== 'admin'
  ) {
    throw new Error('Invalid token role');
  }
  return { userId: payload.userId, role: payload.role };
}