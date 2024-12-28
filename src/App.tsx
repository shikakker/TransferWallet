import React from 'react';
import { WalletCard } from './components/WalletCard';
import { TransferForm } from './components/TransferForm';
import { TransactionList } from './components/TransactionList';
import { NetworkStatus } from './components/NetworkStatus';
import { Transaction, TokenBalance, NetworkStatus as NetworkStatusType } from './types';

// Demo data
const demoAddress = 'TRx1234...5678';
const demoBalances: TokenBalance[] = [
  { symbol: 'TRX', balance: 1000, usdValue: 85.20 },
  { symbol: 'USDT', balance: 150, usdValue: 150 },
  { symbol: 'BTT', balance: 10000, usdValue: 25.50 }
];

const demoTransactions: Transaction[] = [
  {
    id: '1',
    type: 'send',
    amount: 100,
    token: 'TRX',
    status: 'completed',
    timestamp: new Date(),
    address: 'TRx9876...4321'
  },
  {
    id: '2',
    type: 'receive',
    amount: 50,
    token: 'USDT',
    status: 'pending',
    timestamp: new Date(),
    address: 'TRx5432...8765'
  }
];

const networkStatus: NetworkStatusType = {
  status: 'healthy',
  latency: 45
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">TRON Wallet</h1>
          <NetworkStatus status={networkStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <WalletCard address={demoAddress} balances={demoBalances} />
            <TransactionList transactions={demoTransactions} />
          </div>
          <div>
            <TransferForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;