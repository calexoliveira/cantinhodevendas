import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { StoreLinks } from '../../components/StoreLinks';

export function Lojistas() {
  const { merchants } = useAuth();

  return (
    <main className="page-shell merchants-page">
      <header className="page-header">
        <h1>Lojistas</h1>
        <p>Conheça as lojas cadastradas no Cantinho de Vendas.</p>
      </header>

      {merchants.length ? (
        <section className="merchant-grid" aria-label="Catálogo de lojistas">
          {merchants.map((merchant) => (
            <article className="merchant-card" key={merchant.id}>
              <span className="account-label">Loja cadastrada</span>
              {merchant.logo ? <img className="store-logo" src={merchant.logo} alt={`Logo de ${merchant.name}`} /> : null}
              <h2>{merchant.name}</h2>
              <p>{merchant.address || 'Endereço comercial não informado.'}</p>
              <StoreLinks website={merchant.website} socialLinks={merchant.socialLinks} />
              <Link
                to={`/produtos?storeId=${encodeURIComponent(merchant.id)}&storeName=${encodeURIComponent(merchant.name)}`}
                className="secondary-btn"
              >
                Explorar produtos
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-cart merchant-empty-state">
          <h2>Ainda não há lojas cadastradas</h2>
          <p>Se você tem uma loja, faça seu cadastro para aparecer neste catálogo.</p>
          <Link to="/cadastro/lojista" className="primary-btn">
            Cadastrar minha loja
          </Link>
        </section>
      )}
    </main>
  );
}
