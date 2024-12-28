import React from 'react';
import { NetworkStatus } from '../components/tron/NetworkStatus';
import { TronBalance } from '../components/tron/TronBalance';
import { TronTransfer } from '../components/tron/TronTransfer';
import { NetworkSelector } from '../components/tron/NetworkSelector';
import { useTronLink } from '../hooks/useTronLink';

export function TronLinkWallet() {
  const { wallet, network, loading, error, connect, switchNetwork } = useTronLink();

  if (loading) {
    return <div className="flex justify-center p-8">Connecting to TronLink...</div>;
  }

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-4">Please connect your TronLink wallet</p>
        <button
          onClick={connect}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Connect TronLink
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">TronLink Wallet</h1>
        <NetworkStatus />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TronBalance wallet={wallet} />
          <NetworkSelector
            currentNetwork={network}
            onSwitch={switchNetwork}
          />
        </div>
        
        <TronTransfer wallet={wallet} />
      </div>
    </div>
  );
}