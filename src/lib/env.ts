/**
 * lib/env.ts
 *
 * Validates all NEXT_PUBLIC_* environment variables once, at module load.
 * Import `env` from here instead of reading `process.env` directly.
 */

import { z } from 'zod';

const requiredString = (name: string) =>
  z
    .string({ required_error: `${name} is required` })
    .trim()
    .min(1, `${name} must not be empty`);

const requiredUrl = (name: string) =>
  requiredString(name).url(`${name} must be a valid URL`);

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: requiredUrl('NEXT_PUBLIC_API_URL').default('http://localhost:3000/api/v1'),
  NEXT_PUBLIC_STELLAR_NETWORK: z
    .enum(['testnet', 'mainnet'], {
      errorMap: () => ({ message: "NEXT_PUBLIC_STELLAR_NETWORK must be 'testnet' or 'mainnet'" }),
    })
    .default('testnet'),
  NEXT_PUBLIC_STELLAR_RPC_URL: requiredUrl('NEXT_PUBLIC_STELLAR_RPC_URL'),
  NEXT_PUBLIC_CONTRACT_ID: requiredString('NEXT_PUBLIC_CONTRACT_ID').regex(
    /^C[A-Z2-7]{55}$/,
    'NEXT_PUBLIC_CONTRACT_ID must be a valid Soroban contract address (56 chars, starts with C)',
  ),
  NEXT_PUBLIC_USDC_ADDRESS: requiredString('NEXT_PUBLIC_USDC_ADDRESS').regex(
    /^C[A-Z2-7]{55}$/,
    'NEXT_PUBLIC_USDC_ADDRESS must be a valid Soroban contract address (56 chars, starts with C)',
  ),
  NEXT_PUBLIC_LEDGERS_PER_DAY: z.coerce
    .number({ invalid_type_error: 'NEXT_PUBLIC_LEDGERS_PER_DAY must be a number' })
    .int('NEXT_PUBLIC_LEDGERS_PER_DAY must be an integer')
    .positive('NEXT_PUBLIC_LEDGERS_PER_DAY must be positive')
    .default(17280),
  NEXT_PUBLIC_IPFS_GATEWAY: requiredUrl('NEXT_PUBLIC_IPFS_GATEWAY').default('https://ipfs.io'),
});

export type Env = z.infer<typeof envSchema>;

/** Treat empty strings as unset so defaults/required checks apply. */
function clean(raw: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v === '' ? undefined : v]),
  );
}

/** Parse raw variables; throws one error listing every problem. */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(clean(raw));
  if (!result.success) {
    const lines = result.error.issues.map(
      (i) => `  - ${i.path.join('.') || 'env'}: ${i.message}`,
    );
    throw new Error(
      `Invalid environment variables:\n${lines.join('\n')}\n` +
        'Check your .env.local against .env.example.',
    );
  }
  return result.data;
}

// Next.js only inlines NEXT_PUBLIC_* vars on literal `process.env.NAME`
// access, so each one must be referenced explicitly here.
export const env: Env = parseEnv({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK,
  NEXT_PUBLIC_STELLAR_RPC_URL: process.env.NEXT_PUBLIC_STELLAR_RPC_URL,
  NEXT_PUBLIC_CONTRACT_ID: process.env.NEXT_PUBLIC_CONTRACT_ID,
  NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
  NEXT_PUBLIC_LEDGERS_PER_DAY: process.env.NEXT_PUBLIC_LEDGERS_PER_DAY,
  NEXT_PUBLIC_IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
});
