import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ICAL from 'ical.js';
import { renderRoute } from '@/test/renderRoute';
import { feedUrls } from './feedUrls';

const NOW = new Date('2026-10-27T11:00:00Z');

/** Captures what downloadText() would save. */
function captureDownloads() {
  const files: { name: string; text: Promise<string> }[] = [];
  vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
    files.push({ name: '', text: (blob as Blob).text() });
    return 'blob:test';
  });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    const last = files[files.length - 1];
    if (last) last.name = this.download;
  });
  return files;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Add to calendar', () => {
  it('hero menu: Google link and a single-event .ics', async () => {
    const user = userEvent.setup();
    const files = captureDownloads();
    renderRoute('/anniversary/today');
    await screen.findByRole('heading', { level: 1, name: "Hallow's End" });

    const trigger = screen.getByRole('button', { name: 'Add to calendar' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const google = new URL(
      screen.getByRole('link', { name: 'Google Calendar' }).getAttribute('href') ?? '',
    );
    expect(google.searchParams.get('text')).toBe("Hallow's End");
    expect(google.searchParams.get('dates')).toBe('20261018T080000Z/20261101T090000Z');

    await user.click(screen.getByRole('button', { name: 'Apple / Outlook (.ics)' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(files[0]?.name).toBe('hallows-end-2026-10-18.ics');
    const cal = new ICAL.Component(ICAL.parse(await files[0]!.text));
    const event = new ICAL.Event(cal.getFirstSubcomponent('vevent')!);
    expect(event.uid).toBe('anniversary:hallows-end:2026-10-18T08:00:00.000Z@innkeepers-almanac');
    expect(event.description).toContain(
      'http://localhost:3000/anniversary/day/2026-10-18?event=hallows-end',
    );
  });

  it('menu closes on Escape and outside clicks', async () => {
    const user = userEvent.setup();
    renderRoute('/anniversary/today');
    await screen.findByRole('heading', { level: 1 });
    const trigger = screen.getByRole('button', { name: 'Add to calendar' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    await user.click(screen.getByRole('heading', { level: 1 }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Subscribe', () => {
  it('builds feed URLs for the version and region', () => {
    const urls = feedUrls(
      { id: 'anniversary' } as never,
      { id: 'eu', label: 'Europe', timeZone: 'Europe/Paris' },
      'https://almanac.example',
    );
    expect(urls).toEqual({
      path: '/calendars/anniversary-eu.ics',
      https: 'https://almanac.example/calendars/anniversary-eu.ics',
      webcal: 'webcal://almanac.example/calendars/anniversary-eu.ics',
      google:
        'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Falmanac.example%2Fcalendars%2Fanniversary-eu.ics',
    });
  });

  it('settings show the feed with copy, and fall back to download without HTTPS', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderRoute('/anniversary/today');
    await screen.findByRole('heading', { level: 1 });
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    const sheet = await screen.findByRole('dialog', { name: 'Settings & info' });

    expect(
      within(sheet).getByRole('heading', { name: 'Subscribe to all events' }),
    ).toBeInTheDocument();
    const field = within(sheet).getByRole('textbox', { name: 'Feed address' });
    expect(field).toHaveValue('http://localhost:3000/calendars/anniversary-eu.ics');
    await user.click(within(sheet).getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('http://localhost:3000/calendars/anniversary-eu.ics');
    await waitFor(() =>
      expect(within(sheet).getByRole('button', { name: 'Copied!' })).toBeInTheDocument(),
    );

    // jsdom runs on http: → no webcal buttons, explain and offer the file.
    expect(within(sheet).queryByRole('link', { name: 'Apple Calendar' })).not.toBeInTheDocument();
    expect(within(sheet).getByText(/published site \(HTTPS\)/)).toBeInTheDocument();
    expect(within(sheet).getByRole('link', { name: 'Download .ics instead' })).toHaveAttribute(
      'href',
      '/calendars/anniversary-eu.ics',
    );
  });
});
