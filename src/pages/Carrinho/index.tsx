import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';

export function Carrinho() {
  const {
    items,
    savedItems,
    subtotal,
    shipping,
    total,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    clearCart,
    clearSavedItems,
    freeShippingThreshold,
  } = useCart();

  const isCartEmpty = items.length === 0;
  const isSavedEmpty = savedItems.length === 0;

  if (isCartEmpty && isSavedEmpty) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Seu carrinho está vazio</h1>
          <p>Adicione alguns produtos e continue sua compra com mais praticidade.</p>
          <Link to="/produtos" className="primary-btn">
            Explorar produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell cart-page">
      <header className="page-header">
        <h1>Carrinho</h1>
        <p>Revise seus itens, salve para depois e finalize sua compra em poucos passos.</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items-column">
          <div className="cart-stack">
            <h2>Itens no carrinho</h2>
            {isCartEmpty ? (
              <div className="mini-empty-state">
                <p>Seu carrinho está vazio no momento.</p>
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <div>
                      <span className="cart-item-category">{item.category}</span>
                      <h3>{item.name}</h3>
                    </div>

                    <div className="cart-item-meta">
                      <div className="quantity-box">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>

                      <strong>R$ {Number(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button type="button" className="secondary-btn compact-btn" onClick={() => saveForLater(item.id)}>
                      Salvar
                    </button>
                    <button type="button" className="remove-item" onClick={() => removeItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {!isSavedEmpty ? (
            <div className="cart-stack saved-stack">
              <h2>Salvos para depois</h2>
              {savedItems.map((item) => (
                <article key={item.id} className="saved-item-card">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                    <small>R$ {Number(item.price).toFixed(2)}</small>
                  </div>
                  <div className="saved-actions">
                    <button type="button" className="secondary-btn compact-btn" onClick={() => moveToCart(item.id)}>
                      Trazer para o carrinho
                    </button>
                    <button type="button" className="remove-item" onClick={() => removeSavedItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </article>
              ))}
              <button type="button" className="text-btn" onClick={clearSavedItems}>
                Limpar salvos
              </button>
            </div>
          ) : null}
        </section>

        <aside className="checkout-panel">
          <h3>Resumo do pedido</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>R$ {Number(subtotal).toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Entrega</span>
            <strong>
              {shipping === 0 ? 'Grátis' : `R$ ${Number(shipping).toFixed(2)}`}
            </strong>
          </div>
          <div className="summary-row">
            <span>Frete grátis</span>
            <strong>{subtotal >= freeShippingThreshold ? 'Liberado' : `${Number(freeShippingThreshold - subtotal).toFixed(2)} faltando`}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>R$ {Number(total).toFixed(2)}</strong>
          </div>

          <Link to="/checkout" className="primary-btn checkout-btn">
            Finalizar compra
          </Link>

          <button type="button" className="secondary-btn" onClick={clearCart}>
            Limpar carrinho
          </button>
        </aside>
      </div>
    </main>
  );
}
