import React from 'react';
import { WalletBalance } from '../components/wallet/WalletBalance';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WalletActions } from '../components/wallet/WalletActions';
import { WalletAddress } from '../components/wallet/WalletAddress';
import { useWallet } from '../hooks/useWallet';

export function GenericWallet() {
  const { wallet, loading, error } = useWallet();

  if (loading) {
    return <div className="flex justify-center p-8">Loading wallet...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WalletAddress address={wallet?.address} />
          <WalletBalance balance={wallet?.balance} />
        </div>
        
        <WalletActions />
      </div>

      <div className="mt-8">
        <TransactionHistory transactions={wallet?.lastTransactions} />
      </div>
    </div>
  );
}