import { useState } from 'react';
import { stripeService } from '../services/stripe';
import type { PaymentIntent, CreatePaymentRequest } from '../types/payment';

export function useStripePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPayment(request: CreatePaymentRequest): Promise<PaymentIntent> {
    setLoading(true);
    setError(null);
    
    try {
      return await stripeService.createPaymentIntent(request);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment creation failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function confirmPayment(clientSecret: string, paymentMethod: any): Promise<PaymentIntent> {
    setLoading(true);
    setError(null);
    
    try {
      return await stripeService.confirmCardPayment(clientSecret, paymentMethod);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment confirmation failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    createPayment,
    confirmPayment
  };
}