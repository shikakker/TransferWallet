import { useState, useEffect } from 'react';
import { ExchangeRate, SupportedCurrency } from '../types/currency';
import { fetchExchangeRate } from '../utils/currency';
import { REFRESH_INTERVAL } from '../config/currency';

export function useExchangeRate(
  from: SupportedCurrency,
  to: SupportedCurrency
) {
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function updateRate() {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const newRate = await fetchExchangeRate(from, to);
        if (mounted) {
          setRate(newRate);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch rate');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    updateRate();
    const interval = setInterval(updateRate, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [from, to]);

  return { rate, loading, error };
}