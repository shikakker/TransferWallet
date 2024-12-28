import { WalletInfo, Transaction } from '../../types/wallet';
import { TronService } from '../tron/TronService';
import { ExchangeRateService } from '../exchange/ExchangeRateService';
import { logger } from '../../utils/logger';

/**
 * Manages TRON wallet operations and information
 */
export class WalletManager {
  constructor(
    private tronService: TronService,
    private exchangeService: ExchangeRateService
  ) {}

  /**
   * Get detailed wallet information
   * @param {string} address TRON wallet address
   * @returns {Promise<WalletInfo>} Wallet details and transactions
   */
  async getWalletInfo(address: string): Promise<WalletInfo> {
    try {
      const [balance, transactions, rate] = await Promise.all([
        this.tronService.getBalance(address),
        this.tronService.getTransactions(address, 5),
        this.exchangeService.getExchangeRate()
      ]);

      const usdEquivalent = balance * rate.usd / rate.trx;

      return {
        address,
        balance: {
          trx: balance,
          usdEquivalent
        },
        lastTransactions: transactions.map(tx => ({
          id: tx.id,
          type: tx.from === address ? 'outgoing' : 'incoming',
          amount: tx.amount,
          timestamp: tx.timestamp,
          status: tx.confirmed ? 'confirmed' : 'pending',
          counterpartyAddress: tx.from === address ? tx.to : tx.from
        })),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to fetch wallet info', { address, error });
      throw error;
    }
  }
}