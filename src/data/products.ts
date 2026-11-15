import camisaBasica from '../image/tshirt.png';
import calcaJeans from '../image/skinny.png';
import camisaEstampada from '../image/shirt.png';
import jaqueta from '../image/tshirt sleeve.png';
import bermuda from '../image/loose_fit.png';
import tenis from '../image/courage.png';
import bolsa from '../image/striped_shirt.png';
import relogio from '../image/faded.png';
import heroImage from '../image/background_imagem.png';

export type Product = {
  id: number;
  name: string;
  category: 'Roupas' | 'Acessórios' | 'Calçados' | 'Eletrônicos';
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  featured?: boolean;
  description: string;
};

export const heroVisual = heroImage;

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Camiseta Premium Essentials',
    category: 'Roupas',
    price: 129,
    originalPrice: 179,
    rating: 4.9,
    reviews: 204,
    image: camisaBasica,
    badge: 'Mais vendido',
    featured: true,
    description: 'Malha premium, corte casual e ótimo caimento para qualquer dia.',
  },
  {
    id: 2,
    name: 'Calça Skinny Plus',
    category: 'Roupas',
    price: 219,
    originalPrice: 269,
    rating: 4.7,
    reviews: 148,
    image: calcaJeans,
    badge: 'Novidade',
    featured: true,
    description: 'Modelagem ajustada com tecido macio, respirável e confortável.',
  },
  {
    id: 3,
    name: 'Camisa Social Urbana',
    category: 'Roupas',
    price: 189,
    rating: 4.8,
    reviews: 96,
    image: camisaEstampada,
    featured: true,
    description: 'Versátil para reuniões, festas e compromissos diários.',
  },
  {
    id: 4,
    name: 'Jaqueta de Lona',
    category: 'Roupas',
    price: 249,
    originalPrice: 299,
    rating: 4.6,
    reviews: 132,
    image: jaqueta,
    badge: 'Oferta',
    description: 'Proteção leve, acabamento refinado e estilo que combina com tudo.',
  },
  {
    id: 5,
    name: 'Bermuda Relax',
    category: 'Roupas',
    price: 139,
    rating: 4.5,
    reviews: 87,
    image: bermuda,
    description: 'Corte solto para movimentos livres e uso no dia a dia.',
  },
  {
    id: 6,
    name: 'Tênis Street Run',
    category: 'Calçados',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviews: 460,
    image: tenis,
    badge: 'Top review',
    featured: true,
    description: 'Amortecimento leve com visual esportivo e moderno.',
  },
  {
    id: 7,
    name: 'Bolsa Crossbody',
    category: 'Acessórios',
    price: 169,
    rating: 4.7,
    reviews: 118,
    image: bolsa,
    featured: true,
    description: 'Acessório funcional com acabamento premium para fora do dia.',
  },
  {
    id: 8,
    name: 'Relógio Smart Pulse',
    category: 'Eletrônicos',
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviews: 310,
    image: relogio,
    badge: 'Trending',
    description: 'Monitoramento e tecnologia em um relógio elegante e prático.',
  },
];

const PRODUCTS_STORAGE_KEY = 'minhaloja.products';

export const categories = ['Todos', 'Roupas', 'Calçados', 'Acessórios', 'Eletrônicos'];

export function getCatalogProducts(): Product[] {
  if (typeof window === 'undefined') {
    return defaultProducts;
  }

  const storedValue = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  try {
    const storedProducts = JSON.parse(storedValue) as Product[];
    const defaultProductsById = new Map(defaultProducts.map((product) => [product.id, product]));
    const productsWithCurrentImages = storedProducts.map((product) => {
      const defaultProduct = defaultProductsById.get(product.id);
      return defaultProduct ? { ...product, image: defaultProduct.image } : product;
    });

    if (productsWithCurrentImages.some((product, index) => product.image !== storedProducts[index].image)) {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsWithCurrentImages));
    }

    return productsWithCurrentImages;
  } catch {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
}

export function persistCatalogProducts(products: Product[]) {
  if (typeof window === 'undefined') {
    return products;
  }

  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  return products;
}

export function addProductToCatalog(product: Product) {
  const currentProducts = getCatalogProducts();
  const nextProducts = [product, ...currentProducts];
  return persistCatalogProducts(nextProducts);
}

export const products = getCatalogProducts();
