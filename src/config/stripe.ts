// Stripe configuration constants
export const STRIPE_CONFIG = {
  apiVersion: '2023-10-16',
  currency: 'usd',
  paymentMethods: ['card'],
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
} as const;

// Test card numbers for different scenarios
export const TEST_CARDS = {
  success: '4242424242424242',
  decline: '4000000000000002',
  insufficient: '4000000000009995',
  authRequired: '4000002500003155',
} as const;