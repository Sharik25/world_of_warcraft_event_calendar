/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deterministic "user" time zone for component tests (workers inherit it at spawn).
if (process.env.VITEST) process.env.TZ = 'Europe/Paris';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    coverage: {
      provider: 'v8',
      include: ['src/engine/**'],
      exclude: ['src/engine/**/__tests__/**'],
      thresholds: { 'src/engine/**': { lines: 90, functions: 90, branches: 90, statements: 90 } },
    },
  },
});
