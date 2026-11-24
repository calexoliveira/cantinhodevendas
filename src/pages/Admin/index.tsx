import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ProductForm } from '../../components/ProductForm';
import { useAuth } from '../../context/useAuth';
import { useCatalog } from '../../context/useCatalog';
import { errorMessage } from '../../api';
import { demoStore } from '../../data/stores';
import { ServiceAdmin } from './ServiceAdmin';
import { StoreApprovals } from './StoreApprovals';
import type { Product } from '../../data/products';

export function Admin() {
  const { user, merchants } = useAuth();
  const { products, addProduct, updateProduct, removeProduct } = useCatalog();
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const handleRemove = async (productId: number) => {
    const product = products.find((item) => item.id === productId);
    if (!window.confirm(`Deseja excluir o produto "${product?.name ?? ''}"?`)) return;
    setError('');
    try {
      await removeProduct(productId);
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };

  return (
    <main className="page-shell admin-page">
      <header className="page-header">
        <h1>Painel administrativo</h1>
        <p>Gerencie os produtos, campanhas e ofertas do marketplace.</p>
      </header>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}
      <StoreApprovals />

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
          <h2>{editingProduct ? 'Editar produto' : 'Novo produto'}</h2>
          <ProductForm
            key={editingProduct?.id ?? 'new'}
            isAdmin
            initialProduct={editingProduct ?? undefined}
            onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
            onSubmit={async (product) => {
              if (editingProduct) {
                await updateProduct(editingProduct.id, { ...product, storeId: editingProduct.storeId });
                setEditingProduct(null);
                return;
              }
              await addProduct({
                ...product,
                storeId: merchants.find((store) => store.id !== demoStore.id)?.id,
              });
            }}
          />
        </section>

        <section className="admin-products">
          <h2>Produtos cadastrados</h2>
          <div className="admin-product-list">
            {products.map((product) => (
              <article key={product.id} className="admin-product-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <small>R$ {product.price}</small>
                </div>
                <button type="button" className="secondary-btn" onClick={() => setEditingProduct(product)}>
                  Editar
                </button>
                <button type="button" className="remove-item" onClick={() => void handleRemove(product.id)}>
                  Remover
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
      <ServiceAdmin />
    </main>
  );
}
