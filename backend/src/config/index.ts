import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: Number(process.env.PORT ?? 5000),
	frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
	jwtSecret: process.env.JWT_SECRET ?? '',
	geminiApiKey: process.env.GEMINI_API_KEY ?? '',
	geminiModel: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite',
	openaiApiKey: process.env.OPENAI_API_KEY ?? '',
	openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
	chatRateLimit: Number(process.env.CHAT_RATE_LIMIT ?? 30),
};
