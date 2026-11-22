import { pool } from './db';

const products = [
  { id: 1, name: 'Camiseta Premium Essentials', category: 'Roupas', price: 129, originalPrice: 179, rating: 4.9, reviews: 204, badge: 'Mais vendido', featured: true, description: 'Malha premium, corte casual e ótimo caimento para qualquer dia.' },
  { id: 2, name: 'Calça Skinny Plus', category: 'Roupas', price: 219, originalPrice: 269, rating: 4.7, reviews: 148, badge: 'Novidade', featured: true, description: 'Modelagem ajustada com tecido macio, respirável e confortável.' },
  { id: 3, name: 'Camisa Social Urbana', category: 'Roupas', price: 189, rating: 4.8, reviews: 96, featured: true, description: 'Versátil para reuniões, festas e compromissos diários.' },
  { id: 4, name: 'Jaqueta de Lona', category: 'Roupas', price: 249, originalPrice: 299, rating: 4.6, reviews: 132, badge: 'Oferta', description: 'Proteção leve, acabamento refinado e estilo que combina com tudo.' },
  { id: 5, name: 'Bermuda Relax', category: 'Roupas', price: 139, rating: 4.5, reviews: 87, description: 'Corte solto para movimentos livres e uso no dia a dia.' },
  { id: 6, name: 'Tênis Street Run', category: 'Calçados', price: 299, originalPrice: 349, rating: 4.9, reviews: 460, badge: 'Top review', featured: true, description: 'Amortecimento leve com visual esportivo e moderno.' },
  { id: 7, name: 'Bolsa Crossbody', category: 'Acessórios', price: 169, rating: 4.7, reviews: 118, featured: true, description: 'Acessório funcional com acabamento premium para fora do dia.' },
  { id: 8, name: 'Relógio Smart Pulse', category: 'Eletrônicos', price: 399, originalPrice: 499, rating: 4.8, reviews: 310, badge: 'Trending', description: 'Monitoramento e tecnologia em um relógio elegante e prático.' },
  { id: 9, name: 'Jaqueta Vintage Restauro', category: 'Roupas', price: 149, originalPrice: 260, rating: 4.6, reviews: 64, badge: 'Usado', condition: 'usado', description: 'Modelagem clássica com leve uso, mantida em ótimo estado e pronta para uso.' },
  { id: 10, name: 'Bolsa de Trilha Revisada', category: 'Acessórios', price: 109, originalPrice: 190, rating: 4.7, reviews: 41, badge: 'Seminovo', condition: 'seminovo', description: 'Acessório funcional com sinais discretos de uso, mas em excelente condição.' },
  { id: 11, name: 'Computador de escritório Seminovo', category: 'Eletrônicos', price: 550, originalPrice: 600, rating: 4.7, reviews: 41, badge: 'Seminovo', condition: 'seminovo', description: 'Computador de bom desempenho, ideal para tarefas de escritório.' },
];

const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query(
    'INSERT INTO stores (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
    ['demo-store', 'Cantinho de Vendas — Loja de demonstração'],
  );
  for (const product of products) {
    await client.query(
      `INSERT INTO products
       (id, store_id, name, category, price, original_price, rating, reviews, image, badge, featured, condition, description, created_at, is_bazaar)
       VALUES ($1, 'demo-store', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TIMESTAMPTZ 'epoch', $13)
       ON CONFLICT (id) DO NOTHING`,
      [product.id, product.name, product.category, product.price, product.originalPrice ?? null, product.rating,
        product.reviews, `demo:${product.id}`, product.badge ?? null, product.featured ?? false,
        product.condition ?? null, product.description, Boolean(product.condition)],
    );
  }
  await client.query(
    "SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM products), (SELECT last_value FROM products_id_seq)))",
  );
  await client.query('COMMIT');
  console.log('Dados de demonstração inseridos.');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
