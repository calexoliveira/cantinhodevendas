import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import express, { type Request, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { productCategories } from '../shared/categories';
import { getDocumentDigits, identifyBrazilianDocument, isValidBrazilianDocument } from '../src/utils/brazilianDocument';
import { pool } from './db';

type UserRow = {
  id: string;
  name: string;
  email: string;
  accountType: 'customer' | 'merchant';
  isAdmin: boolean;
  documentNumber: string | null;
  documentType: 'cpf' | 'cnpj' | null;
  phone: string | null;
  address: string | null;
  storeId: string | null;
  storeName: string | null;
  businessAddress: string | null;
};

const userQuery = `SELECT u.id, u.name, u.email, u.account_type AS "accountType",
  u.is_admin AS "isAdmin", u.document_number AS "documentNumber",
  u.document_type AS "documentType", u.phone, u.address, s.id AS "storeId",
  s.name AS "storeName", s.address AS "businessAddress"
  FROM users u LEFT JOIN stores s ON s.owner_id = u.id`;

const productQuery = `SELECT p.id, p.name, p.category, p.price::float8 AS price,
  p.original_price::float8 AS "originalPrice", p.rating::float8 AS rating, p.reviews,
  p.image, p.badge, p.featured, p.condition, p.description, p.store_id AS "storeId",
  s.name AS "storeName", p.stock, p.sku, p.brand, p.warranty_months AS "warrantyMonths",
  p.delivery_days AS "deliveryDays", p.free_shipping AS "freeShipping", p.sold_count AS "soldCount"
  FROM products p LEFT JOIN stores s ON s.id = p.store_id`;

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72).refine((value) => !bcrypt.truncates(value), 'Senha longa demais.'),
  accountType: z.enum(['customer', 'merchant']),
  documentNumber: z.string().max(32).refine(isValidBrazilianDocument, 'CPF ou CNPJ inválido.'),
  phone: z.string().trim().min(1).max(30),
  storeName: z.string().trim().max(120).optional(),
  businessAddress: z.string().trim().max(500).optional(),
}).refine((value) => value.accountType !== 'merchant' || (value.storeName && value.businessAddress), {
  message: 'Informe o nome e o endereço da loja.',
});

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.enum(productCategories),
  price: z.number().finite().min(0).max(9999999999),
  originalPrice: z.number().finite().min(0).max(9999999999).optional(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0).max(100000000),
  image: z.string().url().max(2048).refine((url) => ['http:', 'https:'].includes(new URL(url).protocol)),
  badge: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  condition: z.enum(['novo', 'seminovo', 'usado']).optional(),
  description: z.string().trim().min(1).max(5000),
  storeId: z.string().max(254).optional(),
  stock: z.number().int().min(0).max(100000000),
  sku: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  warrantyMonths: z.number().int().min(0).max(1200),
  deliveryDays: z.number().int().min(1).max(3650),
  freeShipping: z.boolean().optional(),
}).strict();

const asyncRoute = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const insertSessionSql = "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')";
const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/api',
};

async function authenticatedUser(req: Request): Promise<UserRow | null> {
  const token: unknown = req.cookies?.cantinhodevendas_session;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
  const result = await pool.query<UserRow>(
    `${userQuery} JOIN sessions sess ON sess.user_id = u.id WHERE sess.token_hash = $1 AND sess.expires_at > NOW()`,
    [hashToken(token)],
  );
  return result.rows[0] ?? null;
}

