import React from 'react';
import { ExchangeRate, SupportedCurrency } from '../types/currency';
import { formatCurrency } from '../utils/currency';

interface ExchangeRateDisplayProps {
  amount: string;
  rate: ExchangeRate;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
}

export function ExchangeRateDisplay({ 
  amount, 
  rate, 
  fromCurrency, 
  toCurrency 
}: ExchangeRateDisplayProps) {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-lg">
        {formatCurrency(numAmount, fromCurrency)} = {' '}
        {formatCurrency(numAmount * rate.rate, toCurrency)}
      </p>
      <p className="text-sm text-gray-500">
        1 {fromCurrency} = {rate.rate} {toCurrency}
      </p>
    </div>
  );
}