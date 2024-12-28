export interface WalletInfo {
  address: string;
  balance: {
    trx: number;
    usdEquivalent: number;
  };
  lastTransactions: Transaction[];
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  counterpartyAddress: string;
}