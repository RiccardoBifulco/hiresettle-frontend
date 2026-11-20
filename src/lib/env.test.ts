import { describe, it, expect } from 'vitest';
import { parseEnv } from './env';

const CONTRACT = 'C' + 'A'.repeat(55);
const valid = {
  NEXT_PUBLIC_STELLAR_RPC_URL: 'https://soroban-testnet.stellar.org',
  NEXT_PUBLIC_CONTRACT_ID: CONTRACT,
  NEXT_PUBLIC_USDC_ADDRESS: CONTRACT,
};

describe('parseEnv', () => {
  it('parses valid variables and applies defaults', () => {
    const env = parseEnv(valid);
    expect(env.NEXT_PUBLIC_STELLAR_NETWORK).toBe('testnet');
    expect(env.NEXT_PUBLIC_LEDGERS_PER_DAY).toBe(17280);
    expect(env.NEXT_PUBLIC_IPFS_GATEWAY).toBe('https://ipfs.io');
    expect(env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api/v1');
  });

  it('names every missing required variable', () => {
    expect(() => parseEnv({})).toThrow(/NEXT_PUBLIC_STELLAR_RPC_URL/);
    expect(() => parseEnv({})).toThrow(/NEXT_PUBLIC_CONTRACT_ID/);
    expect(() => parseEnv({})).toThrow(/NEXT_PUBLIC_USDC_ADDRESS/);
  });

  it('treats empty strings as missing', () => {
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_STELLAR_RPC_URL: '' })).toThrow(
      /NEXT_PUBLIC_STELLAR_RPC_URL/,
    );
  });

  it('rejects malformed values', () => {
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_STELLAR_RPC_URL: 'nope' })).toThrow(/valid URL/);
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_CONTRACT_ID: 'CXXX' })).toThrow(
      /NEXT_PUBLIC_CONTRACT_ID/,
    );
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_STELLAR_NETWORK: 'devnet' })).toThrow(
      /NEXT_PUBLIC_STELLAR_NETWORK/,
    );
    expect(() => parseEnv({ ...valid, NEXT_PUBLIC_LEDGERS_PER_DAY: 'abc' })).toThrow(
      /NEXT_PUBLIC_LEDGERS_PER_DAY/,
    );
  });
});
