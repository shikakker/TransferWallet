/**
 * Common types for payment processing
 */
export interface PaymentRequest {
  amount: number;
  payerEmail: string;
  tronReceiverAddress: string;
  paymentDescription: string;
}

export interface PaymentResponse {
  success: boolean;
  stripeTransactionId?: string;
  tronTransactionId?: string;
  timestamp: string;
  amounts: {
    usd: number;
    trx: number;
  };
  status: {
    stripe: 'confirmed' | 'failed';
    tron: 'confirmed' | 'failed' | 'pending';
  };
}

export interface ExchangeRate {
  usd: number;
  trx: number;
  timestamp: string;
}

export class PaymentError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}