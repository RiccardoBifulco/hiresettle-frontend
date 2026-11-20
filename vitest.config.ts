import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    env: {
      NEXT_PUBLIC_STELLAR_RPC_URL: 'https://soroban-testnet.stellar.org',
      NEXT_PUBLIC_CONTRACT_ID: 'C' + 'A'.repeat(55),
      NEXT_PUBLIC_USDC_ADDRESS: 'C' + 'A'.repeat(55),
    },
  },
});
