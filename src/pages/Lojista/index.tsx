import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCatalog } from '../../context/useCatalog';
import { errorMessage } from '../../api';
import { StoreLinks } from '../../components/StoreLinks';
import { StoreProfileFields } from '../../components/StoreProfileFields';
import { ProductForm } from '../../components/ProductForm';
import { parseStoreProfile, type StoreProfileForm } from '../../utils/storeProfile';
import type { AuthUser } from '../../context/AuthContext';
import { formatBrazilianDocument } from '../../utils/brazilianDocument';

function StoreProfileEditor({ user }: { user: AuthUser }) {
  const { updateStoreProfile } = useAuth();
  const [form, setForm] = useState<StoreProfileForm>({
    logo: user.storeLogo ?? null,
    website: user.storeWebsite ?? '',
    socialLinks: (user.storeSocialLinks ?? []).join('\n'),
  });
  const [busy, setBusy] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    setBusy(true);
    try {
      await updateStoreProfile(parseStoreProfile(form));
      setSaved(true);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-form-card store-profile-editor">
      <h2>Editar marca e contatos da loja</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <fieldset className="store-profile-fields" disabled={busy}>
          <StoreProfileFields value={form} onChange={(next) => { setSaved(false); setForm(next); }} onReadingChange={setLogoLoading} />
        </fieldset>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        {saved ? <p role="status">Informações da loja salvas.</p> : null}
        <button type="submit" className="primary-btn" disabled={busy || logoLoading}>Salvar informações</button>
      </form>
    </section>
  );
}

export function PainelLojista() {
  const { user } = useAuth();
  const { products: catalogProducts, addProduct, removeProduct } = useCatalog();
  const products = catalogProducts.filter((product) => product.storeId === user?.storeId);
  const [error, setError] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== 'merchant') {
    return <Navigate to="/conta" replace />;
  }

  const handleRemove = async (productId: number) => {
    setError('');
    try {
      await removeProduct(productId);
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };

  return (
    <main className="page-shell merchant-dashboard">
      <header className="page-header">
        <h1>Área do lojista</h1>
        <p>Gerencie seu perfil comercial no Cantinho de Vendas.</p>
      </header>
      {error ? <p className="auth-error" role="alert">{error}</p> : null}

      <section className="merchant-card merchant-profile-card">
        <span className="account-label">Perfil comercial</span>
        {user.storeLogo ? <img className="store-logo" src={user.storeLogo} alt={`Logo de ${user.storeName}`} /> : null}
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
          <StoreLinks website={user.storeWebsite} socialLinks={user.storeSocialLinks} />
        </div>
        <div className="account-actions">
          <Link to="/lojistas" className="secondary-btn">Ver catálogo de lojistas</Link>
          <Link to="/produtos" className="primary-btn">Ver catálogo de produtos</Link>
        </div>
      </section>

      <StoreProfileEditor key={user.id} user={user} />

      <div className="admin-layout">
        <section className="admin-form-card">
          <h2>Cadastrar produto da loja</h2>
          <ProductForm isAdmin={false} onSubmit={addProduct} />
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
                <button type="button" className="remove-item" onClick={() => void handleRemove(product.id)}>Remover</button>
              </article>
            ))}
            {!products.length ? <p>Sua loja ainda não publicou produtos.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
