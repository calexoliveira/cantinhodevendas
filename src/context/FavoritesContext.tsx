import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';

type FavoritesContextValue = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
};

const STORAGE_KEY = 'minhaloja.favorites';

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

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

  const toggleFavorite = (product: Product) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === product.id);
      const nextFavorites = exists ? current.filter((item) => item.id !== product.id) : [...current, product];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  };

  const isFavorite = (productId: number) => favorites.some((item) => item.id === productId);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}
