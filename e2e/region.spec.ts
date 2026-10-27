import { expect, test } from './fixtures';

test('region switcher toggles Americas/Europe and remembers the choice', async ({ page }) => {
  await page.goto('/anniversary/today');
  await expect(page.getByRole('button', { name: 'Anniversary · Europe' })).toBeVisible();
  await expect(page.getByText('Ends in 4d 22h')).toBeVisible();

  await page.getByRole('button', { name: 'Settings' }).click();
  const sheet = page.getByRole('dialog', { name: 'Settings & info' });
  await sheet.getByRole('radio', { name: 'Americas' }).click();
  await expect(sheet.getByText('Americas server time')).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(page.getByRole('button', { name: 'Anniversary · Americas' })).toBeVisible();
  await expect(page.getByText('Ends in 5d 7h')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: 'Anniversary · Americas' })).toBeVisible();
});

test('region options are at least 48px tall', async ({ page }) => {
  await page.goto('/anniversary/today');
  await page.getByRole('button', { name: 'Settings' }).click();
  const box = await page.getByText('Americas', { exact: true }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(48);
});
