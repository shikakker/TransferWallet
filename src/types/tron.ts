export interface TronWallet {
  address: string;
  balance: number;
  isActive: boolean;
}

export interface WalletCredentials {
  address: string;
  encryptedPrivateKey: string;
}

export interface TronTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  confirmed: boolean;
}

export interface TransactionRequest {
  to: string;
  amount: number;
  memo?: string;
}