export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';

export interface CreateOrderRequest {
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: string;
  size: string;
}

export interface Order extends CreateOrderRequest {
  id: string;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: string;
}