declare global {
  interface Window {
    tronWeb: any;
  }
}

const CONTRACT_DECIMALS = 6;
const DEFAULT_TOKENS = {
  USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  BTT: 'TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4',
  WIN: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
  JST: 'TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9'
};

export async function connectWallet(): Promise<TronAccount | null> {
  try {
    if (!window.tronWeb) {
      throw new Error('TronLink not installed');
    }

    const account = await window.tronWeb.request({ method: 'tron_requestAccounts' });
    if (!account) return null;

    const address = window.tronWeb.defaultAddress.base58;
    const balance = await window.tronWeb.trx.getBalance(address);
    const tokens = await getTokenBalances(address);

    return {
      address,
      balance: balance / 1e6,
      tokens
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
}

async function getTokenBalances(address: string): Promise<TokenBalance[]> {
  const balances: TokenBalance[] = [];

  for (const [symbol, contractAddress] of Object.entries(DEFAULT_TOKENS)) {
    try {
      const contract = await window.tronWeb.contract().at(contractAddress);
      const balance = await contract.balanceOf(address).call();
      
      balances.push({
        symbol,
        address: contractAddress,
        decimals: CONTRACT_DECIMALS,
        balance: parseFloat(balance.toString()) / Math.pow(10, CONTRACT_DECIMALS)
      });
    } catch (error) {
      console.error(`Failed to fetch ${symbol} balance:`, error);
    }
  }

  return balances;
}