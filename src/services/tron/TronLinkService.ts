import { logger } from '../../utils/logger';
import { TronWallet } from '../../types/tron';

export class TronLinkService {
  private tronWeb: any = null;

  /**
   * Initializes TronLink connection
   */
  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') {
      throw new Error('TronLink requires browser environment');
    }

    try {
      if (window.tronWeb) {
        this.tronWeb = window.tronWeb;
        return true;
      }

      // Wait for TronLink injection
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const checkTronLink = setInterval(() => {
          if (window.tronWeb) {
            clearInterval(checkTronLink);
            this.tronWeb = window.tronWeb;
            resolve();
          }
          if (++attempts > 10) {
            clearInterval(checkTronLink);
            reject(new Error('TronLink not found'));
          }
        }, 500);
      });

      return true;
    } catch (error) {
      logger.error('TronLink initialization failed', { error });
      return false;
    }
  }

  /**
   * Gets current wallet information
   */
  async getCurrentWallet(): Promise<TronWallet | null> {
    if (!this.tronWeb) {
      throw new Error('TronLink not initialized');
    }

    try {
      const address = this.tronWeb.defaultAddress.base58;
      if (!address) return null;

      const balance = await this.tronWeb.trx.getBalance(address);
      
      return {
        address,
        balance: balance / 1_000_000,
        isActive: true
      };
    } catch (error) {
      logger.error('Failed to get wallet info', { error });
      return null;
    }
  }
}