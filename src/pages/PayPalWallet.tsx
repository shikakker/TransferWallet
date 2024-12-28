import React from 'react';
import { PayPalBalance } from '../components/paypal/PayPalBalance';
import { PayPalTransfer } from '../components/paypal/PayPalTransfer';
import { PayPalHistory } from '../components/paypal/PayPalHistory';
import { CurrencySelector } from '../components/paypal/CurrencySelector';
import { usePayPal } from '../hooks/usePayPal';

export function PayPalWallet() {
  const { account, loading, error, login } = usePayPal();

  if (loading) {
    return <div className="flex justify-center p-8">Loading PayPal account...</div>;
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4">Please log in to your PayPal account</p>
        <button
          onClick={login}
          className="bg-[#0070BA] text-white px-4 py-2 rounded-lg hover:bg-[#003087]"
        >
          Log in with PayPal
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">PayPal Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PayPalBalance account={account} />
          <CurrencySelector />
        </div>
        
        <PayPalTransfer account={account} />
      </div>

      <div className="mt-8">
        <PayPalHistory transactions={account.transactions} />
      </div>
    </div>
  );
}