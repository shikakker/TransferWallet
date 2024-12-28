import Stripe from 'stripe';
import { STRIPE_CONFIG } from '../../config/stripe';

class StripeClient {
  private static instance: StripeClient;
  private stripe: Stripe;

  private constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_CONFIG.apiVersion,
    });
  }

  public static getInstance(): StripeClient {
    if (!StripeClient.instance) {
      StripeClient.instance = new StripeClient();
    }
    return StripeClient.instance;
  }

  public getClient(): Stripe {
    return this.stripe;
  }
}

export const stripeClient = StripeClient.getInstance();