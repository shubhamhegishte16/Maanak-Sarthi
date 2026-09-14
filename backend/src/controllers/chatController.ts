import type { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { generateAssistantReply } from '../services/aiAssistantService.js';
import type { AuthenticatedRequest } from '../types/index.js';

interface MessageRow {
  id: string;
  session_id: string;
  user_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: string;
  mode?: string;
  confidence?: string;
  evidence?: any;
  actions?: any;
  sources?: any;
  retrieval_metadata?: any;
  created_at: string;
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { sessionId: inputSessionId, message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ success: false, message: 'Message content is required.' });
    return;
  }

  const authUser = (req as AuthenticatedRequest).authUser;
  const isUuid = (str?: string | null) =>
    Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

  let userId: string | null = null;
  if (isUuid(authUser?.userId)) {
    try {
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [authUser!.userId]);
      if (userCheck.rows.length > 0) {
        userId = authUser!.userId;
      }
    } catch {
      userId = null;
    }
  }

  try {
    let activeSessionId: string | null = null;

    // Validate if provided session ID is a valid existing UUID
    if (isUuid(inputSessionId)) {
      try {
        const sessionCheck = await pool.query(`SELECT id FROM chat_sessions WHERE id = $1`, [inputSessionId]);
        if (sessionCheck.rows.length > 0) {
          activeSessionId = inputSessionId;
        }
      } catch {
        activeSessionId = null;
      }
    }

    // If no valid session found, create a new one
    if (!activeSessionId) {
      const title = message.trim().slice(0, 45) + (message.length > 45 ? '...' : '');
      const newSessionRes = await pool.query(
        `INSERT INTO chat_sessions (user_id, title)
         VALUES ($1, $2)
         RETURNING id`,
        [userId, title]
      );
      activeSessionId = newSessionRes.rows[0].id;
    }

    // 2. Fetch recent conversation context for this session
    const historyRes = await pool.query<MessageRow>(
      `SELECT role, content
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC
       LIMIT 10`,
      [activeSessionId]
    );

    const chatHistory = historyRes.rows.map((row) => ({
      role: row.role as 'user' | 'assistant',
      content: row.content,
    }));

    // 3. Save incoming user message (safely)
    let userMsgId = 'msg-' + Date.now();
    try {
      const userMsgInsert = await pool.query(
        `INSERT INTO chat_messages (session_id, user_id, role, content)
         VALUES ($1, $2, 'user', $3)
         RETURNING id, created_at`,
        [activeSessionId, userId ?? null, message.trim()]
      );
      if (userMsgInsert.rows[0]?.id) {
        userMsgId = userMsgInsert.rows[0].id;
      }
    } catch (userMsgErr) {
      console.warn('[chatController] Warning saving user message to DB:', userMsgErr);
    }

    // 4. Generate AI response using Gemini + Official BIS retrieval
    const aiResponse = await generateAssistantReply(message.trim(), chatHistory);

    // 5. Store assistant message in Neon DB (safely)
    let assistantRow: any = null;
    try {
      const assistantMsgInsert = await pool.query(
        `INSERT INTO chat_messages
           (session_id, user_id, role, content, intent, mode, confidence, evidence, actions, sources, retrieval_metadata)
         VALUES ($1, $2, 'assistant', $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, session_id, role, content, intent, mode, confidence, evidence, actions, sources, created_at`,
        [
          activeSessionId,
          userId ?? null,
          aiResponse.answer || 'Response generated.',
          aiResponse.intent || 'GENERAL',
          aiResponse.mode || 'general',
          aiResponse.confidence || 'medium',
          aiResponse.evidence ? JSON.stringify(aiResponse.evidence) : null,
          JSON.stringify(aiResponse.actions || []),
          JSON.stringify(aiResponse.sources || []),
          JSON.stringify({
            sourceCount: (aiResponse.sources || []).length,
            retrievedAt: new Date().toISOString(),
            disclaimer: aiResponse.disclaimer || null,
            followUpQuestions: aiResponse.followUpQuestions || [],
          }),
        ]
      );
      assistantRow = assistantMsgInsert.rows[0];

      // 6. Update chat session metadata
      await pool.query(
        `UPDATE chat_sessions
         SET message_count = message_count + 2,
             mode = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [aiResponse.mode || 'general', activeSessionId]
      );
    } catch (asstDbErr) {
      console.warn('[chatController] Warning saving assistant message to DB:', asstDbErr);
    }

    res.status(200).json({
      success: true,
      sessionId: activeSessionId,
      userMessageId: userMsgId,
      message: {
        id: assistantRow?.id || 'asst-' + Date.now(),
        sessionId: activeSessionId,
        role: 'assistant',
        content: aiResponse.answer,
        intent: aiResponse.intent,
        mode: aiResponse.mode,
        confidence: aiResponse.confidence,
        evidence: aiResponse.evidence,
        actions: aiResponse.actions || [],
        sources: aiResponse.sources || [],
        followUpQuestions: aiResponse.followUpQuestions || [],
        disclaimer: aiResponse.disclaimer,
        createdAt: assistantRow?.created_at || new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const errStr = error instanceof Error ? error.stack || error.message : String(error);
    console.error('[chatController.sendMessage] Error:', errStr);
    res.status(500).json({
      success: false,
      message: 'The AI service is temporarily unavailable. Please try again.',
    });
  }
}

export async function getChats(req: Request, res: Response): Promise<void> {
  const authUser = (req as AuthenticatedRequest).authUser;
  const isUuid = (str?: string | null) =>
    Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

  let userId: string | null = null;
  if (isUuid(authUser?.userId)) {
    try {
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [authUser!.userId]);
      if (userCheck.rows.length > 0) {
        userId = authUser!.userId;
      }
    } catch {
      userId = null;
    }
  }

  try {
    const query = userId
      ? `SELECT id, title, mode, message_count, created_at, updated_at
         FROM chat_sessions
         WHERE user_id = $1 AND archived = FALSE
         ORDER BY updated_at DESC
         LIMIT 30`
      : `SELECT id, title, mode, message_count, created_at, updated_at
         FROM chat_sessions
         WHERE archived = FALSE
         ORDER BY updated_at DESC
         LIMIT 15`;

    const params = userId ? [userId] : [];
    const sessionsRes = await pool.query(query, params);

    res.status(200).json({
      success: true,
      sessions: sessionsRes.rows,
    });
  } catch (error: unknown) {
    console.error('[chatController.getChats] Error:', error);
    res.status(500).json({ success: false, message: 'Unable to load chat sessions.' });
  }
}

export async function createChat(req: Request, res: Response): Promise<void> {
  const authUser = (req as AuthenticatedRequest).authUser;
  const isUuid = (str?: string | null) =>
    Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

  let userId: string | null = null;
  if (isUuid(authUser?.userId)) {
    try {
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [authUser!.userId]);
      if (userCheck.rows.length > 0) {
        userId = authUser!.userId;
      }
    } catch {
      userId = null;
    }
  }
  const title = req.body?.title || 'New Conversation';

  try {
    const result = await pool.query(
      `INSERT INTO chat_sessions (user_id, title)
       VALUES ($1, $2)
       RETURNING id, title, mode, message_count, created_at, updated_at`,
      [userId, title]
    );

    res.status(201).json({
      success: true,
      session: result.rows[0],
    });
  } catch (error: unknown) {
    console.error('[chatController.createChat] Error:', error);
    res.status(500).json({ success: false, message: 'Unable to create new chat session.' });
  }
}

export async function getChatMessages(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const messagesRes = await pool.query(
      `SELECT id, session_id, role, content, intent, mode, confidence, evidence, actions, sources, created_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    res.status(200).json({
      success: true,
      messages: messagesRes.rows,
    });
  } catch (error: unknown) {
    console.error('[chatController.getChatMessages] Error:', error);
    res.status(500).json({ success: false, message: 'Unable to load conversation messages.' });
  }
}

export async function deleteChat(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM chat_sessions WHERE id = $1`, [id]);
    res.status(200).json({ success: true, message: 'Chat conversation deleted successfully.' });
  } catch (error: unknown) {
    console.error('[chatController.deleteChat] Error:', error);
    res.status(500).json({ success: false, message: 'Unable to delete chat conversation.' });
  }
}

export async function submitFeedback(req: Request, res: Response): Promise<void> {
  const { id: messageId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !['positive', 'negative'].includes(rating)) {
    res.status(400).json({ success: false, message: 'Rating must be either "positive" or "negative".' });
    return;
  }

  const authUser = (req as AuthenticatedRequest).authUser;
  const userId = authUser ? authUser.userId : null;

  try {
    await pool.query(
      `INSERT INTO feedback (user_id, message_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [userId, messageId, rating, comment || null]
    );

    res.status(200).json({ success: true, message: 'Feedback recorded successfully.' });
  } catch (error: unknown) {
    console.error('[chatController.submitFeedback] Error:', error);
    res.status(500).json({ success: false, message: 'Unable to record feedback.' });
  }
}
