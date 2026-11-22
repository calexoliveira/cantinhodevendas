# Cantinho de Vendas

Cantinho de Vendas é uma vitrine de e-commerce fictícia desenvolvida com React + TypeScript e uma API Node.js com PostgreSQL. O projeto simula um marketplace com catálogo, autenticação, carrinho, checkout, favoritos e painel administrativo.

## Visão geral

A proposta do projeto é demonstrar uma experiência de compra realista para um marketplace de moda e lifestyle, com foco em:

- apresentação premium para conversão
- navegação simples e eficiente
- experiência de compra guiada
- contas de cliente, lojista e administrador
- fluxo completo de catálogo até checkout

## Funcionalidades principais

- Landing page premium com hero, destaques, seções de categoria e depoimentos
- Catálogo completo com seletor de categorias e ordenação por relevância/preço
- Busca funcional por produtos
- Página de detalhes do produto
- Sistema de favoritos com persistência local
- Carrinho com atualização de quantidade e valor total
- Fluxo de checkout com resumo do pedido
- Autenticação por sessão para clientes, lojistas e administradores
- Página de conta do cliente
- Área administrativa para cadastrar novos produtos
- Tema claro e escuro com refinamento visual final

## Stack

- React
- TypeScript
- Vite
- React Router
- CSS moderno com design system próprio
- Node.js, Express e PostgreSQL

## Como executar localmente

É necessário ter Node.js 20 (a partir da versão 20.19), 22 (a partir da 22.13) ou 24 e posteriores, além de um banco PostgreSQL dedicado ao projeto. Crie o banco e um usuário com permissão para criar tabelas. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` com os dados de conexão locais. Nunca compartilhe ou versione esse arquivo.

```bash
npm install
npm run db:migrate
npm run db:seed
```

Em dois terminais separados, execute:

```bash
npm run api:dev
```

```bash
npm run dev
```

O frontend usa a porta 4173 e encaminha `/api` para a API na porta 3001. Se mudar `PORT` no `.env`, ajuste também `API_PROXY_TARGET` para a URL local correspondente. A API precisa estar disponível para carregar contas, lojas e catálogo.

As migrações em `server/migrations` são aplicadas uma vez, em ordem de nome. Para mudanças futuras no banco, adicione uma nova migração numerada; não altere as já aplicadas. O seed insere a loja e os produtos de demonstração; execute-o com a API parada.

No cadastro e no painel do lojista, é possível informar um logo (PNG, JPEG, WebP ou GIF de até 256 KB), site e até 10 links de redes sociais. Essas informações são opcionais e aparecem no catálogo de lojistas.

No cadastro de produtos, envie uma imagem (PNG, JPEG, WebP ou GIF de até 2 MB), informe o preço antes do desconto percentual e selecione a condição. Para produtos novos é obrigatório um código universal válido (GTIN-8, GTIN-12, GTIN-13 ou GTIN-14). Marca, modelo, cor, tamanho, peso e dimensões da embalagem são opcionais.

Serviços publicados são armazenados no PostgreSQL e exibidos no catálogo público com nome, cidade, telefone e até 10 links opcionais de redes sociais; CPF e CNPJ não são exibidos. Administradores podem editar os links dos serviços no painel administrativo. Serviços antigos salvos apenas no navegador podem ser importados manualmente na página de serviços, após confirmação; os dados locais não são apagados.

### Criar um administrador local

Não há credenciais de administrador predefinidas no banco. No PowerShell, defina o nome e o e-mail desejados e informe a senha sem exibi-la:

```powershell
$env:ADMIN_NAME = 'Nome do administrador'
$env:ADMIN_EMAIL = 'admin@exemplo.com'
$senha = Read-Host 'Senha do administrador' -AsSecureString
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $senha).Password
npm run db:create-admin
Remove-Item Env:\ADMIN_PASSWORD, Env:\ADMIN_NAME, Env:\ADMIN_EMAIL
Remove-Variable senha
```

A senha deve ter pelo menos oito caracteres e não ultrapassar 72 bytes. Clientes e lojistas podem criar suas contas pelas telas de cadastro.

## Scripts

- `npm run dev` — inicia o ambiente em desenvolvimento
- `npm run api:dev` — inicia a API local
- `npm run db:migrate` — aplica migrações pendentes
- `npm run db:seed` — insere dados de demonstração
- `npm run db:create-admin` — cria um administrador com variáveis de ambiente
- `npm run build` — verifica os tipos e gera a versão de produção do frontend
- `npm run lint` — verifica o código
- `npm run api:test` — executa testes de integração; requer `TEST_DATABASE_URL` para um banco de teste
- `npm run preview` — visualiza a build localmente

Os testes da API criam e removem um esquema temporário no banco indicado por `TEST_DATABASE_URL`; use um banco dedicado a testes.

O catálogo de lojistas inclui uma loja de demonstração, vinculada aos produtos iniciais.
Ela é apenas uma vitrine e não possui conta de acesso. Produtos cadastrados por lojistas
continuam vinculados às respectivas lojas.

## Estrutura do projeto

- `src/pages/Home` — landing page com hero, coleções e destaques
- `src/pages/Produtos` — catálogo com filtros e busca
- `src/pages/Detalhes` — página de detalhes do produto
- `src/pages/Carrinho` — visão do carrinho
- `src/pages/Checkout` — fluxo de finalização da compra
- `src/pages/Login` — autenticação e cadastro
- `src/pages/Conta` — área da conta do cliente
- `src/pages/Favoritos` — lista de produtos salvos
- `src/pages/Admin` — painel administrativo
- `src/context` — autenticação, carrinho e favoritos
- `src/data/products.ts` — tipos e imagens do catálogo
- `server` — API, migrações e dados iniciais
- `shared` — definições compartilhadas entre frontend e API
- `src/styles.css` — sistema visual completo da aplicação

## Pitch profissional

O Cantinho de Vendas é uma experiência de marketplace premium desenvolvida para demonstrar como uma loja digital moderna pode unir estética, conversão e funcionalidade. O projeto combina uma identidade visual refinada com uma jornada de compra clara e eficiente, abordando os principais elementos de um storefront de alto nível: catálogo, autenticação, carrinho, checkout, gestão de produtos e personalização de experiência.

Esse projeto funciona como uma base sólida para apresentação de portfólio, demonstração de UI/UX e prova de domínio em React, arquitetura de componentes e fluxo de e-commerce front-end.

## Observação

Contas, lojas e produtos novos são persistidos no PostgreSQL. Os dados antigos dessas áreas permanecem no navegador, mas não são migrados nem usados automaticamente pelo backend: é necessário criar novas contas e cadastrar novamente produtos próprios. Carrinho, favoritos, pedidos e serviços continuam armazenados no navegador; o checkout e os pagamentos continuam simulados.

A configuração fornecida é para desenvolvimento local. Antes de publicar o sistema, é necessário preparar a implantação com HTTPS e revisar segurança, privacidade, backups e os demais fluxos ainda simulados.
