import { CreateOrderRequest, Order } from '../types/order';

const API_URL = 'https://api.example.com/v1';

export async function createOrder(order: CreateOrderRequest, token: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(order)
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}