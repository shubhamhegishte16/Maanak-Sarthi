import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import type { LoginInput, RegisterInput } from '../types/auth.js';
import type { User } from '../types/index.js';

interface UserRecord extends User {
  password_hash: string;
}

const userColumns = 'id, name, email, phone, password_hash, role';

function toUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    role: record.role,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query<UserRecord>(`SELECT ${userColumns} FROM users WHERE id = $1`, [id]);
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await pool.query<UserRecord>(`SELECT ${userColumns} FROM users WHERE email = $1`, [email]);
  return result.rows[0] ?? null;
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const result = await pool.query<UserRecord>(
    `INSERT INTO users (name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${userColumns}`,
    [input.name, input.email, input.phone || null, passwordHash, input.role],
  );
  return toUser(result.rows[0]);
}

export async function loginUser(input: LoginInput): Promise<User | null> {
  const record = await getUserByEmail(input.email);
  if (!record || !(await bcrypt.compare(input.password, record.password_hash))) {
    return null;
  }
  return toUser(record);
}