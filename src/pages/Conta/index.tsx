import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

export function Conta() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();

  if (!user) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Faça login para acessar sua conta</h1>
          <p>Entre com seu e-mail e senha para acompanhar pedidos, favoritos e entregas.</p>
          <Link to="/login" className="primary-btn">
            Ir para login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell account-page">
      <header className="page-header">
        <h1>Minha conta</h1>
        <p>Gerencie seu perfil, favoritos e experiência de compra no marketplace.</p>
      </header>

      <div className="account-layout">
        <section className="account-card">
          <span className="account-label">Perfil</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button type="button" className="primary-btn" onClick={logout}>
            Sair da conta
          </button>
        </section>

        <section className="account-card">
          <span className="account-label">Resumo</span>
          <div className="account-stats">
            <div>
              <strong>{favorites.length}</strong>
              <span>Favoritos</span>
            </div>
            <div>
              <strong>{user.isAdmin ? 'Admin' : 'Cliente'}</strong>
              <span>Tipo</span>
            </div>
          </div>
          <Link to="/favoritos" className="secondary-btn account-link">
            Ver favoritos
          </Link>
        </section>
      </div>
    </main>
  );
}
