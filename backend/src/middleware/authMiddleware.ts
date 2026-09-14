import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication token required' });
    return;
  }

  try {
    (req as AuthenticatedRequest).authUser = verifyToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('Authorization');
  if (header?.startsWith('Bearer ')) {
    try {
      (req as AuthenticatedRequest).authUser = verifyToken(header.slice(7));
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

export const authenticateToken = requireAuth;
export const optionalAuthenticateToken = optionalAuth;