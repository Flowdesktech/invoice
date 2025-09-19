import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/e2e/setup-vitest.js'],
    globalSetup: './tests/e2e/globalSetup.js',
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['tests/e2e/**/*.test.js'],
    exclude: ['node_modules/**'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Run tests sequentially for E2E
      },
    },
  },
});
