import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getCatalogProducts } from '../../data/products';

export function Detalhes() {
  const { id } = useParams();
  const productId = Number(id);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product = getCatalogProducts().find((item) => item.id === productId);

  if (!product) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Produto não encontrado</h1>
          <p>Não foi possível localizar este item no catálogo.</p>
          <Link to="/produtos" className="primary-btn">
            Voltar ao catálogo
          </Link>
        </div>
      </main>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <main className="page-shell product-detail-page">
      <div className="detail-back-link">
        <Link to="/produtos">← Voltar ao catálogo</Link>
      </div>

      <section className="product-detail-card">
        <div className="product-detail-image-wrap">
          {product.condition ? (
            <span className="detail-condition-badge">Bazar · {product.condition}</span>
          ) : null}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          {product.condition ? (
            <div className="detail-community-seller">
              <span className="community-seller-avatar" aria-hidden="true">VC</span>
              <span>
                <strong>Anúncio da comunidade</strong>
                <small>Produto de segunda mão · condição: {product.condition}</small>
              </span>
            </div>
          ) : null}
          <div className="product-rating">
            <span>★</span>
            <strong>{product.rating}</strong>
            <small>({product.reviews} avaliações)</small>
          </div>

          <div className="product-price-row detail-price-row">
            <span className="product-price">R$ {product.price}</span>
            {product.originalPrice ? (
              <>
                <span className="product-original-price">R$ {product.originalPrice}</span>
                <span className="product-discount">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
              </>
            ) : null}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => addItem(product)}>
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              className={`secondary-btn ${favorite ? 'favorite-active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              {favorite ? '♥ Favoritado' : '♡ Favoritar'}
            </button>
          </div>

          <div className="detail-benefits">
            {product.condition ? (
              <>
                <div>
                  <strong>Origem</strong>
                  <span>Bazar colaborativo</span>
                </div>
                <div>
                  <strong>Condição</strong>
                  <span>{product.condition}</span>
                </div>
                <div>
                  <strong>Pagamento</strong>
                  <span>Cartão, boleto e Pix</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>Entrega</strong>
                  <span>Em até 3 dias úteis</span>
                </div>
                <div>
                  <strong>Garantia</strong>
                  <span>12 meses de suporte</span>
                </div>
                <div>
                  <strong>Pagamento</strong>
                  <span>Cartão, boleto e Pix</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
