import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest, errorMessage } from '../api';
import { demoProductImages, type Product } from '../data/products';
import { CatalogContext, type CatalogContextValue } from './useCatalog';

type NullableProductField = 'originalPrice' | 'badge' | 'condition' | 'storeId' | 'storeName' | 'sku' | 'brand';
type ApiProduct = Omit<Product, NullableProductField> & {
  [K in NullableProductField]: Product[K] | null;
};

function normalizeProduct(product: ApiProduct): Product {
  const image = product.image.startsWith('demo:') ? demoProductImages[product.image] : product.image;
  if (!image) throw new Error(`Imagem de demonstração desconhecida: ${product.image}`);
  return {
    ...product,
    image,
    originalPrice: product.originalPrice ?? undefined,
    badge: product.badge ?? undefined,
    condition: product.condition ?? undefined,
    storeId: product.storeId ?? undefined,
    storeName: product.storeName ?? undefined,
    sku: product.sku ?? undefined,
    brand: product.brand ?? undefined,
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setError('');
    apiRequest<ApiProduct[]>('/products')
      .then((items) => {
        if (active) setProducts(items.map(normalizeProduct));
      })
      .catch((reason: unknown) => {
        if (active) setError(errorMessage(reason));
      });
    return () => { active = false; };
  }, [attempt]);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'storeName' | 'soldCount'>) => {
    const created = normalizeProduct(await apiRequest<ApiProduct>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }));
    setProducts((current) => current ? [created, ...current] : [created]);
  }, []);

  const removeProduct = useCallback(async (id: number) => {
    await apiRequest<void>(`/products/${id}`, { method: 'DELETE' });
    setProducts((current) => current?.filter((product) => product.id !== id) ?? null);
  }, []);

  const value = useMemo<CatalogContextValue>(
    () => ({ products: products ?? [], addProduct, removeProduct }),
    [products, addProduct, removeProduct],
  );

  if (error) {
    return <main className="page-shell"><p role="alert">{error}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Tentar novamente</button></main>;
  }
  if (!products) return <main className="page-shell"><p>Carregando catálogo...</p></main>;
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
