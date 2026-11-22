import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
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
    await control.query(await readFile(new URL('./migrations/003_store_profile.sql', import.meta.url), 'utf8'));
    await control.query("INSERT INTO stores (id, name) VALUES ('demo-store', 'Loja demonstrativa')");
    await control.query(
      `INSERT INTO products (id, store_id, name, category, price, image, description, created_at, condition)
       VALUES (1, 'demo-store', 'Produto demonstrativo', 'Roupas', 10, 'demo:1', 'Exemplo', TIMESTAMPTZ 'epoch', 'usado')`,
    );
    await control.query("SELECT setval(pg_get_serial_sequence('products', 'id'), 1)");
    await control.query(await readFile(new URL('./migrations/004_product_details.sql', import.meta.url), 'utf8'));
    await control.query(await readFile(new URL('./migrations/005_services.sql', import.meta.url), 'utf8'));
    const oldService = {
      providerType: 'individual', providerName: 'Prestador Teste', documentNumber: '52998224725',
      serviceName: 'Serviço antigo', category: 'Casa e manutenção', description: 'Serviço de teste',
      phone: '11999999999', city: 'Cidade teste', startingPrice: 12.5,
    };
    const oldServiceId = randomUUID();
    const oldKey = createHash('sha256').update(JSON.stringify(['legacy-test-1', oldService])).digest('hex');
    await control.query(
      `INSERT INTO services (id, provider_type, provider_name, document_number, service_name, category, description, phone, city, starting_price, legacy_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [oldServiceId, oldService.providerType, oldService.providerName, oldService.documentNumber, oldService.serviceName,
        oldService.category, oldService.description, oldService.phone, oldService.city, oldService.startingPrice, oldKey],
    );
    await control.query(await readFile(new URL('./migrations/006_service_social_links.sql', import.meta.url), 'utf8'));
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

    const service = {
      providerType: 'individual', providerName: 'Prestador Teste', documentNumber: '529.982.247-25',
      serviceName: 'Reparo teste', category: 'Casa e manutenção', description: 'Serviço de teste',
      phone: '11999999999', city: 'Cidade teste', startingPrice: 12.5,
      socialLinks: [' https://social.example.invalid/um ', 'https://social.example.invalid/dois'],
    };
    assert.equal((await request('/api/services', 'POST', { ...service, documentNumber: '123' })).status, 400);
    assert.equal((await request('/api/services', 'POST', { ...service, providerType: 'company' })).status, 400);
    assert.equal((await request('/api/services', 'POST', { ...service, startingPrice: -1 })).status, 400);
    assert.equal((await request('/api/services', 'POST', { ...service, socialLinks: ['javascript:alert(1)'] })).status, 400);
    assert.equal((await request('/api/services', 'POST', { ...service, socialLinks: Array(11).fill('https://social.example.invalid') })).status, 400);
    const publicServiceSchema = z.object({
      id: z.string(), serviceName: z.string(), startingPrice: z.number().optional(), socialLinks: z.array(z.string()),
    }).passthrough();
    const createdService = await request('/api/services', 'POST', service);
    assert.equal(createdService.status, 201);
    const publicService = publicServiceSchema.parse(await createdService.json());
    assert.equal(publicService.serviceName, service.serviceName);
    assert.equal(publicService.startingPrice, 12.5);
    assert.deepEqual(publicService.socialLinks, ['https://social.example.invalid/um', 'https://social.example.invalid/dois']);
    assert.equal('documentNumber' in publicService, false);
    assert.equal('legacyKey' in publicService, false);
    const persistedService = await control.query('SELECT document_number FROM services WHERE id = $1', [publicService.id]);
    assert.equal(persistedService.rows[0].document_number, '52998224725');
    const company = await request('/api/services', 'POST', {
      ...service, providerType: 'company', documentNumber: '11222333000181',
      businessName: 'Empresa teste', startingPrice: undefined, socialLinks: undefined,
    });
    assert.equal(company.status, 201);
    const companyService = publicServiceSchema.parse(await company.json());
    assert.equal(companyService.startingPrice, undefined);
    assert.equal(companyService.businessName, 'Empresa teste');
    assert.deepEqual(companyService.socialLinks, []);
    assert.equal('documentNumber' in companyService, false);
    const localService = { legacyId: 'legacy-test-1', service: { ...service, serviceName: 'Serviço antigo', socialLinks: undefined } };
    const imported = await request('/api/services/import', 'POST', { services: [localService] });
    assert.equal(imported.status, 200);
    const importedServices = z.array(publicServiceSchema).parse(await imported.json());
    assert.equal(importedServices.length, 1);
    assert.equal(importedServices[0].id, oldServiceId);
    assert.deepEqual(importedServices[0].socialLinks, []);
    assert.equal('documentNumber' in importedServices[0], false);
    const repeated = await request('/api/services/import', 'POST', { services: [localService] });
    assert.equal(repeated.status, 200);
    const repeatedServices = z.array(publicServiceSchema).parse(await repeated.json());
    assert.equal(repeatedServices[0].id, importedServices[0].id);
    const invalidBatch = await request('/api/services/import', 'POST', {
      services: [{ ...localService, legacyId: 'uncommitted' }, { ...localService, service: { ...service, phone: '' } }],
    });
    assert.equal(invalidBatch.status, 400);
    const allServices = z.array(publicServiceSchema).parse(await (await request('/api/services')).json());
    assert.equal(allServices.length, 3);
    assert.ok(allServices.every((entry: object) => !('documentNumber' in entry) && !('legacyKey' in entry)));
    assert.equal((await request(`/api/services/${publicService.id}/social-links`, 'PATCH', { socialLinks: [] })).status, 401);

    const registration = {
      name: 'Lojista Teste', email: 'lojista@example.invalid', password: 'test-password',
      accountType: 'merchant', documentNumber: '52998224725', phone: '11999999999',
      storeName: 'Loja Teste', businessAddress: 'Rua de teste',
      storeLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=',
      storeWebsite: 'https://loja.example.invalid',
      storeSocialLinks: ['https://social.example.invalid/loja'],
    };
    const invalid = await request('/api/auth/register', 'POST', { ...registration, documentNumber: '123' });
    assert.equal(invalid.status, 400);
    assert.equal((await request('/api/auth/register', 'POST', { ...registration, storeWebsite: 'javascript:alert(1)' })).status, 400);
    assert.equal((await request('/api/auth/register', 'POST', { ...registration, storeLogo: 'data:image/svg+xml;base64,aGVsbG8=' })).status, 400);
    assert.equal((await request('/api/auth/register', 'POST', {
      ...registration, storeLogo: `data:image/png;base64,${Buffer.alloc(256 * 1024 + 1).toString('base64')}`,
    })).status, 400);
    const created = await request('/api/auth/register', 'POST', registration);
    assert.equal(created.status, 201);
    const cookie = created.headers.get('set-cookie')?.split(';')[0];
    assert.ok(cookie);
    assert.match(created.headers.get('set-cookie') ?? '', /HttpOnly/i);
    const { user } = z.object({
      user: z.object({
        id: z.string(), storeId: z.string(), isAdmin: z.boolean(), storeLogo: z.string(),
        storeWebsite: z.string(), storeSocialLinks: z.array(z.string()),
      }),
    }).parse(await created.json());
    assert.ok(user.storeId);
    assert.equal(user.isAdmin, false);
    const serviceLinksPath = `/api/services/${importedServices[0].id}/social-links`;
    assert.equal((await request(serviceLinksPath, 'PATCH', { socialLinks: [] }, cookie)).status, 403);
    await control.query('UPDATE users SET is_admin = true WHERE id = $1', [user.id]);
    assert.equal((await request(serviceLinksPath, 'PATCH', { socialLinks: ['javascript:alert(1)'] }, cookie)).status, 400);
    assert.equal((await request(serviceLinksPath, 'PATCH', { socialLinks: Array(11).fill('https://social.example.invalid') }, cookie)).status, 400);
    assert.equal((await request('/api/services/invalid/social-links', 'PATCH', { socialLinks: [] }, cookie)).status, 400);
    assert.equal((await request('/api/services/00000000-0000-4000-8000-000000000000/social-links', 'PATCH', { socialLinks: [] }, cookie)).status, 404);
    const updatedSocialLinks = await request(serviceLinksPath, 'PATCH', { socialLinks: [' https://social.example.invalid/novo '] }, cookie);
    assert.equal(updatedSocialLinks.status, 200);
    const updatedService = publicServiceSchema.parse(await updatedSocialLinks.json());
    assert.deepEqual(updatedService.socialLinks, ['https://social.example.invalid/novo']);
    assert.equal('documentNumber' in updatedService, false);
    const reimported = z.array(publicServiceSchema).parse(await (await request('/api/services/import', 'POST', { services: [localService] })).json());
    assert.equal(reimported[0].id, oldServiceId);
    assert.deepEqual(reimported[0].socialLinks, updatedService.socialLinks);
    assert.equal((await request(serviceLinksPath, 'PATCH', { socialLinks: [] }, cookie)).status, 200);
    const cleared = z.array(publicServiceSchema).parse(await (await request('/api/services')).json()).find((entry) => entry.id === oldServiceId);
    assert.deepEqual(cleared?.socialLinks, []);
    await control.query('UPDATE users SET is_admin = false WHERE id = $1', [user.id]);
    assert.equal(user.storeLogo, registration.storeLogo);
    assert.equal(user.storeWebsite, registration.storeWebsite);
    assert.deepEqual(user.storeSocialLinks, registration.storeSocialLinks);
    const stores = z.array(z.object({
      id: z.string(), logo: z.string().nullable(), website: z.string().nullable(), socialLinks: z.array(z.string()),
    })).parse(await (await request('/api/stores')).json());
    const createdStore = stores.find((store) => store.id === user.storeId);
    assert.equal(createdStore?.logo, registration.storeLogo);
    assert.equal(createdStore?.website, registration.storeWebsite);
    assert.deepEqual(createdStore?.socialLinks, registration.storeSocialLinks);
    const profile = { storeLogo: null, storeWebsite: null, storeSocialLinks: ['https://social.example.invalid/novo'] };
    assert.equal((await request('/api/stores/profile', 'PATCH', profile)).status, 401);
    assert.equal((await request('/api/stores/profile', 'PATCH', { ...profile, storeSocialLinks: ['javascript:alert(1)'] }, cookie)).status, 400);
    assert.equal((await request('/api/stores/profile', 'PATCH', profile, cookie)).status, 200);
    const updatedSession = z.object({
      user: z.object({ storeLogo: z.null(), storeWebsite: z.null(), storeSocialLinks: z.array(z.string()) }),
    }).parse(await (await request('/api/auth/me', 'GET', undefined, cookie)).json());
    assert.deepEqual(updatedSession.user.storeSocialLinks, profile.storeSocialLinks);
    const updatedStores = z.array(z.object({
      id: z.string(), logo: z.string().nullable(), website: z.string().nullable(), socialLinks: z.array(z.string()),
    })).parse(await (await request('/api/stores')).json());
    const updatedStore = updatedStores.find((store) => store.id === user.storeId);
    assert.equal(updatedStore?.logo, null);
    assert.equal(updatedStore?.website, null);
    assert.deepEqual(updatedStore?.socialLinks, profile.storeSocialLinks);
    assert.equal((await request('/api/auth/register', 'POST', registration)).status, 409);

    const product = {
      name: 'Produto teste', category: 'Pet Shop', price: 25, rating: 5, reviews: 999,
      image: registration.storeLogo, description: 'Descrição teste', stock: 3,
      warrantyMonths: 12, deliveryDays: 3, storeId: 'outra-loja',
      condition: 'novo', gtin: '7894900011517', discountPercent: 12.5,
      brand: 'Marca', model: 'Modelo', color: 'Azul', size: 'M', weightKg: 0.125,
      packageLengthCm: 12.5, packageWidthCm: 8, packageHeightCm: 3,
    };
    assert.equal((await request('/api/products', 'POST', product)).status, 401);
    assert.equal((await request('/api/products', 'POST', { ...product, gtin: undefined }, cookie)).status, 400);
    assert.equal((await request('/api/products', 'POST', { ...product, condition: undefined, gtin: undefined }, cookie)).status, 400);
    assert.equal((await request('/api/products', 'POST', { ...product, gtin: '7894900011518' }, cookie)).status, 400);
    assert.equal((await request('/api/products', 'POST', { ...product, discountPercent: 101 }, cookie)).status, 400);
    assert.equal((await request('/api/products', 'POST', { ...product, weightKg: -1 }, cookie)).status, 400);
    assert.equal((await request('/api/products', 'POST', { ...product, image: 'data:image/png;base64,aGVsbG8=' }, cookie)).status, 400);
    const largeImage = Buffer.alloc(2 * 1024 * 1024);
    Buffer.from('89504e470d0a1a0a', 'hex').copy(largeImage);
    const tooLargeImage = Buffer.concat([largeImage, Buffer.from([0])]);
    assert.equal((await request('/api/products', 'POST', {
      ...product, image: `data:image/png;base64,${tooLargeImage.toString('base64')}`,
    }, cookie)).status, 400);
    const inserted = await request('/api/products', 'POST', product, cookie);
    assert.equal(inserted.status, 201);
    const saved = z.object({
      id: z.number(), storeId: z.string(), category: z.string(), rating: z.number(), reviews: z.number(),
      price: z.number(), originalPrice: z.number(), discountPercent: z.number(), image: z.string(),
      isBazaar: z.boolean(), condition: z.string(), brand: z.string(), model: z.string(),
      color: z.string(), size: z.string(), gtin: z.string(), weightKg: z.number(),
      packageLengthCm: z.number(), packageWidthCm: z.number(), packageHeightCm: z.number(),
    }).parse(await inserted.json());
    assert.equal(saved.storeId, user.storeId);
    assert.equal(saved.category, 'Pet Shop');
    assert.equal(saved.rating, 0);
    assert.equal(saved.reviews, 0);
    assert.equal(saved.price, 21.88);
    assert.equal(saved.originalPrice, 25);
    assert.equal(saved.discountPercent, 12.5);
    assert.equal(saved.isBazaar, false);
    assert.equal(saved.condition, 'novo');
    assert.equal(saved.brand, product.brand);
    assert.equal(saved.model, product.model);
    assert.equal(saved.color, product.color);
    assert.equal(saved.size, product.size);
    assert.equal(saved.gtin, product.gtin);
    assert.equal(saved.weightKg, product.weightKg);
    assert.equal(saved.packageLengthCm, product.packageLengthCm);
    assert.equal(saved.packageWidthCm, product.packageWidthCm);
    assert.equal(saved.packageHeightCm, product.packageHeightCm);
    const uploadedImage = await request(saved.image);
    assert.equal(uploadedImage.status, 200);
    assert.equal(uploadedImage.headers.get('content-type'), 'image/png');
    assert.deepEqual(Buffer.from(await uploadedImage.arrayBuffer()), Buffer.from(product.image.split(',')[1], 'base64'));
    const listing = z.array(z.object({ id: z.number(), isBazaar: z.boolean() })).parse(await (await request('/api/products')).json());
    assert.equal(listing[0].id, saved.id);
    assert.equal(listing.find((item) => item.id === 1)?.isBazaar, true);
    const refurbished = await request('/api/products', 'POST', {
      ...product, condition: 'recondicionado', gtin: undefined, discountPercent: undefined,
      image: 'https://example.invalid/product.png',
    }, cookie);
    assert.equal(refurbished.status, 201);
    const refurbishedProduct = z.object({
      id: z.number(), condition: z.string(), gtin: z.null(), isBazaar: z.boolean(),
      price: z.number(), originalPrice: z.null(), image: z.string(),
    }).parse(await refurbished.json());
    assert.equal(refurbishedProduct.condition, 'recondicionado');
    assert.equal(refurbishedProduct.isBazaar, false);
    assert.equal(refurbishedProduct.price, 25);
    assert.equal(refurbishedProduct.image, 'https://example.invalid/product.png');
    assert.equal((await request(`/api/products/${refurbishedProduct.id}`, 'DELETE', undefined, cookie)).status, 204);
    const maximumImage = await request('/api/products', 'POST', {
      ...product, condition: 'usado', gtin: undefined, image: `data:image/png;base64,${largeImage.toString('base64')}`,
    }, cookie);
    assert.equal(maximumImage.status, 201);
    const maximumImageProduct = z.object({ id: z.number(), image: z.string() }).parse(await maximumImage.json());
    const maximumImageResponse = await request(maximumImageProduct.image);
    assert.deepEqual(Buffer.from(await maximumImageResponse.arrayBuffer()), largeImage);
    assert.equal((await request(`/api/products/${maximumImageProduct.id}`, 'DELETE', undefined, cookie)).status, 204);
    const second = await request('/api/auth/register', 'POST', {
      ...registration, email: 'outro@example.invalid',
      storeLogo: undefined, storeWebsite: undefined, storeSocialLinks: undefined,
    });
    const secondCookie = second.headers.get('set-cookie')?.split(';')[0];
    assert.ok(secondCookie);
    const secondUser = z.object({ user: z.object({
      storeLogo: z.null(), storeWebsite: z.null(), storeSocialLinks: z.array(z.string()),
    }) }).parse(await second.json()).user;
    assert.deepEqual(secondUser.storeSocialLinks, []);
    assert.equal((await request('/api/stores/profile', 'PATCH', {
      storeLogo: null, storeWebsite: 'https://other.example.invalid', storeSocialLinks: [],
    }, secondCookie)).status, 200);
    const largestLogo = `data:image/png;base64,${Buffer.alloc(256 * 1024).toString('base64')}`;
    assert.equal((await request('/api/stores/profile', 'PATCH', {
      storeLogo: largestLogo, storeWebsite: null, storeSocialLinks: [],
    }, secondCookie)).status, 200);
    const unchanged = z.object({
      user: z.object({ storeWebsite: z.null(), storeSocialLinks: z.array(z.string()) }),
    }).parse(await (await request('/api/auth/me', 'GET', undefined, cookie)).json());
    assert.deepEqual(unchanged.user.storeSocialLinks, profile.storeSocialLinks);
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
