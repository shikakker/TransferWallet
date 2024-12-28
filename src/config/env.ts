import { z } from 'zod';

/**
 * Environment variable validation schema
 */
const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  TRON_PRIVATE_KEY: z.string().optional(),
  TRON_NETWORK: z.enum(['mainnet', 'testnet']).default('mainnet'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validate environment variables
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  return result.data;
}