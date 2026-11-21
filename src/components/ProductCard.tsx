import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import type { Product } from '../data/products';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  return (
    <article className={`product-card${product.condition ? ' bazar-product-card' : ''}`}>
      <div className="product-image-wrap">
        {product.condition ? (
          <>
            <span className="product-badge bazar-product-badge">Bazar</span>
            <span className="product-condition">{product.condition}</span>
          </>
        ) : product.badge ? (
          <span className="product-badge">{product.badge}</span>
        ) : product.storeName ? (
          <div className="community-seller">
            <span className="community-seller-avatar" aria-hidden="true">LO</span>
            <span>
              <strong>{product.storeName}</strong>
              <small>Loja parceira</small>
            </span>
          </div>
        ) : null}
        <button
          type="button"
          className={`favorite-toggle ${favorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(product)}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {favorite ? '♥' : '♡'}
        </button>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-rating">
          <span>★</span>
          <strong>{product.rating}</strong>
          <small>({product.reviews})</small>
        </div>
        {product.condition ? (
          <div className="community-seller">
            <span className="community-seller-avatar" aria-hidden="true">{product.storeName ? 'LO' : 'VC'}</span>
            <span>
              <strong>{product.storeName ?? 'Vendedor da comunidade'}</strong>
              <small>Anúncio do Bazar Colaborativo</small>
            </span>
          </div>
        ) : null}
        <div className="product-price-row">
          <span className="product-price">R$ {product.price}</span>
          {product.originalPrice ? (
            <>
              <span className="product-original-price">R$ {product.originalPrice}</span>
              <span className="product-discount">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
            </>
          ) : null}
        </div>

        <div className="product-actions">
          <Link to={`/produtos/${product.id}`} className="secondary-btn compact-btn">
            Detalhes
          </Link>
          <button type="button" className="primary-btn compact-btn" onClick={() => addItem(product)}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
