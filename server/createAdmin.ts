import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from './db';

const config = z.object({
  ADMIN_EMAIL: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(8).max(72).refine((value) => !bcrypt.truncates(value)),
  ADMIN_NAME: z.string().trim().min(1).max(120),
}).safeParse(process.env);

try {
  if (!config.success) {
    throw new Error('Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD válidos no ambiente.');
  }
  const hash = await bcrypt.hash(config.data.ADMIN_PASSWORD, 12);
  await pool.query(
    "INSERT INTO users (id, name, email, password_hash, account_type, is_admin) VALUES ($1, $2, $3, $4, 'customer', true)",
    [randomUUID(), config.data.ADMIN_NAME, config.data.ADMIN_EMAIL, hash],
  );
  console.log('Administrador criado.');
} finally {
  await pool.end();
}
