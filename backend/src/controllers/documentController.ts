import type { Request, Response } from 'express';
import pdfParse from 'pdf-parse';
import { pool } from '../config/database.js';
import { analyzeDocumentWithGemini, askDocumentQuestionWithGemini } from '../services/geminiService.js';
import type { AuthenticatedRequest } from '../types/index.js';

export async function analyzeDocument(req: Request, res: Response): Promise<void> {
  try {
    let rawText = '';
    let originalName = 'uploaded-document.pdf';
    let docSize = '1.2 MB';

    if (req.file) {
      originalName = req.file.originalname;
      docSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        rawText = pdfData.text;
      } else {
        rawText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      rawText = req.body.text;
      originalName = req.body.name || 'Sample_Document.txt';
    } else {
      res.status(400).json({ success: false, message: 'Please upload a file or provide text content' });
      return;
    }

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Could not extract text from document.' });
      return;
    }

    // Call Gemini with dedicated Document Analyzer key (gemini-3.5-flash-lite)
    const analysis = await analyzeDocumentWithGemini(rawText, originalName);

    // Persist in documents table
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.authUser?.userId || null;

    const insertRes = await pool.query(
      `INSERT INTO documents (name, doc_type, size, status, parsed_content, user_id)
       VALUES ($1, $2, $3, 'Analyzed', $4, $5)
       RETURNING id, name, doc_type, size, status, created_at`,
      [originalName, analysis.type || 'Gazette Notification', docSize, JSON.stringify({ ...analysis, rawText }), userId]
    );

    const savedDoc = insertRes.rows[0];

    res.json({
      success: true,
      document: {
        id: savedDoc.id,
        name: savedDoc.name,
        size: savedDoc.size,
        type: savedDoc.doc_type,
        ...analysis,
      },
    });
  } catch (err) {
    console.error('[documentController] analyzeDocument error:', err);
    res.status(500).json({ success: false, message: 'Document analysis failed' });
  }
}

export async function askDocumentQuestion(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { question, history, docText, docName } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({ success: false, message: 'Question is required' });
    return;
  }

  try {
    let textToUse = docText || '';
    let nameToUse = docName || 'Document';

    // If doc ID provided and valid UUID, look up parsed content from DB
    if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      const docRes = await pool.query('SELECT name, parsed_content FROM documents WHERE id = $1', [id]);
      if (docRes.rows.length > 0) {
        nameToUse = docRes.rows[0].name;
        const parsed = docRes.rows[0].parsed_content;
        textToUse = parsed?.rawText || parsed?.summary || textToUse;
      }
    }

    const answer = await askDocumentQuestionWithGemini(textToUse, nameToUse, question, history || []);
    res.json({ success: true, answer });
  } catch (err) {
    console.error('[documentController] askDocumentQuestion error:', err);
    res.status(500).json({ success: false, message: 'Failed to answer question' });
  }
}

export async function getDocuments(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.authUser?.userId;

    let query = 'SELECT id, name, doc_type, size, status, parsed_content, created_at FROM documents';
    const params: any[] = [];

    if (userId) {
      query += ' WHERE user_id = $1 OR user_id IS NULL';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';

    const result = await pool.query(query, params);
    res.json({ success: true, documents: result.rows });
  } catch (err) {
    console.error('[documentController] getDocuments error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
}
