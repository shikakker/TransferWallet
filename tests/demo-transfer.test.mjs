import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateDemoTransfer, MAX_DEMO_TRANSACTIONS } from '../src/lib/demoTransfer.ts';

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


test('local demo transaction history remains bounded even after many transfers', () => {
  assert.equal(MAX_DEMO_TRANSACTIONS, 100);
  const old = Array.from({ length: 150 }, (_, index) => ({
    id: String(index), type: 'send', amount: 1, token: 'TRX', status: 'completed',
    timestamp: new Date(), address: 'Demo Wallet A',
  }));
  const current = { ...state(), transactions: old };
  const result = simulateDemoTransfer(current, 'TRX', '1', 'Demo Wallet B', new Date(), 'newest');
  assert.equal(result.ok, true);
  assert.equal(result.state.transactions.length, MAX_DEMO_TRANSACTIONS);
  assert.equal(result.state.transactions[0].id, 'demo-newest');
  assert.equal(result.state.transactions.at(-1).id, old[98].id);
  assert.equal(current.transactions.length, 150, 'past state must remain immutable');
});

test('repeated transfers do not grow the in-memory UI history without bound', () => {
  let current = state();
  for (let i = 0; i < 110; i += 1) {
    const result = simulateDemoTransfer(current, 'TRX', '1', 'Demo Wallet A', new Date(), String(i));
    assert.equal(result.ok, true);
    current = result.state;
  }
  assert.equal(current.transactions.length, MAX_DEMO_TRANSACTIONS);
  assert.equal(current.transactions[0].id, 'demo-109');
});
