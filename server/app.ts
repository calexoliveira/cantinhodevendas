import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import express, { type Request, type RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { productCategories } from '../shared/categories';
import { isValidGtin } from '../shared/gtin';
import { discountedPrice } from '../shared/productPrice';
import { serviceRegistrationSchema, type ServiceListing, type ServiceRegistration } from '../shared/services';
import { socialLinksSchema, webLink } from '../shared/socialLinks';
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
  storeLogo: string | null;
  storeWebsite: string | null;
  storeSocialLinks: string[] | null;
};

const userQuery = `SELECT u.id, u.name, u.email, u.account_type AS "accountType",
  u.is_admin AS "isAdmin", u.document_number AS "documentNumber",
  u.document_type AS "documentType", u.phone, u.address, s.id AS "storeId",
  s.name AS "storeName", s.address AS "businessAddress", s.logo AS "storeLogo",
  s.website AS "storeWebsite", s.social_links AS "storeSocialLinks"
  FROM users u LEFT JOIN stores s ON s.owner_id = u.id`;

const productQuery = `SELECT p.id, p.name, p.category, p.price::float8 AS price,
  p.original_price::float8 AS "originalPrice", p.rating::float8 AS rating, p.reviews,
  CASE WHEN p.image_data IS NOT NULL THEN '/api/products/' || p.id || '/image' ELSE p.image END AS image,
  p.badge, p.featured, p.condition, p.is_bazaar AS "isBazaar", p.description, p.store_id AS "storeId",
  s.name AS "storeName", p.stock, p.sku, p.brand, p.warranty_months AS "warrantyMonths",
  p.delivery_days AS "deliveryDays", p.free_shipping AS "freeShipping", p.sold_count AS "soldCount",
  p.model, p.color, p.size, p.gtin, p.weight_kg::float8 AS "weightKg",
  p.package_length_cm::float8 AS "packageLengthCm", p.package_width_cm::float8 AS "packageWidthCm",
  p.package_height_cm::float8 AS "packageHeightCm", p.discount_percent::float8 AS "discountPercent"
  FROM products p LEFT JOIN stores s ON s.id = p.store_id`;

const storeProfileSchema = z.object({
  storeLogo: z.string().max(349551).regex(/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/)
    .refine((value) => {
      const encoded = value.slice(value.indexOf(',') + 1);
      const bytes = Buffer.from(encoded, 'base64');
      return bytes.length > 0 && bytes.length <= 256 * 1024 && bytes.toString('base64') === encoded;
    }).nullable(),
  storeWebsite: webLink.nullable(),
  storeSocialLinks: z.array(webLink).max(10),
});

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72).refine((value) => !bcrypt.truncates(value), 'Senha longa demais.'),
  accountType: z.enum(['customer', 'merchant']),
  documentNumber: z.string().max(32).refine(isValidBrazilianDocument, 'CPF ou CNPJ inválido.'),
  phone: z.string().trim().min(1).max(30),
  storeName: z.string().trim().max(120).optional(),
  businessAddress: z.string().trim().max(500).optional(),
  storeLogo: storeProfileSchema.shape.storeLogo.optional(),
  storeWebsite: storeProfileSchema.shape.storeWebsite.optional(),
  storeSocialLinks: storeProfileSchema.shape.storeSocialLinks.optional(),
}).refine((value) => value.accountType !== 'merchant' || (value.storeName && value.businessAddress), {
  message: 'Informe o nome e o endereço da loja.',
});

const productImage = z.string().max(2796230).regex(/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/)
  .refine((value) => {
    const separator = value.indexOf(',');
    if (separator < 0) return false;
    const header = value.slice(0, separator);
    const encoded = value.slice(separator + 1);
    const bytes = Buffer.from(encoded, 'base64');
    if (!bytes.length || bytes.length > 2 * 1024 * 1024 || bytes.toString('base64') !== encoded) return false;
    if (header === 'data:image/png;base64') return bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
    if (header === 'data:image/jpeg;base64') return bytes.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
    if (header === 'data:image/gif;base64') return ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'));
    return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  });
