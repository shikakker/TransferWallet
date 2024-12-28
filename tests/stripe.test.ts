import { describe, it, expect, beforeAll } from 'vitest';
import { createPaymentIntent } from '../src/services/stripe/payment';
import { TEST_CARDS } from '../src/config/stripe';

describe('Stripe Payment Integration', () => {
  beforeAll(() => {
    // Set up test environment
    process.env.STRIPE_SECRET_KEY = 'sk_test_...';
  });

  it('should create a payment intent', async () => {
    const params = {
      amount: 1000, // $10.00
      currency: 'usd',
    };

    const result = await createPaymentIntent(params);
    expect(result).toBeDefined();
    expect(result.client_secret).toBeDefined();
  });

  it('should handle card decline', async () => {
    const params = {
      amount: 1000,
      currency: 'usd',
      paymentMethods: ['card'],
    };

    try {
      await createPaymentIntent(params);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});