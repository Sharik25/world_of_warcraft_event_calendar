import { fileURLToPath } from 'node:url';
import { runnerImport } from 'vite';
import type * as DataEntryModule from './data-entry';

export type DataEntry = typeof DataEntryModule;

/**
 * Loads app data through Vite's module runner so Vite-only features used by data modules
 * (`import.meta.glob`, the `@/` alias) work exactly as they do in the app and in Vitest.
 */
export async function loadData(): Promise<DataEntry> {
  const { module } = await runnerImport<DataEntry>(
    fileURLToPath(new URL('./data-entry.ts', import.meta.url)),
    {
      logLevel: 'error',
      resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
    },
  );
  return module;
}
