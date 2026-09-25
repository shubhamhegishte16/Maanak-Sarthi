import bcrypt from 'bcrypt';
import { pool } from './database.js';

export async function ensureAdminAccount(): Promise<{ created: boolean; email: string | null }> {
  const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? '';

  if (!email || !password) {
    return { created: false, email: email || null };
  }

  try {
    const existing = await pool.query<{ id: string; role: string; email: string }>(
      `SELECT id, email, role FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [email],
    );

    if (existing.rows[0]) {
      if (existing.rows[0].role !== 'admin') {
        await pool.query(`UPDATE users SET role = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [existing.rows[0].id]);
      }
      return { created: false, email: existing.rows[0].email };
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query<{ id: string; email: string }>(
      `INSERT INTO users (name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'admin', 'Active')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [`System Administrator`, email, null, hash],
    );

    return { created: result.rowCount !== null && result.rowCount > 0, email: result.rows[0]?.email ?? email };
  } catch (error) {
    console.error('[adminSeed] Failed to ensure admin account:', error);
    return { created: false, email };
  }
}
