import { createContext, useContext } from 'react';
import type { NewProduct, Product } from '../data/products';

export type CatalogContextValue = {
  products: Product[];
  addProduct: (product: NewProduct) => Promise<void>;
  updateProduct: (id: number, product: NewProduct) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
};

export const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
}
