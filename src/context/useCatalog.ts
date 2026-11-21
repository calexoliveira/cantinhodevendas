import { createContext, useContext } from 'react';
import type { Product } from '../data/products';

export type CatalogContextValue = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'storeName' | 'soldCount'>) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
};

export const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
}
