import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

function parsePagination(req: Request): { limit: number; offset: number } {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 25), 1), 100);
  const page = Math.max(Number(req.query.page ?? 1), 1);
  return { limit, offset: (page - 1) * limit };
}

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return undefined;
}

function sanitizeUserRecord(row: Record<string, unknown>) {
  const { password_hash, ...safe } = row as Record<string, unknown> & { password_hash?: string };
  return safe;
}

// ---- ADMIN DASHBOARD ----
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'consumer') AS total_consumers,
        (SELECT COUNT(*) FROM users WHERE role = 'business') AS total_businesses,
        (SELECT COUNT(*) FROM users WHERE role = 'lab') AS total_labs,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
        (SELECT COUNT(*) FROM standards) AS total_standards,
        (SELECT COUNT(*) FROM documents) AS total_documents,
        (SELECT COUNT(*) FROM documents WHERE status ILIKE '%approved%' OR status ILIKE '%active%' OR status = 'approved') AS total_approved_documents,
        (SELECT COUNT(*) FROM documents WHERE status ILIKE '%pending%' OR status = 'pending') AS total_pending_documents,
        (SELECT COUNT(*) FROM documents WHERE status ILIKE '%failed%' OR status = 'failed') AS total_failed_documents,
        (SELECT COUNT(*) FROM qcos) AS total_qcos,
        (SELECT COUNT(*) FROM schemes) AS total_certification_records,
        (SELECT COUNT(*) FROM audit_logs) AS total_feedback,
        (SELECT COUNT(*) FROM documents WHERE status ILIKE '%failed%' OR status = 'failed') AS failed_documents
      `);

    const values = stats.rows[0] ?? {};
    res.json({
      success: true,
      stats: {
        total_users: Number(values.total_users ?? 0),
        total_consumers: Number(values.total_consumers ?? 0),
        total_businesses: Number(values.total_businesses ?? 0),
        total_labs: Number(values.total_labs ?? 0),
        total_admins: Number(values.total_admins ?? 0),
        total_standards: Number(values.total_standards ?? 0),
        total_documents: Number(values.total_documents ?? 0),
        total_indexed_approved_documents: Number(values.total_approved_documents ?? 0),
        total_pending_documents: Number(values.total_pending_documents ?? 0),
        total_failed_documents: Number(values.total_failed_documents ?? 0),
        total_qcos: Number(values.total_qcos ?? 0),
        total_certification_records: Number(values.total_certification_records ?? 0),
        total_feedback: Number(values.total_feedback ?? 0),
        low_confidence_reviews: 0,
      },
    });
  } catch (error) {
    console.error('[adminController] Failed to fetch dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
}

export async function getRecentActivity(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT action, module, user_name, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json({ success: true, activity: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
  }
}

// ---- USERS ----
export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const { limit, offset } = parsePagination(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const role = typeof req.query.role === 'string' ? req.query.role.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(LOWER(name) LIKE LOWER($${values.length}) OR LOWER(email) LIKE LOWER($${values.length}))`);
    }

    if (role) {
      values.push(role);
      conditions.push(`role = $${values.length}`);
    }

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int AS total FROM users ${whereClause}`;
    const countResult = await pool.query<{ total: number }>(countQuery, values);

    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset],
    );

    res.json({
      success: true,
      users: result.rows.map((row) => sanitizeUserRecord(row)),
      pagination: {
        page: Number(req.query.page ?? 1),
        limit,
        totalItems: countResult.rows[0]?.total ?? 0,
        totalPages: Math.max(1, Math.ceil((countResult.rows[0]?.total ?? 0) / limit)),
      },
    });
  } catch (error) {
    console.error('[adminController] Failed to fetch users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, email, phone, role, status, created_at, updated_at FROM users WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user: sanitizeUserRecord(result.rows[0]) });
  } catch (error) {
    console.error('[adminController] Failed to fetch user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, password, role, status } = req.body ?? {};
    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Name, email, password and role are required' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, status, created_at, updated_at`,
      [String(name), String(email), phone ?? null, hashed, String(role), status ?? 'Active'],
    );

    res.status(201).json({ success: true, user: sanitizeUserRecord(result.rows[0]) });
  } catch (error) {
    console.error('[adminController] Failed to create user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body ?? {};

    const fields: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) {
      values.push(String(name));
      fields.push(`name = $${values.length}`);
    }
    if (email !== undefined) {
      values.push(String(email));
      fields.push(`email = $${values.length}`);
    }
    if (phone !== undefined) {
      values.push(phone ?? null);
      fields.push(`phone = $${values.length}`);
    }
    if (role !== undefined) {
      values.push(String(role));
      fields.push(`role = $${values.length}`);
    }
    if (status !== undefined) {
      values.push(String(status));
      fields.push(`status = $${values.length}`);
    }

    if (!fields.length) {
      res.status(400).json({ success: false, message: 'No fields provided for update' });
      return;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING id, name, email, phone, role, status, created_at, updated_at`,
      values,
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user: sanitizeUserRecord(result.rows[0]) });
  } catch (error) {
    console.error('[adminController] Failed to update user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('[adminController] Failed to delete user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
}

// ---- STANDARDS ----
export async function getStandards(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM standards ORDER BY created_at DESC');
    res.json({ success: true, standards: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch standards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch standards' });
  }
}

export async function createStandard(req: Request, res: Response): Promise<void> {
  const { is_number, title, sector, status, last_revised, clauses_count } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO standards (is_number, title, sector, status, last_revised, clauses_count)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [is_number, title, sector, status || 'Active', last_revised || 'Unknown', clauses_count || 0],
    );
    res.status(201).json({ success: true, standard: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create standard:', error);
    res.status(500).json({ success: false, message: 'Failed to create standard' });
  }
}

// ---- LABS ----
export async function getLabs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC');
    res.json({ success: true, labs: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch labs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch labs' });
  }
}

export async function createLab(req: Request, res: Response): Promise<void> {
  const { name, category, region, city, state, address, recognition_id, valid_through, accreditation, supported_standards, key_tests, contact_email, contact_phone, lat, lng } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO labs (name, category, region, city, state, address, recognition_id, valid_through, accreditation, supported_standards, key_tests, contact_email, contact_phone, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [name, category, region, city, state, address, recognition_id, valid_through, accreditation, JSON.stringify(supported_standards || []), JSON.stringify(key_tests || []), contact_email, contact_phone, lat, lng],
    );
    res.status(201).json({ success: true, lab: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create lab:', error);
    res.status(500).json({ success: false, message: 'Failed to create lab' });
  }
}

// ---- SCHEMES ----
export async function getSchemes(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM schemes ORDER BY created_at DESC');
    res.json({ success: true, schemes: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch schemes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schemes' });
  }
}

export async function createScheme(req: Request, res: Response): Promise<void> {
  const { scheme_id, name, sector, standards_count, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO schemes (scheme_id, name, sector, standards_count, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [scheme_id, name, sector, standards_count || 0, status || 'Active'],
    );
    res.status(201).json({ success: true, scheme: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create scheme:', error);
    res.status(500).json({ success: false, message: 'Failed to create scheme' });
  }
}

// ---- QCOS ----
export async function getQcos(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM qcos ORDER BY created_at DESC');
    res.json({ success: true, qcos: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch QCOs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch QCOs' });
  }
}

export async function createQco(req: Request, res: Response): Promise<void> {
  const { qco_number, title, ministry, standards_count, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO qcos (qco_number, title, ministry, standards_count, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [qco_number, title, ministry, standards_count || 0, status || 'Active'],
    );
    res.status(201).json({ success: true, qco: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create QCO:', error);
    res.status(500).json({ success: false, message: 'Failed to create QCO' });
  }
}

// ---- DOCUMENTS ----
export async function getDocuments(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
    res.json({ success: true, documents: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch documents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
}

export async function createDocument(req: Request, res: Response): Promise<void> {
  const { name, doc_type, size, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO documents (name, doc_type, size, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, doc_type || 'PDF', size || '0 KB', status || 'Uploaded'],
    );
    res.status(201).json({ success: true, document: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create document:', error);
    res.status(500).json({ success: false, message: 'Failed to create document' });
  }
}

export async function getFailedDocuments(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT * FROM documents WHERE status ILIKE '%failed%' OR status = 'failed' ORDER BY created_at DESC`,
    );
    res.json({ success: true, documents: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch failed documents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch failed documents' });
  }
}

export async function retryDocument(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE documents SET status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id],
    );

    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    res.json({ success: true, message: 'Document retry queued', document: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to retry document:', error);
    res.status(500).json({ success: false, message: 'Failed to retry document' });
  }
}

