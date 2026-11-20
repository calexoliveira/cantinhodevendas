import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Product) => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  removeItem: (productId: number) => void;
  removeSavedItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  clearSavedItems: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
};

const CART_STORAGE_KEY = 'minhaloja.cart';
const SAVED_STORAGE_KEY = 'minhaloja.savedItems';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const readStoredItems = () => {
  if (typeof window === 'undefined') {
    return [] as CartItem[];
  }

  const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!storedItems) {
    return [] as CartItem[];
  }

  try {
    return JSON.parse(storedItems) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
};

const readStoredSavedItems = () => {
  if (typeof window === 'undefined') {
    return [] as CartItem[];
  }

  const storedItems = window.localStorage.getItem(SAVED_STORAGE_KEY);

  if (!storedItems) {
    return [] as CartItem[];
  }

  try {
    return JSON.parse(storedItems) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems());
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => readStoredSavedItems());

  const persistCart = (nextItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    }
    return nextItems;
  };

  const persistSavedItems = (nextSavedItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(nextSavedItems));
    }
    return nextSavedItems;
  };

  const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      const availableStock = product.stock ?? 10;

      if (existingItem) {
        if (existingItem.quantity >= availableStock) {
          return currentItems;
        }
        const nextItems = currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
        return persistCart(nextItems);
      }

      const nextItems = [...currentItems, { ...product, quantity: 1 }];
      return persistCart(nextItems);
    });
  };

  const saveForLater = (productId: number) => {
    setItems((currentItems) => {
      const itemToSave = currentItems.find((item) => item.id === productId);
      if (!itemToSave) {
        return currentItems;
      }

      const nextItems = currentItems.filter((item) => item.id !== productId);
      persistCart(nextItems);

      setSavedItems((currentSavedItems) => {
        const exists = currentSavedItems.some((item) => item.id === productId);
        const nextSavedItems = exists
          ? currentSavedItems.map((savedItem) =>
              savedItem.id === productId ? { ...savedItem, quantity: savedItem.quantity + itemToSave.quantity } : savedItem,
            )
          : [...currentSavedItems, { ...itemToSave }];
        persistSavedItems(nextSavedItems);
        return nextSavedItems;
      });

      return nextItems;
    });
  };

  const moveToCart = (productId: number) => {
    setSavedItems((currentSavedItems) => {
      const itemToMove = currentSavedItems.find((item) => item.id === productId);
      if (!itemToMove) {
        return currentSavedItems;
      }

      const nextSavedItems = currentSavedItems.filter((item) => item.id !== productId);
      persistSavedItems(nextSavedItems);

      setItems((currentItems) => {
        const nextItems = currentItems.some((item) => item.id === productId)
          ? currentItems.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + itemToMove.quantity } : item,
            )
          : [...currentItems, { ...itemToMove }];
        persistCart(nextItems);
        return nextItems;
      });

      return nextSavedItems;
    });
  };

  const removeItem = (productId: number) => {
    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.id !== productId);
      return persistCart(nextItems);
    });
  };

  const removeSavedItem = (productId: number) => {
    setSavedItems((currentSavedItems) => {
      const nextSavedItems = currentSavedItems.filter((item) => item.id !== productId);
      return persistSavedItems(nextSavedItems);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) => {
      const nextItems = currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock ?? 10) }
          : item,
      );
      return persistCart(nextItems);
    });
  };

  const clearCart = () => {
    setItems(() => persistCart([]));
  };

  const clearSavedItems = () => {
    setSavedItems(() => persistSavedItems([]));
  };

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const freeShippingThreshold = 250;
  const shipping = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 29;
  const total = subtotal + shipping;

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      savedItems,
      addItem,
      saveForLater,
      moveToCart,
      removeItem,
      removeSavedItem,
      updateQuantity,
      clearCart,
      clearSavedItems,
      itemCount,
      subtotal,
      shipping,
      total,
      freeShippingThreshold,
    }),
    [items, savedItems, itemCount, subtotal, shipping, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
