import { readdir, readFile } from 'node:fs/promises';
import { pool } from './db';

const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(92841537)');
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY)');
  const directory = new URL('./migrations/', import.meta.url);
  const files = (await readdir(directory)).filter((file) => /^\d+_.+\.sql$/.test(file)).sort();
  if (!files.length) throw new Error('Nenhuma migração encontrada.');
  for (const file of files) {
    const version = file.slice(0, -4);
    const existing = await client.query('SELECT version FROM schema_migrations WHERE version = $1', [version]);
    if (!existing.rowCount) {
      await client.query(await readFile(new URL(file, directory), 'utf8'));
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
      console.log(`Migração ${version} aplicada.`);
    }
  }
  console.log('Banco de dados atualizado.');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
