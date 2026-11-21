import { Link, useParams } from 'react-router-dom';

type InformationPage = {
  title: string;
  description: string;
  paragraphs: string[];
  actions?: { label: string; to: string }[];
};

const informationPages: Record<string, InformationPage> = {
  sobre: {
    title: 'Sobre o Cantinho de Vendas',
    description: 'Um marketplace para aproximar pessoas, lojas e bons produtos.',
    paragraphs: [
      'O Cantinho de Vendas reúne produtos e serviços em uma experiência simples de busca, descoberta e compra.',
      'Esta versão é um protótipo de frontend. Os cadastros e interações são demonstrativos e ficam salvos localmente no navegador.',
    ],
    actions: [{ label: 'Explorar produtos', to: '/produtos' }, { label: 'Conhecer serviços', to: '/servicos' }],
  },
  recursos: {
    title: 'Recursos do marketplace',
    description: 'Ferramentas para encontrar e organizar o que você procura.',
    paragraphs: [
      'Explore o catálogo por categoria, pesquise produtos, ordene por preço e use os filtros disponíveis.',
      'Você também pode salvar itens nos favoritos, montar um carrinho e consultar produtos e serviços cadastrados.',
    ],
    actions: [{ label: 'Ver catálogo', to: '/produtos' }, { label: 'Ver serviços', to: '/servicos' }],
  },
  'trabalhe-conosco': {
    title: 'Trabalhe conosco',
    description: 'Faça parte do Cantinho de Vendas como lojista ou profissional de serviços.',
    paragraphs: [
      'Nesta versão demonstrativa não há vagas de emprego abertas. Lojistas podem criar uma loja e profissionais podem publicar seus serviços diretamente na plataforma.',
    ],
    actions: [{ label: 'Cadastrar loja', to: '/cadastro/lojista' }, { label: 'Cadastrar serviço', to: '/servicos#cadastrar-servico' }],
  },
  carreiras: {
    title: 'Carreiras',
    description: 'Conheça as oportunidades disponíveis na plataforma.',
    paragraphs: [
      'Ainda não há processos seletivos ativos. Esta página faz parte do protótipo e será atualizada caso novas oportunidades sejam disponibilizadas.',
      'Enquanto isso, lojistas e profissionais podem participar cadastrando seus negócios e serviços.',
    ],
    actions: [{ label: 'Cadastrar loja', to: '/cadastro/lojista' }, { label: 'Conhecer serviços', to: '/servicos' }],
  },
  suporte: {
    title: 'Suporte',
    description: 'Encontre orientações para usar o Cantinho de Vendas.',
    paragraphs: [
      'Para dúvidas sobre produtos, consulte a descrição, a condição e as informações da loja na página de detalhes do item.',
      'Você pode acessar sua conta e seus pedidos pelas opções abaixo. Esta versão demonstrativa ainda não oferece atendimento por chat ou abertura de chamados.',
    ],
    actions: [{ label: 'Acessar minha conta', to: '/conta' }, { label: 'Consultar pedidos', to: '/pedidos' }, { label: 'Ver serviços', to: '/servicos' }],
  },
  entregas: {
    title: 'Entregas',
    description: 'Consulte as informações de envio antes de concluir seu pedido.',
    paragraphs: [
      'Prazo e custo de entrega podem variar conforme o produto e a loja. Quando informado, o prazo estimado aparece nos detalhes do produto.',
      'O acompanhamento de pedidos nesta versão é demonstrativo e não se conecta a serviços de transporte.',
    ],
    actions: [{ label: 'Ver produtos', to: '/produtos' }, { label: 'Consultar pedidos', to: '/pedidos' }],
  },
  termos: {
    title: 'Termos de uso',
    description: 'Informações sobre o uso desta versão do Cantinho de Vendas.',
    paragraphs: [
      'Este site é um protótipo de frontend para demonstração. Não processa compras, pagamentos, entregas ou solicitações reais.',
      'O conteúdo desta página é informativo e não substitui termos de uso oficiais. Não utilize o protótipo para transações reais.',
    ],
  },
  privacidade: {
    title: 'Privacidade',
    description: 'Saiba como os dados são tratados nesta versão demonstrativa.',
    paragraphs: [
      'Esta versão não possui backend. Cadastros, favoritos, carrinho e outras preferências são armazenados localmente no navegador e não são sincronizados entre dispositivos.',
      'Evite informar dados pessoais ou financeiros reais. Os dados locais podem ser removidos ao limpar o armazenamento do navegador.',
    ],
  },
  pagamentos: {
    title: 'Pagamentos',
    description: 'A etapa de pagamento do protótipo é apenas demonstrativa.',
    paragraphs: [
      'O checkout permite visualizar uma simulação do fluxo de compra, mas não realiza cobranças nem envia dados a instituições financeiras.',
      'Não informe números reais de cartão, dados bancários ou outras informações financeiras neste site.',
    ],
    actions: [{ label: 'Voltar ao catálogo', to: '/produtos' }],
  },
  devolucoes: {
    title: 'Trocas e devoluções',
    description: 'Orientações gerais para consultar antes de uma compra.',
    paragraphs: [
      'As condições de troca e devolução podem depender do produto e da loja responsável. Verifique as informações do anúncio e do pedido.',
      'Esta versão não recebe solicitações reais de troca ou devolução. Consulte a área de serviços para orientações demonstrativas.',
    ],
    actions: [{ label: 'Acessar serviços', to: '/servicos' }, { label: 'Consultar pedidos', to: '/pedidos' }],
  },
  blog: {
    title: 'Blog',
    description: 'Ideias para comprar, vender e descobrir produtos com mais confiança.',
    paragraphs: [
      'Antes de escolher, compare as características, o preço e a condição do produto. Nos itens de bazar, confira com atenção a descrição e o estado informado.',
      'Conheça os detalhes do anúncio e as informações da loja antes de adicionar um produto ao carrinho.',
    ],
    actions: [{ label: 'Explorar produtos', to: '/produtos' }],
  },
  guias: {
    title: 'Guias de compra',
    description: 'Use os detalhes do anúncio para fazer uma escolha mais informada.',
    paragraphs: [
      'Confira descrição, marca, condição, disponibilidade em estoque e prazo de entrega. Compare alternativas no catálogo e salve seus favoritos para consultar depois.',
      'Para itens usados ou seminovos, leia a condição e a descrição com cuidado antes de comprar.',
    ],
    actions: [{ label: 'Ver catálogo', to: '/produtos' }, { label: 'Ver favoritos', to: '/favoritos' }],
  },
  dicas: {
    title: 'Dicas',
    description: 'Algumas sugestões para aproveitar melhor o marketplace.',
    paragraphs: [
      'Use a busca e os filtros de categoria e preço para refinar os resultados. A opção “Sem limite” remove o teto de preço.',
      'Confira os dados do produto e da loja, compare opções e revise os itens do carrinho antes de seguir para o checkout demonstrativo.',
    ],
    actions: [{ label: 'Começar a explorar', to: '/produtos' }],
  },
  noticias: {
    title: 'Notícias e novidades',
    description: 'Acompanhe lançamentos, ofertas e novidades do Cantinho de Vendas.',
    paragraphs: [
      'Confira as novidades mais recentes do marketplace: coleções selecionadas, produtos em destaque e oportunidades no Bazar Colaborativo.',
      'Assine a newsletter para receber ofertas exclusivas, lançamentos e conteúdos do Cantinho de Vendas diretamente no seu e-mail.',
    ],
    actions: [{ label: 'Assinar newsletter', to: '/#newsletter' }, { label: 'Ver novidades', to: '/produtos' }],
  },
};

export function Informacoes() {
  const { slug } = useParams();
  const page = slug ? informationPages[slug] : undefined;

  if (!page) {
    return (
      <main className="page-shell empty-cart-shell">
        <section className="empty-cart">
          <h1>Informação não encontrada</h1>
          <p>Não encontramos esta página. Volte ao início ou explore o catálogo.</p>
          <Link to="/" className="primary-btn">Ir para o início</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell information-page">
      <header className="page-header">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>

      <section className="information-card">
        {page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {page.actions?.length ? (
          <div className="information-actions">
            {page.actions.map((action) => (
              <Link key={action.to} to={action.to} className="secondary-btn">{action.label}</Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