const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.enum(productCategories),
  price: z.number().finite().min(0).max(9999999999).multipleOf(0.01),
  originalPrice: z.number().finite().min(0).max(9999999999).optional(),
  discountPercent: z.number().finite().min(0).max(100).multipleOf(0.01).optional(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0).max(100000000),
  image: z.union([productImage, webLink]),
  badge: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  condition: z.enum(['novo', 'seminovo', 'usado', 'recondicionado']).default('novo'),
  description: z.string().trim().min(1).max(5000),
  storeId: z.string().max(254).optional(),
  stock: z.number().int().min(0).max(100000000),
  sku: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().trim().min(1).max(100).optional(),
  color: z.string().trim().min(1).max(100).optional(),
  size: z.string().trim().min(1).max(100).optional(),
  gtin: z.string().refine(isValidGtin, 'Informe um código universal (GTIN) válido.').optional(),
  weightKg: z.number().finite().positive().max(9999999.999).multipleOf(0.001).optional(),
  packageLengthCm: z.number().finite().positive().max(99999999.99).multipleOf(0.01).optional(),
  packageWidthCm: z.number().finite().positive().max(99999999.99).multipleOf(0.01).optional(),
  packageHeightCm: z.number().finite().positive().max(99999999.99).multipleOf(0.01).optional(),
  warrantyMonths: z.number().int().min(0).max(1200),
  deliveryDays: z.number().int().min(1).max(3650),
  freeShipping: z.boolean().optional(),
}).strict().refine((data) => data.condition !== 'novo' || Boolean(data.gtin), {
  message: 'Informe o código universal (GTIN) para produtos novos.',
  path: ['gtin'],
}).refine((data) => data.discountPercent === undefined || data.originalPrice === undefined, {
  message: 'Informe desconto ou preço original, não ambos.',
});

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
app.use(['/api/auth/register', '/api/stores/profile'], express.json({ limit: '400kb' }));
app.use('/api/products', express.json({ limit: '3mb' }));
app.use('/api/services/import', express.json({ limit: '4mb' }));
app.use('/api/services', express.json({ limit: '256kb' }));
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

const serviceLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Tente novamente mais tarde.' },
});

type ServiceRow = Omit<ServiceListing, 'businessName' | 'startingPrice'> & {
  businessName: string | null;
  startingPrice: number | null;
};

const serviceQuery = `SELECT id, provider_type AS "providerType", provider_name AS "providerName",
  business_name AS "businessName", service_name AS "serviceName", category, description, phone, city,
  starting_price::float8 AS "startingPrice", social_links AS "socialLinks" FROM services`;

function publicService(row: ServiceRow): ServiceListing {
  return { ...row, businessName: row.businessName ?? undefined, startingPrice: row.startingPrice ?? undefined };
}

const insertServiceSql = `INSERT INTO services
  (id, provider_type, provider_name, business_name, document_number, service_name, category, description,
   phone, city, starting_price, legacy_key, social_links)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  ON CONFLICT (legacy_key) DO NOTHING RETURNING id`;

function serviceValues(service: ServiceRegistration, legacyKey: string | null) {
  return [randomUUID(), service.providerType, service.providerName, service.businessName || null,
    service.documentNumber, service.serviceName, service.category, service.description,
    service.phone, service.city, service.startingPrice ?? null, legacyKey, service.socialLinks ?? []];
}

app.get('/api/services', asyncRoute(async (_req, res) => {
  const result = await pool.query<ServiceRow>(`${serviceQuery} ORDER BY created_at DESC, id DESC`);
  res.json(result.rows.map(publicService));
}));

app.post('/api/services', serviceLimit, asyncRoute(async (req, res) => {
  const parsed = serviceRegistrationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados do serviço inválidos. Confira os campos e o CPF ou CNPJ.' });
    return;
  }
  const inserted = await pool.query<{ id: string }>(insertServiceSql, serviceValues(parsed.data, null));
  const result = await pool.query<ServiceRow>(`${serviceQuery} WHERE id = $1`, [inserted.rows[0].id]);
  res.status(201).json(publicService(result.rows[0]));
}));

const importServicesSchema = z.object({
  services: z.array(z.object({
    legacyId: z.string().min(1).max(200),
    service: serviceRegistrationSchema,
  }).strict()).min(1).max(100),
}).strict();

