import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../data/orders';

export function PedidoDetalhes() {
  const { id } = useParams();
  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Pedido não encontrado</h1>
          <p>Não foi possível localizar esse pedido no histórico da sua conta.</p>
          <Link to="/pedidos" className="primary-btn">
            Voltar para pedidos
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 250 ? 0 : 29;

  return (
    <main className="page-shell">
      <header className="page-header order-detail-header">
        <div>
          <span className="order-label">Detalhes do pedido</span>
          <h1>{order.id}</h1>
        </div>
        <Link to="/pedidos" className="secondary-btn">
          Voltar aos pedidos
        </Link>
      </header>

      <section className="order-detail-card">
        <div className="order-detail-grid">
          <div className="detail-panel">
            <div className="detail-row">
              <span>Status</span>
              <strong className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {order.status}
              </strong>
            </div>
            <div className="detail-row">
              <span>Data</span>
              <strong>{new Date(order.date).toLocaleDateString('pt-BR')}</strong>
            </div>
            <div className="detail-row">
              <span>Itens</span>
              <strong>{order.itemCount}</strong>
            </div>
            <div className="detail-row total-row">
              <span>Total</span>
              <strong>R$ {order.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="detail-panel emphasis-panel">
            <h2>Resumo do pedido</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>R$ {subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Entrega</span>
              <strong>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>R$ {order.total.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="order-detail-items">
          <h2>Itens comprados</h2>
          {order.items.map((item) => (
            <div key={`${order.id}-${item.id}`} className="order-item-row detail-item-row">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.category} · {item.quantity} unidade{item.quantity > 1 ? 's' : ''}
                </span>
              </div>
              <strong>R$ {Number(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
