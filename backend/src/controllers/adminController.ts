import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

// ---- USERS ----
export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

// ---- STANDARDS ----
export async function getStandards(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM standards ORDER BY created_at DESC');
    res.json({ success: true, standards: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch standards' });
  }
}

export async function createStandard(req: Request, res: Response): Promise<void> {
  const { is_number, title, sector, status, last_revised, clauses_count } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO standards (is_number, title, sector, status, last_revised, clauses_count)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [is_number, title, sector, status || 'Active', last_revised || 'Unknown', clauses_count || 0]
    );
    res.status(201).json({ success: true, standard: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create standard' });
  }
}

// ---- LABS ----
export async function getLabs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC');
    res.json({ success: true, labs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch labs' });
  }
}

export async function createLab(req: Request, res: Response): Promise<void> {
  const { name, category, region, city, state, address, recognition_id, valid_through, accreditation, supported_standards, key_tests, contact_email, contact_phone, lat, lng } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO labs (name, category, region, city, state, address, recognition_id, valid_through, accreditation, supported_standards, key_tests, contact_email, contact_phone, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [name, category, region, city, state, address, recognition_id, valid_through, accreditation, JSON.stringify(supported_standards || []), JSON.stringify(key_tests || []), contact_email, contact_phone, lat, lng]
    );
    res.status(201).json({ success: true, lab: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create lab' });
  }
}

// ---- SCHEMES ----
export async function getSchemes(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM schemes ORDER BY created_at DESC');
    res.json({ success: true, schemes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch schemes' });
  }
}

export async function createScheme(req: Request, res: Response): Promise<void> {
  const { scheme_id, name, sector, standards_count, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO schemes (scheme_id, name, sector, standards_count, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [scheme_id, name, sector, standards_count || 0, status || 'Active']
    );
    res.status(201).json({ success: true, scheme: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create scheme' });
  }
}

// ---- QCOS ----
export async function getQcos(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM qcos ORDER BY created_at DESC');
    res.json({ success: true, qcos: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch QCOs' });
  }
}

export async function createQco(req: Request, res: Response): Promise<void> {
  const { qco_number, title, ministry, standards_count, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO qcos (qco_number, title, ministry, standards_count, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [qco_number, title, ministry, standards_count || 0, status || 'Active']
    );
    res.status(201).json({ success: true, qco: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create QCO' });
  }
}

// ---- DOCUMENTS ----
export async function getDocuments(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
    res.json({ success: true, documents: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
}

export async function createDocument(req: Request, res: Response): Promise<void> {
  const { name, doc_type, size, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO documents (name, doc_type, size, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, doc_type || 'PDF', size || '0 KB', status || 'Uploaded']
    );
    res.status(201).json({ success: true, document: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create document' });
  }
}

// ---- AUDIT LOGS ----
export async function getLogs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.json({ success: true, logs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch logs' });
  }
}
