import { stripeClient } from './client';
import { STRIPE_CONFIG } from '../../config/stripe';
import type { WebhookEvent } from '../../types/webhook';

export async function handleWebhook(
  payload: string | Buffer,
  signature: string
): Promise<WebhookEvent> {
  const stripe = stripeClient.getClient();

  if (!STRIPE_CONFIG.webhookSecret) {
    throw new Error('Webhook secret is required');
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    throw err;
  }
}