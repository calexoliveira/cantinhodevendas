import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { useFavorites } from '../../context/FavoritesContext';

export function Favoritos() {
  const { favorites } = useFavorites();

  return (
    <main className="page-shell favorites-page">
      <header className="page-header">
        <h1>Meus favoritos</h1>
        <p>Itens salvos para comprar depois. Você pode revisitar, comparar e adicionar qualquer produto ao carrinho.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="empty-cart-shell">
          <div className="empty-cart">
            <h1>Você ainda não favoritou nada</h1>
            <p>Explore o catálogo e salve os produtos que você mais gosta.</p>
            <Link to="/produtos" className="primary-btn">
              Explorar catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="favorites-grid product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
