// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/client/src/**/*.test.ts', 'packages/server/src/**/*.test.ts'],
    environmentMatchGlobs: [
      ['packages/client/**', 'jsdom'],
      ['packages/server/**', 'node'],
    ],
    globals: true,
  },
});
