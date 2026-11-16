import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { categoryImages, heroVisual, products } from '../../data/products';

const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

const usedProducts = products.filter((product) => product.condition).slice(0, 3);

const curatedCollections = [
  {
    title: 'Essentials Premium',
    description: 'Peças fundamentais com corte impecável para o dia a dia.',
    image: products[0].image,
  },
  {
    title: 'Street Edit',
    description: 'Visual urbano, conforto e versatilidade em um só look.',
    image: products[5].image,
  },
  {
    title: 'Work & Travel',
    description: 'Estilo sofisticado para reuniões, viagens e rotina intensa.',
    image: products[2].image,
  },
];

export function Home() {
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setNewsletterMessage('Informe um e-mail para receber as ofertas.');
      return;
    }

    setNewsletterMessage('E-mail cadastrado com sucesso! Você receberá ofertas exclusivas em breve.');
    setEmail('');
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
         <span className="eyebrow">Novidades da semana</span>
         <h1>Encontre peças que refletem seu estilo.</h1>
         <p>
           Explore uma seleção premium de roupas, acessórios e tecnologia para aproveitar cada
           momento do seu dia com conforto e presença.
         </p>

         <div className="hero-actions">
           <Link to="/produtos" className="primary-btn">
             Ver catálogo
           </Link>
           <Link to="/login" className="secondary-btn">
             Entrar
           </Link>
         </div>

         <div className="metrics">
           <div>
             <strong>200+</strong>
             <span>Marcas</span>
           </div>
           <div>
             <strong>2k+</strong>
             <span>Produtos</span>
           </div>
           <div>
             <strong>30k+</strong>
             <span>Clientes</span>
           </div>
         </div>
        </div>

        <div className="hero-visual">
         <img src={heroVisual} alt="Coleção premium da Minhaloja" />
         <div className="hero-badge">
           <strong>R$ 299</strong>
           <span>Kit de estreia</span>
         </div>
        </div>
      </section>

      <div className="brand-strip">
        <span>Versace</span>
        <span>Zara</span>
        <span>Gucci</span>
        <span>Prada</span>
        <span>Calvin Klein</span>
      </div>

      <section className="section">
        <div className="section-header">
         <h2>Produtos em destaque</h2>
         <Link to="/produtos">Ver todos</Link>
        </div>

        <div className="product-grid">
         {featuredProducts.map((product) => (
           <ProductCard key={product.id} product={product} />
         ))}
        </div>
      </section>

      <section className="section bazar-section">
        <div className="section-header bazar-header">
          <div>
            <span className="eyebrow bazar-eyebrow">Bazar Colaborativo</span>
            <h2>Boas descobertas merecem uma segunda vida.</h2>
          </div>
          <Link to="/produtos?condition=used">Ver bazar</Link>
        </div>

        <div className="bazar-story">
          <div className="bazar-story-copy">
            <p>
              Um espaço para encontrar peças de segunda mão anunciadas pela comunidade. Cada compra
              ajuda a prolongar a vida dos produtos e incentiva escolhas mais conscientes.
            </p>
            <div className="bazar-values">
              <div>
                <span aria-hidden="true">↻</span>
                <strong>Reaproveitar</strong>
                <small>Mais tempo de uso para cada peça.</small>
              </div>
              <div>
                <span aria-hidden="true">♡</span>
                <strong>Compartilhar</strong>
                <small>Achados de pessoas da comunidade.</small>
              </div>
              <div>
                <span aria-hidden="true">◇</span>
                <strong>Escolher bem</strong>
                <small>Condição indicada em cada anúncio.</small>
              </div>
            </div>
          </div>
          <div className="bazar-story-note">
            <span className="bazar-note-mark" aria-hidden="true">♻</span>
            <strong>Seu próximo favorito já pode ter uma história.</strong>
            <Link to="/produtos?condition=used">Explorar peças selecionadas <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="product-grid bazar-grid">
          {usedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
         <h2>Explore por categoria</h2>
        </div>

        <div className="categories-grid">
         {Object.entries(categoryImages).map(([category, image]) => (
           <Link key={category} to="/produtos" className="category-card">
             <img src={image} alt={category} />
             <div>
               <strong>{category}</strong>
               <span>→</span>
             </div>
           </Link>
         ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
         <h2>Coleções escolhidas para o seu momento</h2>
        </div>

        <div className="collection-grid">
         {curatedCollections.map((collection) => (
           <article key={collection.title} className="collection-card">
             <img src={collection.image} alt={collection.title} />
             <div className="collection-copy">
               <span>Curadoria Minhaloja</span>
               <h3>{collection.title}</h3>
               <p>{collection.description}</p>
               <Link to="/produtos">Explorar coleção</Link>
             </div>
           </article>
         ))}
        </div>
      </section>

      <section className="section">
        <div className="feature-panel">
         <div>
           <h3>Uma experiência de compra pensada para você.</h3>
           <p>
             Qualidade premium, atendimento ágil e entrega confiável em todo o país. A Minhaloja
             combina moda, tecnologia e conveniência em um só lugar.
           </p>
           <div className="feature-points">
             <div className="feature-point">
               <span className="bullet">✓</span>
               <div>
                 <strong>Entrega rápida</strong>
                 <p>Seu pedido chega em poucos dias com rastreio em tempo real.</p>
               </div>
             </div>
             <div className="feature-point">
               <span className="bullet">✓</span>
               <div>
                 <strong>Produtos verificados</strong>
                 <p>Curadoria exclusiva para itens que unem estilo, conforto e qualidade.</p>
               </div>
             </div>
           </div>
         </div>

         <div className="hero-visual" style={{ minHeight: 360 }}>
           <img src={products[5].image} alt="Tênis premium" />
         </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
         <h2>Depoimentos</h2>
        </div>

        <div className="testimonial-grid">
         {[
           {
             name: 'Sarah M.',
             quote: 'A qualidade dos produtos supera muito o que eu esperava. O atendimento foi excelente.',
           },
           {
             name: 'Alex K.',
             quote: 'Encontrei peças que combinam conforto e estilo para o meu dia a dia com facilidade.',
           },
           {
             name: 'Julia P.',
             quote: 'A compra foi prática, o frete rápido e o produto chegou em perfeito estado.',
           },
         ].map((review) => (
           <article key={review.name} className="testimonial-card">
             <div className="stars">★★★★★</div>
             <h4>{review.name}</h4>
             <p>“{review.quote}”</p>
           </article>
         ))}
        </div>
      </section>

      <section className="section">
        <div className="newsletter">
         <h3>Receba ofertas exclusivas.</h3>
         <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
           <input
             type="email"
             placeholder="Seu melhor e-mail"
             value={email}
             onChange={(event) => setEmail(event.target.value)}
             aria-label="E-mail para receber ofertas"
           />
           <button type="submit" className="primary-btn">
             Assinar
           </button>
         </form>
        </div>
        {newsletterMessage ? <p className="newsletter-feedback">{newsletterMessage}</p> : null}
      </section>
    </main>
  );
}
