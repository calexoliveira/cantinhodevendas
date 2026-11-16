export type OrderItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image: string;
};

export type OrderStatus = 'Em processamento' | 'Enviado' | 'Entregue';

export type Order = {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  status: OrderStatus;
  items: OrderItem[];
};

const ORDERS_STORAGE_KEY = 'minhaloja.orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedValue = window.localStorage.getItem(ORDERS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue) as Order[];
  } catch {
    return [];
  }
}

export function getOrderById(orderId: string): Order | undefined {
  return getOrders().find((order) => order.id === orderId);
}

export function addOrder(order: Order) {
  if (typeof window === 'undefined') {
    return [] as Order[];
  }

  const currentOrders = getOrders();
  const nextOrders = [order, ...currentOrders].slice(0, 12);
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
  return nextOrders;
}
