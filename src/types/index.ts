export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  address: string;
}

export interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}

export interface NetworkStatus {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
}