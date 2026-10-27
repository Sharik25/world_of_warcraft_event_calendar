import { expect, test } from '@playwright/test';

test('region switcher toggles Americas/Europe and remembers the choice', async ({ page }) => {
  await page.goto('/');
  const americas = page.getByRole('radio', { name: 'Americas' });
  const europe = page.getByRole('radio', { name: 'Europe' });

  await europe.click();
  await expect(europe).toBeChecked();
  await expect(page.getByText('Europe server time')).toBeVisible();

  await americas.click();
  await expect(americas).toBeChecked();
  await expect(page.getByText('Americas server time')).toBeVisible();

  await page.reload();
  await expect(americas).toBeChecked();
});

test('region options are at least 48px tall', async ({ page }) => {
  await page.goto('/');
  const box = await page.getByText('Americas', { exact: true }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(48);
});
