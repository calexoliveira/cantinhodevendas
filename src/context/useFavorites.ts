import { createContext, useContext } from 'react';
import type { FavoritesContextValue } from './FavoritesContext';

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}
