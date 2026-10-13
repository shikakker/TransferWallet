import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('canonical wallet runtime is explicitly simulation-only', () => {
  const app = read('src/App.tsx');
  assert.match(app, /TRON Wallet Demo/);
  assert.match(app, /Simulation only/);
  assert.match(app, /No live wallet is connected/);
  assert.match(app, /Simulated wallet data/);
});

test('canonical TSX source does not contain accidental escaped-newline tokens', () => {
  const app = read('src/App.tsx');
  assert.doesNotMatch(app, />\\n\s*</);
});

test('demo transfer form uses fixed fictitious recipients and updates a local balance, never logs an address', () => {
  const form = read('src/components/TransferForm.tsx');
  const app = read('src/App.tsx');
  assert.doesNotMatch(form, /console\.log\(|Enter TRON address|Send Tokens/);
  assert.match(form, /Demo Wallet A/);
  assert.match(form, /Simulate transfer/);
  assert.match(app, /simulateDemoTransfer\(/);
  assert.match(app, /setWalletState\(/);
  assert.match(form, /role="alert"/);
  assert.match(form, /role="status"/);
});
