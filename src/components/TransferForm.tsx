import { useState, type FormEvent } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import type { TokenBalance } from '../types';

interface TransferFormProps {
  balances: TokenBalance[];
  onSimulate: (token: string, amount: string, recipient: string) => string | null;
}

export function TransferForm({ balances, onSimulate }: TransferFormProps) {
  const [recipient, setRecipient] = useState('Demo Wallet A');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('TRX');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const selectedBalance = balances.find(item => item.symbol === token)?.balance ?? 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setReceipt('');
    const failure = onSimulate(token, amount, recipient);
    if (failure) {
      setError(failure);
      return;
    }
    setReceipt(`Simulation complete: ${amount} ${token} sent to ${recipient} in this browser session only. No blockchain transaction occurred.`);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Send aria-hidden="true" className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Simulated token transfer</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="demo-recipient" className="block text-sm font-medium text-gray-700 mb-1">Demo recipient</label>
          <select
            id="demo-recipient"
            value={recipient}
            onChange={event => { setRecipient(event.target.value); setReceipt(''); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Demo Wallet A">Demo Wallet A</option>
            <option value="Demo Wallet B">Demo Wallet B</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Fixed fictional recipients; do not enter real wallet addresses.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="demo-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              id="demo-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={32}
              value={amount}
              onChange={event => { setAmount(event.target.value); setError(''); setReceipt(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="0.000001"
              aria-describedby="demo-available"
              required
            />
          </div>
          <div>
            <label htmlFor="demo-token" className="block text-sm font-medium text-gray-700 mb-1">Sample token</label>
            <select
              id="demo-token"
              value={token}
              onChange={event => { setToken(event.target.value); setAmount(''); setError(''); setReceipt(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {balances.map(item => <option value={item.symbol} key={item.symbol}>{item.symbol}</option>)}
            </select>
          </div>
        </div>

        <p id="demo-available" className="text-sm text-gray-600">
          Available sample balance: {selectedBalance.toFixed(6)} {token}
        </p>

        <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle aria-hidden="true" className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Offline simulation only. No funds, tokens, addresses, networks or providers are contacted.
            This is not a real wallet.
          </p>
        </div>

        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</p>}
        {receipt && <p role="status" className="text-sm text-green-800 bg-green-50 p-3 rounded-lg">{receipt}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Simulate transfer
        </button>
      </div>
    </form>
  );
}
