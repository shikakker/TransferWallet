import { ExchangeRate, ConversionResult, SupportedCurrency } from '../types/currency';
import { EXCHANGE_API_URL } from '../config/currency';

export async function fetchExchangeRate(
  from: SupportedCurrency,
  to: SupportedCurrency
): Promise<ExchangeRate> {
  try {
    const response = await fetch(
      `${EXCHANGE_API_URL}?base=${from}&symbols=${to}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    
    return {
      from,
      to,
      rate: data.rates[to],
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Exchange rate fetch error:', error);
    throw error;
  }
}

export function convertAmount(
  amount: number,
  rate: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): ConversionResult {
  const convertedAmount = amount * rate;
  
  return {
    fromAmount: amount,
    fromCurrency: from,
    toAmount: convertedAmount,
    toCurrency: to,
    rate
  };
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'TRX' || currency === 'USDT' ? 'USD' : currency,
    maximumFractionDigits: 2
  }).format(amount).replace('$', currency === 'TRX' ? 'TRX ' : currency === 'USDT' ? 'USDT ' : '$');
}