app.post('/api/services/import', serviceLimit, asyncRoute(async (req, res) => {
  const parsed = importServicesSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Dados locais inválidos. Nenhum serviço deste lote foi importado.' });
    return;
  }
  const client = await pool.connect();
  const services: ServiceListing[] = [];
  try {
    await client.query('BEGIN');
    for (const entry of parsed.data.services) {
      const key = createHash('sha256').update(JSON.stringify([entry.legacyId, entry.service])).digest('hex');
      await client.query(insertServiceSql, serviceValues(entry.service, key));
      const result = await client.query<ServiceRow>(`${serviceQuery} WHERE legacy_key = $1`, [key]);
      services.push(publicService(result.rows[0]));
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  res.json(services);
}));

app.patch('/api/services/:id/social-links', asyncRoute(async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Faça login para continuar.' });
    return;
  }
  if (!user.isAdmin) {
    res.status(403).json({ error: 'Apenas administradores podem editar serviços.' });
    return;
  }
  const id = z.string().uuid().safeParse(req.params.id);
  const parsed = z.object({ socialLinks: socialLinksSchema }).strict().safeParse(req.body);
  if (!id.success || !parsed.success) {
    res.status(400).json({ error: 'Serviço ou links de redes sociais inválidos.' });
    return;
  }
  const updated = await pool.query<{ id: string }>(
    'UPDATE services SET social_links = $1 WHERE id = $2 RETURNING id', [parsed.data.socialLinks, id.data],
  );
  if (!updated.rowCount) {
    res.status(404).json({ error: 'Serviço não encontrado.' });
    return;
  }
  const result = await pool.query<ServiceRow>(`${serviceQuery} WHERE id = $1`, [id.data]);
  res.json(publicService(result.rows[0]));
}));

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
      await client.query(
        'INSERT INTO stores (id, owner_id, name, address, logo, website, social_links) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [randomUUID(), userId, data.storeName, data.businessAddress, data.storeLogo ?? null,
          data.storeWebsite ?? null, data.storeSocialLinks ?? []],
      );
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
  const result = await pool.query('SELECT id, name, address, logo, website, social_links AS "socialLinks" FROM stores ORDER BY name');
  res.json(result.rows);
}));

app.patch('/api/stores/profile', asyncRoute(async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'Faça login para continuar.' });
    return;
  }
  if (user.accountType !== 'merchant' || !user.storeId) {
    res.status(403).json({ error: 'Conta sem loja vinculada.' });
    return;
  }
  const parsed = storeProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Logo, site ou redes sociais inválidos.' });
    return;
  }
  const result = await pool.query(
    'UPDATE stores SET logo = $1, website = $2, social_links = $3 WHERE id = $4 AND owner_id = $5 RETURNING id',
    [parsed.data.storeLogo, parsed.data.storeWebsite, parsed.data.storeSocialLinks, user.storeId, user.id],
  );
  if (!result.rowCount) {
    res.status(404).json({ error: 'Loja não encontrada.' });
    return;
  }
  res.json({ user: { ...user, ...parsed.data } });
}));

app.get('/api/products', asyncRoute(async (_req, res) => {
  const result = await pool.query(`${productQuery} ORDER BY p.created_at DESC, p.id ASC`);
  res.json(result.rows);
}));

app.get('/api/products/:id/image', asyncRoute(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    res.status(400).json({ error: 'Produto inválido.' });
    return;
  }
  const result = await pool.query<{ image_data: Buffer; image_type: string }>(
    'SELECT image_data, image_type FROM products WHERE id = $1 AND image_data IS NOT NULL', [id],
  );
  const image = result.rows[0];
  if (!image) {
    res.status(404).json({ error: 'Imagem não encontrada.' });
    return;
  }
  res.type(image.image_type).send(image.image_data);
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
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Dados do produto inválidos.' });
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
  const uploaded = data.image.startsWith('data:image/');
  const imageData = uploaded ? Buffer.from(data.image.slice(data.image.indexOf(',') + 1), 'base64') : null;
  const imageType = uploaded ? data.image.slice(5, data.image.indexOf(';')) : null;
  const discount = data.discountPercent ?? 0;
  const salePrice = discount > 0 ? discountedPrice(data.price, discount) : data.price;
  const originalPrice = discount > 0 ? data.price : data.originalPrice ?? null;
  const result = await pool.query<{ id: number }>(
    `INSERT INTO products
     (store_id, name, category, price, original_price, rating, reviews, image, badge, featured, condition,
      description, stock, sku, brand, warranty_months, delivery_days, free_shipping,
      model, color, size, gtin, weight_kg, package_length_cm, package_width_cm, package_height_cm,
      discount_percent, image_data, image_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
             $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
     RETURNING id`,
    [storeId, data.name, data.category, salePrice, originalPrice,
      user.isAdmin ? data.rating : 0, user.isAdmin ? data.reviews : 0,
      uploaded ? 'uploaded' : data.image, data.badge ?? null, data.featured ?? false, data.condition ?? null, data.description,
      data.stock, data.sku ?? null, data.brand ?? null, data.warrantyMonths, data.deliveryDays, data.freeShipping ?? false,
      data.model ?? null, data.color ?? null, data.size ?? null, data.gtin ?? null, data.weightKg ?? null,
      data.packageLengthCm ?? null, data.packageWidthCm ?? null, data.packageHeightCm ?? null,
      data.discountPercent ?? null, imageData, imageType],
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
