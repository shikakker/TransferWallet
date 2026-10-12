import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateDemoTransfer } from '../src/lib/demoTransfer.ts';

const state = () => ({
  balances: [{ symbol: 'TRX', balance: 1000, usdValue: 85.20 }, { symbol: 'USDT', balance: 150, usdValue: 150 }],
  transactions: [],
});
test('simulated transfers debit only the local sample balance with exact 6-decimal arithmetic', () => {
  const initial = state();
  const first = simulateDemoTransfer(initial, 'TRX', '0.000001', 'Demo Wallet A', new Date('2026-10-12T00:00:00Z'), 'first');
  assert.equal(first.ok, true);
  assert.equal(first.state.balances[0].balance, 999.999999);
  assert.equal(first.state.transactions[0].address, 'Demo Wallet A');
  assert.equal(first.state.transactions[0].status, 'completed');
  assert.equal(initial.balances[0].balance, 1000);
  const second = simulateDemoTransfer(first.state, 'TRX', '999.999999', 'Demo Wallet B', new Date(), 'second');
  assert.equal(second.ok, true);
  assert.equal(second.state.balances[0].balance, 0);
  assert.equal(simulateDemoTransfer(second.state, 'TRX', '1', 'Demo Wallet A').ok, false);
});

test('rejects overspend, unsupported tokens, forged recipient and ambiguous amounts', () => {
  const before = state();
  for (const amount of ['', '0', '-1', 'NaN', 'Infinity', '1e3', '1,000', '0.0000001', '2000', ' 3 ', '.2']) {
    assert.equal(simulateDemoTransfer(before, 'TRX', amount, 'Demo Wallet A').ok, false, amount);
  }
  assert.equal(simulateDemoTransfer(before, 'NOT_SUPPORTED', '1', 'Demo Wallet A').ok, false);
  assert.equal(simulateDemoTransfer(before, 'USDT', '1', 'TRealUserAddress').ok, false);
  assert.deepEqual(before, state());
});

test('no blockchain address, provider request or signer is involved in demo transfer module', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../src/lib/demoTransfer.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /fetch\(|console\.|TronWeb|Stripe|signTransaction/);
});
