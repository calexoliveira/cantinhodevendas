import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function Carrinho() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
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
        <p>Revise seus itens e finalize sua compra em poucos passos.</p>
      </header>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
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

                  <strong>R$ {item.price * item.quantity}</strong>
                </div>
              </div>

              <button type="button" className="remove-item" onClick={() => removeItem(item.id)}>
                Remover
              </button>
            </article>
          ))}
        </section>

        <aside className="checkout-panel">
          <h3>Resumo do pedido</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>R$ {subtotal}</strong>
          </div>
          <div className="summary-row">
            <span>Entrega</span>
            <strong>R$ {shipping}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>R$ {total}</strong>
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
