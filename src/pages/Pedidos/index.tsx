import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../data/orders';

export { PedidoDetalhes } from './Detalhes';

export function Pedidos() {
  const { user } = useAuth();
  const orders = getOrders();

  if (!user) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Faça login para ver seus pedidos</h1>
          <p>Você precisa entrar na sua conta para acompanhar o histórico de compras.</p>
          <Link to="/login" className="primary-btn">
            Ir para login
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="page-shell empty-cart-shell">
        <div className="empty-cart">
          <h1>Você ainda não fez nenhuma compra</h1>
          <p>Explore as melhores ofertas da Minhaloja e aproveite seu primeiro pedido.</p>
          <Link to="/produtos" className="primary-btn">
            Explorar catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Meus pedidos</h1>
        <p>Acompanhe o status de cada compra e o histórico recente da sua conta.</p>
      </header>

      <section className="orders-panel">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-label">Pedido</span>
                <h2>{order.id}</h2>
              </div>
              <span className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {order.status}
              </span>
            </div>

            <div className="order-meta">
              <span>{new Date(order.date).toLocaleDateString('pt-BR')}</span>
              <span>{order.itemCount} itens</span>
              <span>Total: R$ {order.total.toFixed(2)}</span>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.id}`} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.category} · {item.quantity}x
                    </span>
                  </div>
                  <strong>R$ {Number(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <Link to={`/pedidos/${order.id}`} className="secondary-btn compact-btn">
                Ver detalhes
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
