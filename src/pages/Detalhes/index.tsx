import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { useFavorites } from '../../context/useFavorites';
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
  const stock = product.stock ?? 10;
  const inStock = stock > 0;
  const deliveryDays = product.deliveryDays ?? 3;
  const warrantyMonths = product.warrantyMonths ?? 12;

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
              <span className="community-seller-avatar" aria-hidden="true">{product.storeName ? 'LO' : 'VC'}</span>
              <span>
                <strong>{product.storeName ?? 'Anúncio da comunidade'}</strong>
                <small>Produto de segunda mão · condição: {product.condition}</small>
              </span>
            </div>
          ) : product.storeName ? (
            <div className="detail-community-seller">
              <span className="community-seller-avatar" aria-hidden="true">LO</span>
              <span>
                <strong>{product.storeName}</strong>
                <small>Produto vendido por esta loja</small>
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

          <div className="detail-stock">
            <strong className={inStock ? 'in-stock' : 'out-of-stock'}>
              {inStock ? `${stock} unidades disponíveis` : 'Produto indisponível'}
            </strong>
            {product.sku ? <span>SKU: {product.sku}</span> : null}
            {product.brand ? <span>Marca: {product.brand}</span> : null}
            {product.soldCount ? <span>{product.soldCount}+ vendidos</span> : null}
          </div>

          <div className="detail-marketplace-info">
            <span><strong>Loja</strong>{product.storeName ?? 'Cantinho de Vendas'}</span>
            <span><strong>Condição</strong>{product.condition ?? 'Novo'}</span>
            <span><strong>Estoque</strong>{stock}</span>
          </div>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => addItem(product)} disabled={!inStock}>
              {inStock ? 'Adicionar ao carrinho' : 'Sem estoque'}
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
                  <span>{product.freeShipping ? 'Frete grátis · ' : ''}Em até {deliveryDays} dias úteis</span>
                </div>
                <div>
                  <strong>Garantia</strong>
                  <span>{warrantyMonths} meses de garantia</span>
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
