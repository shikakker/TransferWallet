import { Request, Response, NextFunction } from 'express';

export function validateStripeRequest(req: Request, res: Response, next: NextFunction) {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (currency && typeof currency !== 'string') {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  next();
}