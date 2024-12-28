import React from 'react';
import { SupportedCurrency } from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../config/currency';

interface CurrencySelectProps {
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  label: string;
}

export function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedCurrency)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        {SUPPORTED_CURRENCIES.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  );
}