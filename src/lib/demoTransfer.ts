import type { TokenBalance, Transaction } from '../types';

export type DemoRecipient = 'Demo Wallet A' | 'Demo Wallet B';

export type DemoWalletState = {
  balances: TokenBalance[];
  transactions: Transaction[];
};

export type DemoTransferResult =
  | { ok: true; state: DemoWalletState }
  | { ok: false; error: string };

const MICROS = 1_000_000n;
export const MAX_DEMO_TRANSACTIONS = 100;

function toMicros(value: string): bigint | null {
  if (!/^(?:0|[1-9][0-9]{0,8})(?:\.[0-9]{1,6})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const result = BigInt(whole) * MICROS + BigInt(fraction.padEnd(6, '0'));
  return result > 0n ? result : null;
}

export function simulateDemoTransfer(
  current: DemoWalletState,
  token: string,
  amount: string,
  recipient: string,
  now: Date = new Date(),
  id: string = crypto.randomUUID(),
): DemoTransferResult {
  // No address field is accepted: simulated transfers target fixed fake wallets.
  if (recipient !== 'Demo Wallet A' && recipient !== 'Demo Wallet B') {
    return { ok: false, error: 'Choose a demo recipient, not a real wallet address.' };
  }
  const tokens = current.balances;
  const source = tokens.find(item => item.symbol === token);
  if (!source) return { ok: false, error: 'This sample token is not available.' };

  const micros = typeof amount === 'string' ? toMicros(amount) : null;
  if (micros === null) {
    return { ok: false, error: 'Enter a positive amount with at most six decimal places.' };
  }
  if (!Number.isFinite(source.balance) || source.balance < 0) {
    return { ok: false, error: 'Sample balance is invalid.' };
  }

  // Refuse floating sample balances that cannot represent whole micro-units.
  // Rounding such balances could allow an overdraft or precision loss.
  const balanceMicros = source.balance * Number(MICROS);
  const roundedMicros = Math.round(balanceMicros);
  if (!Number.isSafeInteger(roundedMicros) || Math.abs(balanceMicros - roundedMicros) > 1e-6) {
    return { ok: false, error: 'Sample balance precision is invalid.' };
  }
  const available = BigInt(roundedMicros);
  if (micros > available) return { ok: false, error: 'Insufficient simulated balance.' };

  const balance = Number(available - micros) / Number(MICROS);
  const usdValue = source.balance > 0 && Number.isFinite(source.usdValue)
    ? Math.max(0, Math.round((source.usdValue * balance / source.balance) * 100) / 100)
    : 0;

  const transaction: Transaction = {
    id: `demo-${id}`,
    type: 'send',
    amount: Number(micros) / Number(MICROS),
    token,
    status: 'completed',
    timestamp: now,
    address: recipient,
  };
  return {
    ok: true,
    state: {
      balances: tokens.map(item => item.symbol === token ? { ...item, balance, usdValue } : { ...item }),
      transactions: [transaction, ...current.transactions].slice(0, MAX_DEMO_TRANSACTIONS),
    },
  };
}
