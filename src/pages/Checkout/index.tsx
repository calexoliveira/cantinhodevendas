import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [completed, setCompleted] = useState(false);

  if (items.length === 0 && !completed) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Seu carrinho está vazio</h1>
          <p>Antes de finalizar, adicione itens ao carrinho.</p>
          <Link to="/produtos" className="primary-btn">
            Ver produtos
          </Link>
        </div>
      </main>
    );
  }

  if (completed) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Pedido confirmado!</h1>
          <p>Seu pedido foi registrado com sucesso. Em breve você receberá o status por e-mail.</p>
          <Link to="/produtos" className="primary-btn" onClick={clearCart}>
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell checkout-page">
      <header className="page-header">
        <h1>Finalizar pedido</h1>
        <p>Complete seus dados para confirmar a entrega.</p>
      </header>

      <div className="checkout-layout">
        <section className="checkout-form-card">
          <h2>Dados de entrega</h2>

          <form
            className="checkout-form"
            onSubmit={(event) => {
              event.preventDefault();
              setCompleted(true);
            }}
          >
            <div className="two-column">
              <label>
                Nome
                <input type="text" placeholder="Seu nome" required />
              </label>

              <label>
                Sobrenome
                <input type="text" placeholder="Seu sobrenome" required />
              </label>
            </div>

            <label>
              E-mail
              <input type="email" placeholder="voce@email.com" required />
            </label>

            <label>
              Endereço
              <input type="text" placeholder="Rua, número, bairro" required />
            </label>

            <div className="two-column">
              <label>
                Cidade
                <input type="text" placeholder="São Paulo" required />
              </label>

              <label>
                CEP
                <input type="text" placeholder="01000-000" required />
              </label>
            </div>

            <label>
              Método de pagamento
              <select defaultValue="cartao">
                <option value="cartao">Cartão de crédito</option>
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
            </label>

            <button type="submit" className="primary-btn checkout-submit">
              Confirmar pedido
            </button>
          </form>
        </section>

        <aside className="checkout-summary">
          <h2>Resumo</h2>

          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.name}</span>
              <strong>R$ {item.price * item.quantity}</strong>
            </div>
          ))}

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
        </aside>
      </div>
    </main>
  );
}
