import { useState, useEffect } from 'react';
import { TronLinkService } from '../services/tron/TronLinkService';
import { TronWallet } from '../types/tron';

export function useTronLink() {
  const [wallet, setWallet] = useState<TronWallet | null>(null);
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tronLink = new TronLinkService();

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      setLoading(true);
      setError(null);

      const initialized = await tronLink.initialize();
      if (!initialized) {
        setError('TronLink not available');
        return;
      }

      const currentWallet = await tronLink.getCurrentWallet();
      setWallet(currentWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize TronLink');
    } finally {
      setLoading(false);
    }
  }

  async function connect() {
    try {
      setLoading(true);
      setError(null);
      
      await initialize();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setLoading(false);
    }
  }

  async function switchNetwork(newNetwork: 'mainnet' | 'testnet') {
    setNetwork(newNetwork);
    await initialize();
  }

  return { wallet, network, loading, error, connect, switchNetwork };
}