import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

interface RequestLog {
  count: number;
  resetAt: number;
}

const clientLimits = new Map<string, RequestLog>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function chatRateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Use IP address or authenticated user ID
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();
  const maxRequests = config.chatRateLimit || 30;

  const current = clientLimits.get(ip);

  if (!current || now > current.resetAt) {
    clientLimits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (current.count >= maxRequests) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
    res.status(429).json({
      success: false,
      message: `Rate limit exceeded. Please wait ${retryAfterSec} seconds before sending more requests.`,
    });
    return;
  }

  current.count += 1;
  next();
}
