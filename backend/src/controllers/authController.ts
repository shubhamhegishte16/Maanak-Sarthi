import type { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getUserById, getUserByEmail } from '../services/authService.js';
import type { AuthenticatedRequest, UserRole } from '../types/index.js';
import { generateToken } from '../utils/jwt.js';

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => (!val || val.length === 0 ? undefined : val))
  .refine((val) => !val || (val.length >= 8 && val.length <= 20 && /^\+?[0-9 ()-]+$/.test(val)), {
    message: 'Phone number must be between 8 and 20 digits if provided',
  });

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().trim().email('Please enter a valid email address').transform((email) => email.toLowerCase()),
  phone: phoneSchema,
  password: z.string().min(8, 'Password must be at least 8 characters long').max(128),
  role: z.enum(['consumer', 'business', 'lab'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});
const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Password is required').max(128),
});

function validationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request';
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: validationError(parsed.error) });
    return;
  }
  try {
    if (await getUserByEmail(parsed.data.email)) {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }
    const user = await registerUser(parsed.data);
    res.status(201).json({ success: true, message: 'Registration successful', user, token: generateToken({ userId: user.id, role: user.role }) });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Unable to complete registration' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: validationError(parsed.error) });
    return;
  }
  try {
    const user = await loginUser(parsed.data);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    res.status(200).json({ success: true, message: 'Login successful', user, token: generateToken({ userId: user.id, role: user.role }) });
  } catch {
    res.status(500).json({ success: false, message: 'Unable to complete login' });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  const authUser = (req as AuthenticatedRequest).authUser;
  if (!authUser) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  try {
    const user = await getUserById(authUser.userId);
    if (!user) {
      res.status(401).json({ success: false, message: 'User account no longer exists' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch {
    res.status(500).json({ success: false, message: 'Unable to load your account' });
  }
}