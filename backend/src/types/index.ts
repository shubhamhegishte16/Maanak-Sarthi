import type { Request } from 'express';

export type UserRole = 'consumer' | 'business' | 'lab';

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	role: UserRole;
}

export interface AuthenticatedRequest extends Request {
	authUser?: {
		userId: string;
		role: UserRole;
	};
}
