import { expect, test } from '@playwright/test';

test.describe('/dev/ui gallery', () => {
  test('renders both themes without horizontal scroll', async ({ page }) => {
    await page.goto('/dev/ui');
    await expect(page.getByRole('heading', { level: 1, name: 'Design system' })).toBeVisible();
    await expect(page.getByTestId('gallery-hallows-end')).toHaveAttribute(
      'data-theme',
      'hallows-end',
    );
    await expect(page.getByRole('navigation', { name: 'Views and actions' })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('sheet opens with the column theme and closes', async ({ page }) => {
    await page.goto('/dev/ui');
    const column = page.getByTestId('gallery-hallows-end');
    await column.getByRole('button', { name: 'Open sheet' }).click();

    const dialog = page.getByRole('dialog', { name: "Event: Hallow's End sheet" });
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-theme="hallows-end"]:has([role="dialog"])')).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await column.getByRole('button', { name: 'Open sheet' }).click();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
  });

  test('action bar slots are at least 48×48', async ({ page }) => {
    await page.goto('/dev/ui');
    const bar = page.getByRole('navigation', { name: 'Views and actions' });
    for (const slot of await bar.getByRole('button').all()) {
      const box = await slot.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(48);
      expect(box?.height).toBeGreaterThanOrEqual(48);
    }
  });
});

test('mobile: sheet closes when dragged down', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'drag handle is mobile-only');
  await page.goto('/dev/ui');
  await page.getByTestId('gallery-base').getByRole('button', { name: 'Open sheet' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Touch drag on the grip, as a phone sends it (pointer events with pointerType "touch").
  const handle = dialog.locator('[class*="handle"]');
  const box = (await handle.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const pointer = { pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: x };
  await handle.dispatchEvent('pointerdown', { ...pointer, clientY: y });
  for (const dy of [40, 90, 160, 220]) {
    await handle.dispatchEvent('pointermove', { ...pointer, clientY: y + dy });
  }
  await handle.dispatchEvent('pointerup', { ...pointer, clientY: y + 220 });
  await expect(dialog).toBeHidden();
});
