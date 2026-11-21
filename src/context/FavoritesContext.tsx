import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';
import { FavoritesContext } from './useFavorites';

export type FavoritesContextValue = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
};

const STORAGE_KEY = 'minhaloja.favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === product.id);
      const nextFavorites = exists ? current.filter((item) => item.id !== product.id) : [...current, product];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: number) => favorites.some((item) => item.id === productId),
    [favorites],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
