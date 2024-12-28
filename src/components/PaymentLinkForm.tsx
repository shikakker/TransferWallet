import React, { useState } from 'react';
import { LinkService } from '../services/links/LinkService';

interface PaymentLinkFormProps {
  onLinkCreated: (link: { url: string; expiresAt: string }) => void;
}

export function PaymentLinkForm({ onLinkCreated }: PaymentLinkFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [tronAddress, setTronAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkService = new LinkService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const link = await linkService.createPaymentLink({
        amount: parseFloat(amount),
        description,
        tronAddress,
        expiresInHours: 24
      });

      onLinkCreated({
        url: link.url,
        expiresAt: link.expiresAt
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount (USD)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          min="0.01"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          TRON Wallet Address
        </label>
        <input
          type="text"
          value={tronAddress}
          onChange={(e) => setTronAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          pattern="^T[A-Za-z0-9]{33}"
          title="Enter a valid TRON wallet address"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Creating...' : 'Create Payment Link'}
      </button>
    </form>
  );
}