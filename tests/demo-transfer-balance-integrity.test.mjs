import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateDemoTransfer } from '../src/lib/demoTransfer.ts';

const sample = (balance) => ({
  balances: [{ symbol: 'TRX', balance, usdValue: 1 }],
  transactions: [],
});

test('a fractional-micro-unit starting balance cannot be rounded up to permit an overdraft', () => {
  for (const balance of [0.0000006, 0.0000014, 0.0000019]) {
    const result = simulateDemoTransfer(sample(balance), 'TRX', '0.000001', 'Demo Wallet A');
    assert.equal(result.ok, false, String(balance));
  }
});

test('valid six-decimal balances still support exactly representable micro-unit debit', () => {
  const result = simulateDemoTransfer(sample(0.000001), 'TRX', '0.000001', 'Demo Wallet B');
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.state.balances[0].balance, 0);
});

test('balances above Number safe precision cannot be converted to ledger micro-units', () => {
  const result = simulateDemoTransfer(sample(1e16), 'TRX', '1', 'Demo Wallet A');
  assert.equal(result.ok, false);
});
