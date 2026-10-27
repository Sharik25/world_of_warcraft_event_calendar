import { readFileSync } from 'node:fs';
import ICAL from 'ical.js';
import { expect, test } from './fixtures';

function parseEvents(ics: string) {
  const cal = new ICAL.Component(ICAL.parse(ics));
  return { cal, events: cal.getAllSubcomponents('vevent').map((c) => new ICAL.Event(c)) };
}

test('hero "Add to calendar": Google link and a valid single-event .ics', async ({ page }) => {
  await page.goto('/anniversary/today');
  await page.getByRole('button', { name: 'Add to calendar' }).click();

  const google = new URL(
    (await page.getByRole('link', { name: 'Google Calendar' }).getAttribute('href')) ?? '',
  );
  expect(google.hostname).toBe('calendar.google.com');
  expect(google.searchParams.get('dates')).toBe('20261018T080000Z/20261101T090000Z');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Apple / Outlook (.ics)' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('hallows-end-2026-10-18.ics');
  const { events } = parseEvents(readFileSync((await download.path())!, 'utf8'));
  expect(events).toHaveLength(1);
  expect(events[0]?.uid).toBe(
    'anniversary:hallows-end:2026-10-18T08:00:00.000Z@innkeepers-almanac',
  );
  expect(events[0]?.summary).toBe("Hallow's End");
});

test('subscription feeds are served as text/calendar and parse', async ({ request }) => {
  for (const region of ['eu', 'us']) {
    const res = await request.get(`/calendars/anniversary-${region}.ics`);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/calendar');
    const { cal, events } = parseEvents(await res.text());
    expect(cal.getFirstPropertyValue('x-wr-calname')).toContain('Anniversary');
    expect(events.length).toBeGreaterThan(50);
    expect(new Set(events.map((e) => e.uid)).size).toBe(events.length);
  }
});

test('settings offer the feed for the selected region', async ({ page }) => {
  await page.goto('/anniversary/today');
  await page.getByRole('button', { name: 'Settings' }).click();
  const sheet = page.getByRole('dialog', { name: 'Settings & info' });
  await expect(sheet.getByRole('textbox', { name: 'Feed address' })).toHaveValue(
    /\/calendars\/anniversary-eu\.ics$/,
  );
  await sheet.getByRole('radio', { name: 'Americas' }).click();
  await expect(sheet.getByRole('textbox', { name: 'Feed address' })).toHaveValue(
    /\/calendars\/anniversary-us\.ics$/,
  );
  // The local preview runs on http, so it offers the file instead of webcal links.
  await expect(sheet.getByRole('link', { name: 'Download .ics instead' })).toHaveAttribute(
    'href',
    '/calendars/anniversary-us.ics',
  );
});
