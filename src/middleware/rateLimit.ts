import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware configuration
 */
export const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many payment requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const walletRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many wallet requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});