import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  addProductToCatalog,
  getCatalogProducts,
  persistCatalogProducts,
  type Product,
} from '../../data/products';

const defaultForm = {
  name: '',
  category: 'Roupas',
  price: '',
  originalPrice: '',
  rating: '4.8',
  reviews: '0',
  badge: 'Novo',
  description: '',
};

export function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(() => getCatalogProducts());
  const [form, setForm] = useState(defaultForm);

  const hasAccess = Boolean(user?.isAdmin);

  const metrics = useMemo(
    () => ({
      products: products.length,
      revenue: products.reduce((sum, item) => sum + item.price, 0),
      avgRating: (products.reduce((sum, item) => sum + item.rating, 0) / (products.length || 1)).toFixed(1),
    }),
    [products],
  );

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field: keyof typeof defaultForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProduct: Product = {
      id: Date.now(),
      name: form.name,
      category: form.category as Product['category'],
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      badge: form.badge || 'Novo',
      description: form.description || 'Produto cadastrado no catálogo.',
      featured: true,
    };

    const nextProducts = addProductToCatalog(newProduct);
    setProducts(nextProducts);
    setForm(defaultForm);
  };

  const removeProduct = (productId: number) => {
    const nextProducts = getCatalogProducts().filter((product) => product.id !== productId);
    persistCatalogProducts(nextProducts);
    setProducts(nextProducts);
  };

  return (
    <main className="page-shell admin-page">
      <header className="page-header">
        <h1>Painel administrativo</h1>
        <p>Gerencie os produtos, campanhas e ofertas do marketplace.</p>
      </header>

      <section className="admin-metrics">
        <div className="metric-card">
          <span>Produtos</span>
          <strong>{metrics.products}</strong>
        </div>
        <div className="metric-card">
          <span>Receita simulada</span>
          <strong>R$ {metrics.revenue}</strong>
        </div>
        <div className="metric-card">
          <span>Média de avaliação</span>
          <strong>{metrics.avgRating}</strong>
        </div>
      </section>

      <div className="admin-layout">
        <section className="admin-form-card">
          <h2>Novo produto</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Nome
              <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
            </label>

            <div className="two-column">
              <label>
                Categoria
                <select value={form.category} onChange={(event) => handleChange('category', event.target.value)}>
                  <option value="Roupas">Roupas</option>
                  <option value="Calçados">Calçados</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                </select>
              </label>

              <label>
                Preço
                <input type="number" value={form.price} onChange={(event) => handleChange('price', event.target.value)} required />
              </label>
            </div>

            <div className="two-column">
              <label>
                Preço original
                <input type="number" value={form.originalPrice} onChange={(event) => handleChange('originalPrice', event.target.value)} />
              </label>

              <label>
                Avaliação
                <input type="number" step="0.1" value={form.rating} onChange={(event) => handleChange('rating', event.target.value)} />
              </label>
            </div>

            <div className="two-column">
              <label>
                Reviews
                <input type="number" value={form.reviews} onChange={(event) => handleChange('reviews', event.target.value)} />
              </label>

              <label>
                Badge
                <input value={form.badge} onChange={(event) => handleChange('badge', event.target.value)} />
              </label>
            </div>

            <label>
              Descrição
              <textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} rows={4} />
            </label>

            <button type="submit" className="primary-btn">
              Publicar produto
            </button>
          </form>
        </section>

        <section className="admin-products">
          <h2>Produtos cadastrados</h2>

          <div className="admin-product-list">
            {products.slice(0, 6).map((product) => (
              <article key={product.id} className="admin-product-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <small>R$ {product.price}</small>
                </div>
                <button type="button" className="remove-item" onClick={() => removeProduct(product.id)}>
                  Remover
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
