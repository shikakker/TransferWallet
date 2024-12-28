import { useState, useEffect } from 'react';
import { tronWebService } from '../services/tronWeb';
import type { TronAccount } from '../types/tron';

export function useTronWallet() {
  const [account, setAccount] = useState<TronAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeTronWeb();
  }, []);

  async function initializeTronWeb() {
    try {
      await tronWebService.initialize();
      const tronWeb = tronWebService.getTronWeb();
      
      if (tronWeb.defaultAddress?.base58) {
        const balance = await tronWebService.getBalance(tronWeb.defaultAddress.base58);
        setAccount({
          address: tronWeb.defaultAddress.base58,
          balance,
          tokens: []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize TronWeb');
    } finally {
      setLoading(false);
    }
  }

  async function createWallet() {
    try {
      setLoading(true);
      const wallet = await tronWebService.createWallet();
      const balance = await tronWebService.getBalance(wallet.address.base58);
      
      setAccount({
        address: wallet.address.base58,
        balance,
        tokens: []
      });
      
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    account,
    loading,
    error,
    createWallet
  };
}