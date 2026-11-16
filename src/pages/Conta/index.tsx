import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

export function Conta() {
  const { user, logout, updateAddress } = useAuth();
  const { favorites } = useFavorites();
  const [address, setAddress] = useState(user?.address ?? '');
  const [addressSaved, setAddressSaved] = useState(false);

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
          <form
            className="account-address-form"
            onSubmit={(event) => {
              event.preventDefault();
              updateAddress(address);
              setAddressSaved(true);
            }}
          >
            <label htmlFor="delivery-address">Endereço de entrega</label>
            <textarea
              id="delivery-address"
              rows={3}
              autoComplete="street-address"
              placeholder="Rua, número, bairro, cidade e CEP"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setAddressSaved(false);
              }}
            />
            <button type="submit" className="primary-btn">
              Salvar endereço
            </button>
            {addressSaved ? <p className="account-feedback" role="status">Endereço salvo.</p> : null}
          </form>
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
          <div className="account-actions">
            <Link to="/favoritos" className="secondary-btn account-link">
              Ver favoritos
            </Link>
            <Link to="/pedidos" className="secondary-btn account-link">
              Ver pedidos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