// ---- INGESTION / REVIEWS / FAQS / ALERTS ----
export async function getIngestionJobs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT id, document_id, status, started_at, completed_at, error_message, retry_count, created_at
      FROM ingestion_jobs
      ORDER BY created_at DESC
      LIMIT 100
    `);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch ingestion jobs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ingestion jobs' });
  }
}

export async function getLowConfidenceReviews(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(`
      SELECT * FROM ai_reviews WHERE confidence < 0.7 ORDER BY created_at DESC LIMIT 100
    `);
    res.json({ success: true, reviews: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch low-confidence reviews:', error);
    res.status(500).json({ success: true, reviews: [] });
  }
}

export async function getFaqs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY created_at DESC');
    res.json({ success: true, faqs: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch FAQs:', error);
    res.status(500).json({ success: true, faqs: [] });
  }
}

export async function createFaq(req: Request, res: Response): Promise<void> {
  const { question, answer, is_active } = req.body ?? {};
  try {
    const result = await pool.query(
      `INSERT INTO faqs (question, answer, is_active) VALUES ($1, $2, $3) RETURNING *`,
      [question, answer, parseBoolean(is_active) ?? true],
    );
    res.status(201).json({ success: true, faq: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to create FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
}

export async function updateFaq(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { question, answer, is_active } = req.body ?? {};
  try {
    const values: unknown[] = [];
    const fields: string[] = [];

    if (question !== undefined) {
      values.push(String(question));
      fields.push(`question = $${values.length}`);
    }
    if (answer !== undefined) {
      values.push(String(answer));
      fields.push(`answer = $${values.length}`);
    }
    if (is_active !== undefined) {
      values.push(parseBoolean(is_active) ?? true);
      fields.push(`is_active = $${values.length}`);
    }

    if (!fields.length) {
      res.status(400).json({ success: false, message: 'No changes provided' });
      return;
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE faqs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    res.json({ success: true, faq: result.rows[0] });
  } catch (error) {
    console.error('[adminController] Failed to update FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
}

export async function deleteFaq(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM faqs WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    console.error('[adminController] Failed to delete FAQ:', error);
    res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
}

export async function getAlerts(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM admin_alerts ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, alerts: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch alerts:', error);
    res.status(500).json({ success: true, alerts: [] });
  }
}

// ---- AUDIT LOGS ----
export async function getLogs(req: Request, res: Response): Promise<void> {
  try {
    const { limit, offset } = parsePagination(req);
    const result = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    res.json({ success: true, logs: result.rows });
  } catch (error) {
    console.error('[adminController] Failed to fetch logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
}
