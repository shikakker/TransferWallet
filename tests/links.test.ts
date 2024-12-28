import { describe, it, expect, beforeEach } from 'vitest';
import { LinkService } from '../src/services/links/LinkService';

describe('LinkService', () => {
  let linkService: LinkService;

  beforeEach(() => {
    linkService = new LinkService();
  });

  it('should create payment link', async () => {
    const params = {
      amount: 100,
      description: 'Test payment',
      tronAddress: 'TRx1234567890123456789012345678901234',
      expiresInHours: 24
    };

    const link = await linkService.createPaymentLink(params);

    expect(link.id).toBeDefined();
    expect(link.url).toContain('/pay/');
    expect(link.amount).toBe(params.amount);
    expect(link.description).toBe(params.description);
    expect(link.metadata?.tronAddress).toBe(params.tronAddress);
  });

  it('should handle invalid link retrieval', async () => {
    const link = await linkService.getPaymentLink('invalid-id');
    expect(link).toBeNull();
  });
});