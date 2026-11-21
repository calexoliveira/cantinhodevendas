export const productCategories = [
  'Roupas',
  'Calçados',
  'Acessórios',
  'Eletrônicos',
  'Veículos e acessórios',
  'Supermercado',
  'Tecnologia',
  'Casa e Móveis',
  'Eletrodomésticos',
  'Esportes e Fitness',
  'Ferramentas',
  'Construção',
  'Indústria e Comércio',
  'Pet Shop',
  'Saúde',
  'Beleza e Cuidado Pessoal',
  'Moda',
  'Bebês',
  'Brinquedos',
  'Livros',
  'Imóveis',
  'Internacional',
  'Produtos Sustentáveis',
] as const;

export type ProductCategory = (typeof productCategories)[number];

export function parseProductCategory(value: string): ProductCategory {
  const category = productCategories.find((item) => item === value);
  if (!category) {
    throw new Error(`Invalid product category: ${value}`);
  }
  return category;
}
