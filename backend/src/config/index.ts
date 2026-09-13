import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: Number(process.env.PORT ?? 5000),
	frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
	jwtSecret: process.env.JWT_SECRET ?? '',
};
