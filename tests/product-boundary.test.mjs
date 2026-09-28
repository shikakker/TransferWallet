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
