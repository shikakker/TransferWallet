import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentProcessor } from '../src/services/payment/PaymentProcessor';
import { StripeService } from '../src/services/stripe/StripeService';
import { TronService } from '../src/services/tron/TronService';
import { ExchangeRateService } from '../src/services/exchange/ExchangeRateService';

describe('PaymentProcessor', () => {
  let paymentProcessor: PaymentProcessor;
  let mockStripeService: StripeService;
  let mockTronService: TronService;
  let mockExchangeService: ExchangeRateService;

  beforeEach(() => {
    mockStripeService = {
      createPayment: vi.fn(),
      confirmPayment: vi.fn()
    } as any;

    mockTronService = {
      sendTransaction: vi.fn(),
      verifyTransaction: vi.fn()
    } as any;

    mockExchangeService = {
      getExchangeRate: vi.fn()
    } as any;

    paymentProcessor = new PaymentProcessor(
      mockStripeService,
      mockTronService,
      mockExchangeService
    );
  });

  it('should process payment successfully', async () => {
    // Mock successful responses
    mockExchangeService.getExchangeRate.mockResolvedValue({
      usd: 1,
      trx: 30,
      timestamp: new Date().toISOString()
    });

    mockStripeService.createPayment.mockResolvedValue({
      id: 'stripe_123',
      status: 'succeeded'
    });

    mockTronService.sendTransaction.mockResolvedValue({
      id: 'tron_123',
      status: 'success'
    });

    mockStripeService.confirmPayment.mockResolvedValue(true);
    mockTronService.verifyTransaction.mockResolvedValue(true);

    const result = await paymentProcessor.processPayment({
      amount: 100,
      payerEmail: 'test@example.com',
      tronReceiverAddress: 'TRX1234567890',
      paymentDescription: 'Test payment'
    });

    expect(result.success).toBe(true);
    expect(result.stripeTransactionId).toBeDefined();
    expect(result.tronTransactionId).toBeDefined();
  });

  it('should handle payment failure', async () => {
    mockStripeService.createPayment.mockRejectedValue(
      new Error('Payment failed')
    );

    await expect(paymentProcessor.processPayment({
      amount: 100,
      payerEmail: 'test@example.com',
      tronReceiverAddress: 'TRX1234567890',
      paymentDescription: 'Test payment'
    })).rejects.toThrow('Payment failed');
  });
});