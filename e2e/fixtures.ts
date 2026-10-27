import { test as base } from '@playwright/test';

/** Tue Oct 27 2026, 12:00 in Paris: Hallow's End is running. */
export const NOW = new Date('2026-10-27T11:00:00Z');

export const test = base.extend<{ fixedClock: undefined }>({
  fixedClock: [
    async ({ page }, use) => {
      await page.clock.setFixedTime(NOW);
      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