async function createSession(userId: string, res: express.Response) {
  const token = randomBytes(32).toString('hex');
  await pool.query(insertSessionSql, [hashToken(token), userId]);
  res.cookie('cantinhodevendas_session', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}`) {
    res.status(403).json({ error: 'Origem não autorizada.' });
    return;
  }
  next();
});

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente mais tarde.' },
});

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
}));

app.get('/api/auth/me', asyncRoute(async (req, res) => {
  res.json({ user: await authenticatedUser(req) });
}));

app.post('/api/auth/register', authLimit, asyncRoute(async (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' });
    return;
  }
  const data = parsed.data;
  const passwordHash = await bcrypt.hash(data.password, 12);
  const client = await pool.connect();
  const token = randomBytes(32).toString('hex');
  let userId: string;
  try {
    await client.query('BEGIN');
    userId = randomUUID();
    const digits = getDocumentDigits(data.documentNumber);
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, account_type, document_number, document_type, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, data.name, data.email, passwordHash, data.accountType, digits, identifyBrazilianDocument(digits), data.phone],
    );
    if (data.accountType === 'merchant') {
      await client.query('INSERT INTO stores (id, owner_id, name, address) VALUES ($1, $2, $3, $4)',
        [randomUUID(), userId, data.storeName, data.businessAddress]);
    }
    await client.query(insertSessionSql, [hashToken(token), userId]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
      return;
    }
    throw error;
  } finally {
    client.release();
  }
  res.cookie('cantinhodevendas_session', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  const result = await pool.query<UserRow>(`${userQuery} WHERE u.id = $1`, [userId]);
  res.status(201).json({ user: result.rows[0] });
}));

app.post('/api/auth/login', authLimit, asyncRoute(async (req, res) => {
  const parsed = z.object({
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(72).refine((value) => !bcrypt.truncates(value)),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'E-mail ou senha inválidos.' });
    return;
  }
  const result = await pool.query<{ id: string; password_hash: string }>(
    'SELECT id, password_hash FROM users WHERE email = $1', [parsed.data.email],
  );
  const account = result.rows[0];
  if (!account || !(await bcrypt.compare(parsed.data.password, account.password_hash))) {
    res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    return;
  }
  await createSession(account.id, res);
  const user = await pool.query<UserRow>(`${userQuery} WHERE u.id = $1`, [account.id]);
  res.json({ user: user.rows[0] });
}));

app.post('/api/auth/logout', asyncRoute(async (req, res) => {
  const token: unknown = req.cookies?.cantinhodevendas_session;
  if (typeof token === 'string') {
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
  }
  res.clearCookie('cantinhodevendas_session', cookieOptions);
  res.status(204).end();
}));

app.patch('/api/auth/address', asyncRoute(async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Faça login para continuar.' });
    return;
  }
  const parsed = z.object({ address: z.string().trim().max(500) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Endereço inválido.' });
    return;
  }
  await pool.query('UPDATE users SET address = $1 WHERE id = $2', [parsed.data.address, user.id]);
  res.json({ user: { ...user, address: parsed.data.address } });
}));

app.get('/api/stores', asyncRoute(async (_req, res) => {
  const result = await pool.query('SELECT id, name, address FROM stores ORDER BY name');
  res.json(result.rows);
}));

app.get('/api/products', asyncRoute(async (_req, res) => {
  const result = await pool.query(`${productQuery} ORDER BY p.created_at DESC, p.id ASC`);
  res.json(result.rows);
}));

app.post('/api/products', asyncRoute(async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Faça login para continuar.' });
    return;
  }
  if (!user.isAdmin && user.accountType !== 'merchant') {
    res.status(403).json({ error: 'Apenas lojistas podem cadastrar produtos.' });
    return;
  }
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados do produto inválidos.' });
    return;
  }
  const data = parsed.data;
  const storeId = user.isAdmin ? data.storeId ?? null : user.storeId;
  if (!user.isAdmin && !storeId) {
    res.status(403).json({ error: 'Conta sem loja vinculada.' });
    return;
  }
  if (storeId) {
    const store = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (!store.rowCount) {
      res.status(400).json({ error: 'Loja não encontrada.' });
      return;
    }
  }
  const result = await pool.query<{ id: number }>(
    `INSERT INTO products
     (store_id, name, category, price, original_price, rating, reviews, image, badge, featured, condition,
      description, stock, sku, brand, warranty_months, delivery_days, free_shipping)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
     RETURNING id`,
    [storeId, data.name, data.category, data.price, data.originalPrice ?? null,
      user.isAdmin ? data.rating : 0, user.isAdmin ? data.reviews : 0,
      data.image, data.badge ?? null, data.featured ?? false, data.condition ?? null, data.description,
      data.stock, data.sku ?? null, data.brand ?? null, data.warrantyMonths, data.deliveryDays, data.freeShipping ?? false],
  );
  const product = await pool.query(`${productQuery} WHERE p.id = $1`, [result.rows[0].id]);
  res.status(201).json(product.rows[0]);
}));

app.delete('/api/products/:id', asyncRoute(async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Faça login para continuar.' });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    res.status(400).json({ error: 'Produto inválido.' });
    return;
  }
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1 AND ($2::boolean OR (store_id = $3 AND $3 IS NOT NULL))',
    [id, user.isAdmin, user.storeId],
  );
  if (!result.rowCount) {
    res.status(404).json({ error: 'Produto não encontrado ou sem permissão.' });
    return;
  }
  res.status(204).end();
}));

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next;
  if (typeof error === 'object' && error !== null && 'type' in error) {
    if (error.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'JSON inválido.' });
      return;
    }
    if (error.type === 'entity.too.large') {
      res.status(413).json({ error: 'Requisição muito grande.' });
      return;
    }
  }
  console.error('Erro na API:', error instanceof Error ? error.message : 'erro desconhecido');
  res.status(500).json({ error: 'Erro interno. Tente novamente.' });
});
