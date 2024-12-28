import React from 'react';
import { Wallet } from 'lucide-react';
import { TokenBalance } from '../types';

interface WalletCardProps {
  address: string;
  balances: TokenBalance[];
}

export function WalletCard({ address, balances }: WalletCardProps) {
  const totalUsdValue = balances.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">My Wallet</h2>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">Address</p>
        <p className="font-mono text-sm truncate">{address}</p>
      </div>

      <div className="space-y-3">
        {balances.map((token) => (
          <div key={token.symbol} className="flex justify-between items-center">
            <span className="font-medium">{token.symbol}</span>
            <div className="text-right">
              <p className="font-medium">{token.balance.toFixed(4)}</p>
              <p className="text-sm text-gray-500">${token.usdValue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Value</span>
          <span className="font-semibold">${totalUsdValue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}