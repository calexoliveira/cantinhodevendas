# Cantinho de Vendas

Cantinho de Vendas é uma vitrine de e-commerce fictícia desenvolvida com React + TypeScript, com foco em UX premium, conversão e apresentação visual sofisticada. O projeto simula um marketplace moderno com catálogo, autenticação, carrinho, checkout, favoritos e painel administrativo.

## Visão geral

A proposta do projeto é demonstrar uma experiência de compra realista para um marketplace de moda e lifestyle, com foco em:

- apresentação premium para conversão
- navegação simples e eficiente
- experiência de compra guiada
- autenticação simulada de cliente e administrador
- fluxo completo de catálogo até checkout

## Funcionalidades principais

- Landing page premium com hero, destaques, seções de categoria e depoimentos
- Catálogo completo com filtros por categoria e ordenação por relevância/preço
- Busca funcional por produtos
- Página de detalhes do produto
- Sistema de favoritos com persistência local
- Carrinho com atualização de quantidade e valor total
- Fluxo de checkout com resumo do pedido
- Autenticação local para cliente e administradores
- Página de conta do cliente
- Área administrativa para cadastrar novos produtos
- Tema claro e escuro com refinamento visual final

## Stack

- React
- TypeScript
- Vite
- React Router
- CSS moderno com design system próprio

## Como executar

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — inicia o ambiente em desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run preview` — visualiza a build localmente

## Credenciais de demonstração

- Admin: `admin@minhaloja.com` / `admin123`
- Cliente: `cliente@minhaloja.com` / `cliente123`

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
- `src/data/products.ts` — catálogo e dados iniciais do marketplace
- `src/styles.css` — sistema visual completo da aplicação

## Pitch profissional

O Cantinho de Vendas é uma experiência de marketplace premium desenvolvida para demonstrar como uma loja digital moderna pode unir estética, conversão e funcionalidade. O projeto combina uma identidade visual refinada com uma jornada de compra clara e eficiente, abordando os principais elementos de um storefront de alto nível: catálogo, autenticação, carrinho, checkout, gestão de produtos e personalização de experiência.

Esse projeto funciona como uma base sólida para apresentação de portfólio, demonstração de UI/UX e prova de domínio em React, arquitetura de componentes e fluxo de e-commerce front-end.

## Observação

Este projeto é uma simulação de marketplace em front-end. Os dados são persistidos localmente no navegador para demonstrar comportamento realista de uma loja, sem backend ou integração de pagamento real.
