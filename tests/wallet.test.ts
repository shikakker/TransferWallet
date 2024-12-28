import { describe, it, expect, beforeEach } from 'vitest';
import { TronWalletService } from '../src/services/tron/TronWalletService';

describe('TronWalletService', () => {
  let walletService: TronWalletService;

  beforeEach(() => {
    walletService = new TronWalletService('testnet');
  });

  it('should create a new wallet', async () => {
    const password = 'test-password-123';
    const credentials = await walletService.createWallet(password);

    expect(credentials.address).toBeDefined();
    expect(credentials.address).toMatch(/^T/);
    expect(credentials.encryptedPrivateKey).toBeDefined();
  });

  it('should load existing wallet', async () => {
    const password = 'test-password-123';
    const credentials = await walletService.createWallet(password);
    const wallet = await walletService.loadWallet(credentials, password);

    expect(wallet.address).toBe(credentials.address);
    expect(wallet.balance).toBeGreaterThanOrEqual(0);
    expect(wallet.isActive).toBe(true);
  });

  it('should fail with wrong password', async () => {
    const credentials = await walletService.createWallet('correct-password');
    
    await expect(
      walletService.loadWallet(credentials, 'wrong-password')
    ).rejects.toThrow('Invalid wallet credentials or password');
  });
});