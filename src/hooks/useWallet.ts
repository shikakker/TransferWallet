import { useState, useEffect } from 'react';
import { WalletInfo } from '../types/wallet';
import { WalletManager } from '../services/wallet/WalletManager';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    try {
      setLoading(true);
      setError(null);

      // In a real app, get the address from authentication
      const address = localStorage.getItem('walletAddress');
      if (!address) {
        setError('No wallet connected');
        return;
      }

      const walletManager = new WalletManager(
        /* inject required services */
      );
      
      const info = await walletManager.getWalletInfo(address);
      setWallet(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet');
    } finally {
      setLoading(false);
    }
  }

  return { wallet, loading, error };
}