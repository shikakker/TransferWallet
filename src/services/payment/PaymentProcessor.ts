import { PaymentRequest, PaymentResponse, PaymentError } from '../../types/payment';
import { StripeService } from '../stripe/StripeService';
import { TronService } from '../tron/TronService';
import { ExchangeRateService } from '../exchange/ExchangeRateService';
import { validatePaymentRequest } from '../../utils/validators';
import { logger } from '../../utils/logger';

/**
 * Handles the complete payment flow including both Stripe and TRON transactions
 */
export class PaymentProcessor {
  constructor(
    private stripeService: StripeService,
    private tronService: TronService,
    private exchangeService: ExchangeRateService
  ) {}

  /**
   * Process a dual payment transaction
   * @param {PaymentRequest} request Payment details
   * @returns {Promise<PaymentResponse>} Transaction result
   * @throws {PaymentError} When payment processing fails
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate request
      const validationError = validatePaymentRequest(request);
      if (validationError) {
        throw new PaymentError(
          'INVALID_REQUEST',
          validationError.message,
          validationError.details
        );
      }

      // Get current exchange rate
      const rate = await this.exchangeService.getExchangeRate();
      const trxAmount = request.amount * rate.trx / rate.usd;

      // Start Stripe payment
      logger.info('Initiating Stripe payment', { amount: request.amount });
      const stripePayment = await this.stripeService.createPayment({
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: 'usd',
        description: request.paymentDescription,
        email: request.payerEmail
      });

      // Process TRON transaction
      logger.info('Processing TRON transaction', { amount: trxAmount });
      const tronTx = await this.tronService.sendTransaction({
        to: request.tronReceiverAddress,
        amount: trxAmount
      });

      // Verify both transactions
      const stripeConfirmed = await this.stripeService.confirmPayment(stripePayment.id);
      const tronConfirmed = await this.tronService.verifyTransaction(tronTx.id);

      return {
        success: true,
        stripeTransactionId: stripePayment.id,
        tronTransactionId: tronTx.id,
        timestamp: new Date().toISOString(),
        amounts: {
          usd: request.amount,
          trx: trxAmount
        },
        status: {
          stripe: stripeConfirmed ? 'confirmed' : 'failed',
          tron: tronConfirmed ? 'confirmed' : 'pending'
        }
      };
    } catch (error) {
      logger.error('Payment processing failed', { error });
      throw new PaymentError(
        'PAYMENT_FAILED',
        'Failed to process payment',
        error
      );
    }
  }
}