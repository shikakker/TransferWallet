import React from 'react';
import { Wallet } from 'lucide-react';
import { useTronWallet } from '../hooks/useTronWallet';

export function WalletConnect() {
  const { account, loading, error, connect, disconnect } = useTronWallet();

  if (loading) {
    return (
      <button disabled className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
        Connecting...
      </button>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <span>{error}</span>
        <button 
          onClick={connect}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{account.balance.toFixed(2)} TRX</p>
          <p className="text-sm text-gray-500 font-mono">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <Wallet className="w-5 h-5" />
      Connect Wallet
    </button>
  );
}