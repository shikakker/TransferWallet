import express from 'express';
import { createPaymentIntent, confirmPayment } from '../services/stripe/payment';
import { handleWebhook } from '../services/stripe/webhook';
import type { CreatePaymentParams } from '../types/payment';

const router = express.Router();

// Create Payment Intent
router.post('/create-payment', async (req, res) => {
  try {
    const params: CreatePaymentParams = {
      amount: req.body.amount,
      currency: req.body.currency,
      metadata: req.body.metadata,
    };

    const paymentIntent = await createPaymentIntent(params);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Payment creation failed:', err);
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : 'Payment creation failed',
    });
  }
});

// Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const event = await handleWebhook(req.body, sig);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : 'Webhook processing failed',
    });
  }
});

async function handlePaymentSuccess(paymentIntent: any) {
  // Implement your business logic for successful payments
  console.log('Payment succeeded:', paymentIntent.id);
}

async function handlePaymentFailure(paymentIntent: any) {
  // Implement your business logic for failed payments
  console.error('Payment failed:', paymentIntent.id);
}

export default router;