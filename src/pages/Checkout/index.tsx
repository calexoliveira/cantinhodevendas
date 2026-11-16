import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addOrder } from '../../data/orders';

export function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [cardNumber, setCardNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState('');
  const [formValues, setFormValues] = useState({
    name: user?.name ?? '',
    lastName: '',
    email: user?.email ?? '',
    address: user?.address ?? '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      name: user.name || current.name,
      email: user.email || current.email,
      address: user.address || current.address,
    }));
  }, [user]);

  const hasValidCoupon =
    promoFeedback === 'Cupom aplicado com sucesso!' &&
    ['minhaloja', 'primeiracompra'].includes(promoCode.trim().toLowerCase());
  const discount = hasValidCoupon ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(total - discount, 0);

  const applyCoupon = () => {
    const normalizedCoupon = promoCode.trim().toLowerCase();

    if (!normalizedCoupon) {
      setPromoFeedback('Digite um código antes de aplicar.');
      return;
    }

    if (normalizedCoupon === 'minhaloja' || normalizedCoupon === 'primeiracompra') {
      setPromoFeedback('Cupom aplicado com sucesso!');
      return;
    }

    setPromoFeedback('Cupom inválido. Tente: MINHALOJA');
  };

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
        <div className="success-order-box">
          <div className="success-order-badge">✔ Pedido confirmado</div>
          <h1>Seu pedido foi registrado com sucesso!</h1>
          <p>
            Pedido <strong>{confirmedOrderId}</strong> está sendo processado e você pode acompanhar o status em qualquer
            momento.
          </p>

          <div className="success-order-actions">
            <Link to={`/pedidos/${confirmedOrderId}`} className="primary-btn">
              Ver detalhes do pedido
            </Link>
            <Link to="/produtos" className="secondary-btn" onClick={clearCart}>
              Continuar comprando
            </Link>
          </div>
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

              const orderId = `pedido-${Date.now()}`;
              const order = {
                id: orderId,
                date: new Date().toISOString(),
                total: Number(finalTotal.toFixed(2)),
                itemCount: items.reduce((count, item) => count + item.quantity, 0),
                status: 'Em processamento' as const,
                items: items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  category: item.category,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                })),
              };

              addOrder(order);
              clearCart();
              setCardNumber('');
              setConfirmedOrderId(orderId);
              setCompleted(true);
            }}
          >
            <div className="two-column">
              <label>
                Nome
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={formValues.name}
                  onChange={(event) => setFormValues((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>

              <label>
                Sobrenome
                <input
                  type="text"
                  placeholder="Seu sobrenome"
                  value={formValues.lastName}
                  onChange={(event) => setFormValues((current) => ({ ...current, lastName: event.target.value }))}
                  required
                />
              </label>
            </div>

            <label>
              E-mail
              <input
                type="email"
                placeholder="voce@email.com"
                value={formValues.email}
                onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>

            <label>
              Endereço
              <input
                type="text"
                placeholder="Rua, número, bairro"
                value={formValues.address}
                onChange={(event) => setFormValues((current) => ({ ...current, address: event.target.value }))}
                required
              />
            </label>

            <div className="two-column">
              <label>
                Cidade
                <input
                  type="text"
                  placeholder="São Paulo"
                  value={formValues.city}
                  onChange={(event) => setFormValues((current) => ({ ...current, city: event.target.value }))}
                  required
                />
              </label>

              <label>
                CEP
                <input
                  type="text"
                  placeholder="01000-000"
                  value={formValues.zipCode}
                  onChange={(event) => setFormValues((current) => ({ ...current, zipCode: event.target.value }))}
                  required
                />
              </label>
            </div>

            <label>
              Método de pagamento
              <select
                value={paymentMethod}
                onChange={(event) => {
                  setPaymentMethod(event.target.value);
                  if (event.target.value !== 'cartao') {
                    setCardNumber('');
                  }
                }}
              >
                <option value="cartao">Cartão de crédito</option>
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
            </label>

            {paymentMethod === 'cartao' ? (
              <label>
                Número do cartão
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000000000000000"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, '').slice(0, 19))}
                  minLength={13}
                  maxLength={19}
                  required
                />
              </label>
            ) : null}

            <div className="coupon-row">
              <label>
                Cupom de desconto
                <input
                  type="text"
                  placeholder="MINHALOJA"
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                />
              </label>
              <button type="button" className="secondary-btn compact-btn" onClick={applyCoupon}>
                Aplicar
              </button>
            </div>
            {promoFeedback ? <p className="checkout-feedback">{promoFeedback}</p> : null}

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
          {discount > 0 ? (
            <div className="summary-row discount-row">
              <span>Desconto</span>
              <strong>-R$ {discount.toFixed(2)}</strong>
            </div>
          ) : null}
          <div className="summary-row total">
            <span>Total</span>
            <strong>R$ {finalTotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
