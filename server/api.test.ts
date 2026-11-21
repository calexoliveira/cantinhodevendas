import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { test } from 'node:test';
import pg from 'pg';
import { z } from 'zod';

test('accounts and products enforce store ownership', async () => {
  const databaseUrl = process.env.TEST_DATABASE_URL;
  assert.ok(databaseUrl, 'Configure TEST_DATABASE_URL para um banco PostgreSQL de testes.');
  const schema = `api_test_${randomBytes(8).toString('hex')}`;
  const control = new pg.Client({ connectionString: databaseUrl });
  await control.connect();
  await control.query(`CREATE SCHEMA "${schema}"`);
  const url = new URL(databaseUrl);
  url.searchParams.set('options', `-c search_path=${schema}`);
  process.env.DATABASE_URL = url.toString();
  let server: ReturnType<typeof import('./app').app.listen> | undefined;
  let testPool: typeof import('./db').pool | undefined;
  try {
    const migration = await readFile(new URL('./migrations/001_initial.sql', import.meta.url), 'utf8');
    await control.query(`SET search_path TO "${schema}"`);
    await control.query(migration);
    await control.query(await readFile(new URL('./migrations/002_product_order.sql', import.meta.url), 'utf8'));
    await control.query("INSERT INTO stores (id, name) VALUES ('demo-store', 'Loja demonstrativa')");
    await control.query(
      `INSERT INTO products (id, store_id, name, category, price, image, description, created_at)
       VALUES (1, 'demo-store', 'Produto demonstrativo', 'Roupas', 10, 'demo:1', 'Exemplo', TIMESTAMPTZ 'epoch')`,
    );
    await control.query("SELECT setval(pg_get_serial_sequence('products', 'id'), 1)");
    const { app } = await import('./app');
    testPool = (await import('./db')).pool;
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;

    const request = async (path: string, method = 'GET', body?: unknown, cookie?: string) => {
      return fetch(`${base}${path}`, {
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    };

    const registration = {
      name: 'Lojista Teste', email: 'lojista@example.invalid', password: 'test-password',
      accountType: 'merchant', documentNumber: '52998224725', phone: '11999999999',
      storeName: 'Loja Teste', businessAddress: 'Rua de teste',
    };
    const invalid = await request('/api/auth/register', 'POST', { ...registration, documentNumber: '123' });
    assert.equal(invalid.status, 400);
    const created = await request('/api/auth/register', 'POST', registration);
    assert.equal(created.status, 201);
    const cookie = created.headers.get('set-cookie')?.split(';')[0];
    assert.ok(cookie);
    assert.match(created.headers.get('set-cookie') ?? '', /HttpOnly/i);
    const { user } = z.object({
      user: z.object({ storeId: z.string(), isAdmin: z.boolean() }),
    }).parse(await created.json());
    assert.ok(user.storeId);
    assert.equal(user.isAdmin, false);
    assert.equal((await request('/api/auth/register', 'POST', registration)).status, 409);

    const product = {
      name: 'Produto teste', category: 'Pet Shop', price: 25, rating: 5, reviews: 999,
      image: 'https://example.invalid/product.png', description: 'Descrição teste', stock: 3,
      warrantyMonths: 12, deliveryDays: 3, storeId: 'outra-loja',
    };
    assert.equal((await request('/api/products', 'POST', product)).status, 401);
    const inserted = await request('/api/products', 'POST', product, cookie);
    assert.equal(inserted.status, 201);
    const saved = z.object({
      id: z.number(), storeId: z.string(), category: z.string(), rating: z.number(), reviews: z.number(),
    }).parse(await inserted.json());
    assert.equal(saved.storeId, user.storeId);
    assert.equal(saved.category, 'Pet Shop');
    assert.equal(saved.rating, 0);
    assert.equal(saved.reviews, 0);
    const listing = z.array(z.object({ id: z.number() })).parse(await (await request('/api/products')).json());
    assert.equal(listing[0].id, saved.id);
    const second = await request('/api/auth/register', 'POST', { ...registration, email: 'outro@example.invalid' });
    const secondCookie = second.headers.get('set-cookie')?.split(';')[0];
    assert.ok(secondCookie);
    assert.equal((await request(`/api/products/${saved.id}`, 'DELETE', undefined, secondCookie)).status, 404);
    assert.equal((await request(`/api/products/${saved.id}`, 'DELETE', undefined, cookie)).status, 204);
    assert.equal((await request('/api/auth/logout', 'POST', undefined, cookie)).status, 204);
    const session = await request('/api/auth/me', 'GET', undefined, cookie);
    assert.equal(z.object({ user: z.null() }).parse(await session.json()).user, null);
    assert.equal((await request('/api/auth/login', 'POST', { email: registration.email, password: registration.password })).status, 200);
    const crossOrigin = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { Origin: 'https://example.invalid' } });
    assert.equal(crossOrigin.status, 403);
  } finally {
    if (server) await new Promise<void>((resolve, reject) => server?.close((error) => error ? reject(error) : resolve()));
    if (testPool) await testPool.end();
    await control.query(`DROP SCHEMA "${schema}" CASCADE`);
    await control.end();
  }
});
