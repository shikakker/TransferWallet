export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
}

export type SupportedCurrency = 'USD' | 'RUB' | 'EUR' | 'TRX' | 'USDT';