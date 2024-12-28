import { stripeClient } from './client';
import type { CreatePaymentParams } from '../../types/payment';
import { STRIPE_CONFIG } from '../../config/stripe';

export async function createPaymentIntent(params: CreatePaymentParams) {
  const stripe = stripeClient.getClient();

  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency || STRIPE_CONFIG.currency,
    payment_method_types: params.paymentMethods || STRIPE_CONFIG.paymentMethods,
    metadata: params.metadata,
  });
}

export async function confirmPayment(paymentIntentId: string) {
  const stripe = stripeClient.getClient();
  return stripe.paymentIntents.confirm(paymentIntentId);
}

export async function cancelPayment(paymentIntentId: string) {
  const stripe = stripeClient.getClient();
  return stripe.paymentIntents.cancel(paymentIntentId);
}