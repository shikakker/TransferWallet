import { PaymentRequest } from '../types/payment';

/**
 * Validates payment request parameters
 * @param {PaymentRequest} request Request to validate
 * @returns {Error|null} Validation error if any
 */
export function validatePaymentRequest(request: PaymentRequest): Error | null {
  if (!request.amount || request.amount <= 0) {
    return new Error('Invalid amount');
  }

  if (!request.payerEmail || !request.payerEmail.includes('@')) {
    return new Error('Invalid email address');
  }

  if (!request.tronReceiverAddress || request.tronReceiverAddress.length !== 34) {
    return new Error('Invalid TRON address');
  }

  if (!request.paymentDescription?.trim()) {
    return new Error('Payment description is required');
  }

  return null;
}