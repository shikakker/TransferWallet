import { CreatePaymentRequest, PaymentIntent } from '../types/payment';

class StripeService {
  private static instance: StripeService;
  private stripe: any = null;

  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async initialize(publishableKey: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    if (!window.Stripe) {
      throw new Error('Stripe.js not loaded');
    }
    
    this.stripe = window.Stripe(publishableKey);
  }

  async createPaymentIntent(request: CreatePaymentRequest): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  async confirmCardPayment(clientSecret: string, paymentMethod: any): Promise<PaymentIntent> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { paymentIntent, error } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    if (error) {
      throw error;
    }

    return paymentIntent;
  }

  getStripe() {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }
    return this.stripe;
  }
}

export const stripeService = StripeService.getInstance();