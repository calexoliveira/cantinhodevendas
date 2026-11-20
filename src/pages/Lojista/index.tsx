import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addProductToCatalog, getCatalogProducts, persistCatalogProducts, type Product } from '../../data/products';
import { formatBrazilianDocument } from '../../utils/brazilianDocument';

export function PainelLojista() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(() =>
    getCatalogProducts().filter((product) => product.storeId === user?.email),
  );
  const [form, setForm] = useState({
    name: '',
    category: 'Roupas',
    price: '',
    originalPrice: '',
    description: '',
    stock: '10',
    sku: '',
    brand: '',
    warrantyMonths: '12',
    deliveryDays: '3',
    freeShipping: false,
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== 'merchant') {
    return <Navigate to="/conta" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const product: Product = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category as Product['category'],
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      rating: 0,
      reviews: 0,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      badge: 'Novo',
      description: form.description.trim() || 'Produto cadastrado pela loja.',
      featured: true,
      storeId: user.email,
      storeName: user.storeName,
      stock: Number(form.stock),
      sku: form.sku.trim() || undefined,
      brand: form.brand.trim() || undefined,
      warrantyMonths: Number(form.warrantyMonths),
      deliveryDays: Number(form.deliveryDays),
      freeShipping: form.freeShipping,
      soldCount: 0,
    };

    const nextProducts = addProductToCatalog(product);
    setProducts(nextProducts.filter((item) => item.storeId === user.email));
    setForm({ name: '', category: 'Roupas', price: '', originalPrice: '', description: '', stock: '10', sku: '', brand: '', warrantyMonths: '12', deliveryDays: '3', freeShipping: false });
  };

  const removeProduct = (productId: number) => {
    const nextProducts = getCatalogProducts().filter((product) => product.id !== productId);
    persistCatalogProducts(nextProducts);
    setProducts(nextProducts.filter((item) => item.storeId === user.email));
  };

  return (
    <main className="page-shell merchant-dashboard">
      <header className="page-header">
        <h1>Área do lojista</h1>
        <p>Gerencie seu perfil comercial no Cantinho de Vendas.</p>
      </header>

      <section className="merchant-card merchant-profile-card">
        <span className="account-label">Perfil comercial</span>
        <h2>{user.storeName}</h2>
        <div className="account-profile-details">
          <p><strong>Responsável:</strong> {user.name}</p>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>Telefone:</strong> {user.phone || 'Não informado'}</p>
          <p>
            <strong>{user.documentType?.toUpperCase() ?? 'CPF/CNPJ'}:</strong>{' '}
            {user.documentNumber ? formatBrazilianDocument(user.documentNumber) : 'Não informado'}
          </p>
          <p><strong>Endereço comercial:</strong> {user.businessAddress || 'Não informado'}</p>
        </div>
        <div className="account-actions">
          <Link to="/lojistas" className="secondary-btn">Ver catálogo de lojistas</Link>
          <Link to="/produtos" className="primary-btn">Ver catálogo de produtos</Link>
        </div>
      </section>

      <div className="admin-layout">
        <section className="admin-form-card">
          <h2>Cadastrar produto da loja</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Nome
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <div className="two-column">
              <label>
                Categoria
                <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                  <option value="Roupas">Roupas</option>
                  <option value="Calçados">Calçados</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                </select>
              </label>
              <label>
                Preço
                <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
              </label>
            </div>
            <label>
              Preço original
              <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(event) => setForm((current) => ({ ...current, originalPrice: event.target.value }))} />
            </label>
            <div className="two-column">
              <label>
                Estoque
                <input type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} required />
              </label>
              <label>
                SKU
                <input value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} placeholder="Opcional" />
              </label>
            </div>
            <div className="two-column">
              <label>
                Marca
                <input value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} placeholder="Opcional" />
              </label>
              <label>
                Prazo de entrega (dias)
                <input type="number" min="1" value={form.deliveryDays} onChange={(event) => setForm((current) => ({ ...current, deliveryDays: event.target.value }))} />
              </label>
            </div>
            <div className="two-column">
              <label>
                Garantia (meses)
                <input type="number" min="0" value={form.warrantyMonths} onChange={(event) => setForm((current) => ({ ...current, warrantyMonths: event.target.value }))} />
              </label>
              <label>
                Frete grátis
                <input type="checkbox" checked={form.freeShipping} onChange={(event) => setForm((current) => ({ ...current, freeShipping: event.target.checked }))} />
              </label>
            </div>
            <label>
              Descrição
              <textarea rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <button type="submit" className="primary-btn">Publicar produto</button>
          </form>
        </section>

        <section className="admin-products">
          <h2>Produtos da loja</h2>
          <div className="admin-product-list">
            {products.map((product) => (
              <article key={product.id} className="admin-product-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <small>R$ {product.price}</small>
                </div>
                <button type="button" className="remove-item" onClick={() => removeProduct(product.id)}>Remover</button>
              </article>
            ))}
            {!products.length ? <p>Sua loja ainda não publicou produtos.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
