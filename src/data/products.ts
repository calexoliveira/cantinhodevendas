import camisaBasica from '../image/tshirt.png';
import calcaJeans from '../image/skinny.png';
import camisaEstampada from '../image/shirt.png';
import jaqueta from '../image/tshirt sleeve.png';
import bermuda from '../image/loose_fit.png';
import tenis from '../image/Tênis Street Run.png';
import bolsa from '../image/Bolsa_Crossbody.png';
import relogio from '../image/relogio.png';
import heroImage from '../image/marketplace.jpg';
import computador from '../image/computador.png';
import { productCategories, type ProductCategory } from '../../shared/categories';

export { parseProductCategory, productCategories } from '../../shared/categories';
export type { ProductCategory } from '../../shared/categories';

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  featured?: boolean;
  condition?: 'novo' | 'seminovo' | 'usado' | 'recondicionado';
  isBazaar?: boolean;
  description: string;
  storeId?: string;
  storeName?: string;
  stock?: number;
  sku?: string;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  gtin?: string;
  weightKg?: number;
  packageLengthCm?: number;
  packageWidthCm?: number;
  packageHeightCm?: number;
  discountPercent?: number;
  warrantyMonths?: number;
  deliveryDays?: number;
  freeShipping?: boolean;
  soldCount?: number;
};

export type NewProduct = Omit<Product, 'id' | 'storeName' | 'soldCount' | 'isBazaar'>;

export const heroVisual = heroImage;

export const categoryImages = {
  Roupas: camisaBasica,
  'Calçados': tenis,
  'Acessórios': bolsa,
  'Eletrônicos': computador,
} satisfies Partial<Record<ProductCategory, string>>;

export const categories = ['Todos', ...productCategories];
export const collectionImages = [camisaBasica, tenis, camisaEstampada];
export const demoProductImages: Record<string, string> = {
  'demo:1': camisaBasica,
  'demo:2': calcaJeans,
  'demo:3': camisaEstampada,
  'demo:4': jaqueta,
  'demo:5': bermuda,
  'demo:6': tenis,
  'demo:7': bolsa,
  'demo:8': relogio,
  'demo:9': jaqueta,
  'demo:10': bolsa,
  'demo:11': computador,
};
