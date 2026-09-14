import type { Request, Response } from 'express';
import { pool } from '../config/database.js';

export async function getLabs(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC');
    res.json({ success: true, labs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch labs' });
  }
}

export async function searchStandards(req: Request, res: Response): Promise<void> {
  const { q } = req.query;
  try {
    let query = 'SELECT * FROM standards';
    let params: any[] = [];
    
    if (q && typeof q === 'string' && q.trim().length > 0) {
      query += ' WHERE is_number ILIKE $1 OR title ILIKE $1 OR sector ILIKE $1';
      params.push(`%${q}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ success: true, standards: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch standards' });
  }
}
