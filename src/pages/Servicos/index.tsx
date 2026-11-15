import { Link } from 'react-router-dom';
import './styles.css';

const services = [
  {
    icon: '✦',
    title: 'Ajuda para escolher',
    description:
      'Encontre peças que combinam com seu estilo e sua rotina. Explore o catálogo e compare opções com calma.',
    detail: 'Uma escolha mais fácil',
  },
  {
    icon: '↗',
    title: 'Acompanhamento do pedido',
    description:
      'Consulte as informações de entrega e acompanhe os detalhes do seu pedido durante a compra.',
    detail: 'Mais clareza em cada etapa',
  },
  {
    icon: '↺',
    title: 'Trocas e devoluções',
    description:
      'Precisa solicitar uma troca ou devolução? Confira as condições e orientações aplicáveis ao seu pedido.',
    detail: 'Orientação sem complicação',
  },
  {
    icon: '♡',
    title: 'Suporte ao cliente',
    description:
      'Conte com informações claras para navegar pela loja, finalizar sua compra e consultar seus pedidos.',
    detail: 'A gente ajuda você',
  },
];

export function Servicos() {
  return (
    <main className="page-shell services-page">
      <section className="services-hero">
        <div className="services-hero-copy">
          <span className="eyebrow">Cuidado em cada etapa</span>
          <h1>Uma experiência de compra mais simples, do início ao pós-venda.</h1>
          <p>
            Estamos aqui para ajudar você a escolher, comprar e encontrar as informações de que
            precisa sobre seu pedido.
          </p>
          <Link to="/produtos" className="primary-btn">
            Explorar produtos <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="services-hero-note">
          <span className="services-note-icon" aria-hidden="true">✦</span>
          <p>Seu estilo, suas escolhas e uma loja pronta para acompanhar você.</p>
          <span className="services-note-caption">MINHALOJA · SERVIÇOS</span>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-title">
        <div className="services-section-heading">
          <span className="eyebrow">Como podemos ajudar</span>
          <h2 id="services-title">Serviços pensados para você</h2>
          <p>Veja como podemos tornar sua experiência na loja mais tranquila.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <div className="service-card-top">
                <span className="service-icon" aria-hidden="true">{service.icon}</span>
                <span className="service-number">0{index + 1}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-detail">{service.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="services-guidance">
        <div className="services-guidance-mark" aria-hidden="true">i</div>
        <div>
          <h2>Informações importantes</h2>
          <p>
            Prazos, custos de entrega e condições para trocas ou devoluções podem variar conforme
            o pedido. Consulte os detalhes disponíveis durante a compra e antes de concluir sua
            solicitação.
          </p>
        </div>
        <Link to="/carrinho" className="secondary-btn">
          Ver meu carrinho
        </Link>
      </section>

      <section className="services-cta">
        <span className="eyebrow">Pronto para encontrar seu próximo favorito?</span>
        <h2>Seu próximo look começa por aqui.</h2>
        <p>Descubra a seleção da Minhaloja e escolha o que combina com você.</p>
        <Link to="/produtos" className="primary-btn">
          Ver catálogo <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
