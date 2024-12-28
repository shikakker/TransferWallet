import { CreateOrderRequest } from '../types/order';

export function validateOrder(order: CreateOrderRequest): string[] {
  const errors: string[] = [];

  if (!order.symbol) {
    errors.push('Symbol is required');
  }

  if (!order.size || parseFloat(order.size) <= 0) {
    errors.push('Size must be greater than 0');
  }

  if (order.type === 'limit' && (!order.price || parseFloat(order.price) <= 0)) {
    errors.push('Price must be greater than 0 for limit orders');
  }

  return errors;
}