import TronWeb from 'tronweb';
import { logger } from '../../utils/logger';
import { encryptPrivateKey, decryptPrivateKey } from '../../utils/crypto';
import { TronWallet, WalletCredentials } from '../../types/tron';

export class TronWalletService {
  private tronWeb: TronWeb;

  constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
    this.tronWeb = new TronWeb({
      fullHost: network === 'mainnet' 
        ? 'https://api.trongrid.io'
        : 'https://api.shasta.trongrid.io'
    });
  }

  /**
   * Creates a new TRON wallet with encryption
   */
  async createWallet(password: string): Promise<WalletCredentials> {
    try {
      const account = await this.tronWeb.createAccount();
      const encryptedKey = await encryptPrivateKey(account.privateKey, password);
      
      return {
        address: account.address.base58,
        encryptedPrivateKey: encryptedKey
      };
    } catch (error) {
      logger.error('Failed to create wallet', { error });
      throw new Error('Wallet creation failed');
    }
  }

  /**
   * Loads an existing wallet using encrypted credentials
   */
  async loadWallet(credentials: WalletCredentials, password: string): Promise<TronWallet> {
    try {
      const privateKey = await decryptPrivateKey(credentials.encryptedPrivateKey, password);
      const account = this.tronWeb.address.fromPrivateKey(privateKey);
      const balance = await this.tronWeb.trx.getBalance(account);

      return {
        address: account,
        balance: balance / 1_000_000, // Convert from SUN to TRX
        isActive: true
      };
    } catch (error) {
      logger.error('Failed to load wallet', { error });
      throw new Error('Invalid wallet credentials or password');
    }
  }
}