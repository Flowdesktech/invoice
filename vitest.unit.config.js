import { defineConfig } from 'vitest/config';

// Unit tests run without the puppeteer/dev-server setup used by the e2e suite.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
    exclude: ['node_modules/**'],
  },
});
