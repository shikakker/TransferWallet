import TronWeb from 'tronweb';
import { TRON_CONFIG } from '../config/tron';

class TronWebService {
  private static instance: TronWebService;
  private tronWeb: typeof TronWeb | null = null;

  private constructor() {}

  static getInstance(): TronWebService {
    if (!TronWebService.instance) {
      TronWebService.instance = new TronWebService();
    }
    return TronWebService.instance;
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    if (window.tronWeb) {
      this.tronWeb = window.tronWeb;
    } else {
      this.tronWeb = new TronWeb({
        fullHost: TRON_CONFIG.fullHost
      });
    }
  }

  async createWallet() {
    if (!this.tronWeb) {
      throw new Error('TronWeb not initialized');
    }
    return await this.tronWeb.createAccount();
  }

  async getBalance(address: string): Promise<number> {
    if (!this.tronWeb) {
      throw new Error('TronWeb not initialized');
    }
    const balance = await this.tronWeb.trx.getBalance(address);
    return balance / 1_000_000; // Convert from SUN to TRX
  }

  getTronWeb() {
    if (!this.tronWeb) {
      throw new Error('TronWeb not initialized');
    }
    return this.tronWeb;
  }
}

export const tronWebService = TronWebService.getInstance();