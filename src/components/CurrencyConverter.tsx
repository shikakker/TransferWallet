import React, { useState } from 'react';
import { SupportedCurrency } from '../types/currency';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { convertAmount } from '../utils/currency';
import { CurrencySelect } from './CurrencySelect';
import { ExchangeRateDisplay } from './ExchangeRateDisplay';

interface CurrencyConverterProps {
  defaultFrom?: SupportedCurrency;
  defaultTo?: SupportedCurrency;
  onConvert?: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => void;
}

export function CurrencyConverter({
  defaultFrom = 'USD',
  defaultTo = 'RUB',
  onConvert
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>(defaultFrom);
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>(defaultTo);

  const { rate, loading, error } = useExchangeRate(fromCurrency, toCurrency);

  const handleConvert = () => {
    if (!rate || !amount) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    const result = convertAmount(numAmount, rate.rate, fromCurrency, toCurrency);
    onConvert?.(result.toAmount, fromCurrency, toCurrency);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Currency Converter</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CurrencySelect
            label="From"
            value={fromCurrency}
            onChange={setFromCurrency}
          />
          <CurrencySelect
            label="To"
            value={toCurrency}
            onChange={setToCurrency}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {rate && amount && (
          <ExchangeRateDisplay
            amount={amount}
            rate={rate}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
          />
        )}

        <button
          onClick={handleConvert}
          disabled={loading || !amount || !rate}
          className={`w-full py-2 px-4 rounded-lg ${
            loading || !amount || !rate
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Loading...' : 'Convert'}
        </button>
      </div>
    </div>
  );
}