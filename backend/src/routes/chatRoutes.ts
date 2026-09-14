import { Router } from 'express';
import {
  sendMessage,
  getChats,
  createChat,
  getChatMessages,
  deleteChat,
  submitFeedback,
} from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Chat messaging with rate limiting and optional user identity
router.post('/chat', chatRateLimiter, optionalAuth, sendMessage);

// Session history & management
router.get('/chats', optionalAuth, getChats);
router.post('/chats', optionalAuth, createChat);
router.get('/chats/:id', optionalAuth, getChatMessages);
router.delete('/chats/:id', optionalAuth, deleteChat);

// Message feedback
router.post('/messages/:id/feedback', optionalAuth, submitFeedback);

export default router;
