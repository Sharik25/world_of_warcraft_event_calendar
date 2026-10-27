import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderRoute } from '@/test/renderRoute';

const NOW = new Date('2026-10-27T11:00:00Z'); // Tue Oct 27, 12:00 Paris
const monday = { weekStartsOn: 1 as const };

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
  window.__desktop = false;
});

afterEach(() => {
  vi.useRealTimers();
  window.__desktop = false;
});

describe('Week view', () => {
  it('normalizes any date to the first day of its week', async () => {
    const { router } = renderRoute('/anniversary/week/2026-10-29', monday);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Oct 26 – Nov 1, 2026' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/anniversary/week/2026-10-26');
  });

  it('honours a Sunday week start', async () => {
    const { router } = renderRoute('/anniversary/week', { weekStartsOn: 0 });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Oct 25 – 31, 2026' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/anniversary/week/2026-10-25');
  });

  it('mobile: lists 7 days with event chips that open the sheet for that day', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/anniversary/week/2026-10-26', monday);
    await screen.findByRole('heading', { level: 1 });

    const rows = screen.getAllByRole('listitem').filter((li) => li.querySelector('a[aria-label]'));
    expect(rows).toHaveLength(7);
    const sunday = rows[6]!;
    expect(within(sunday).getByRole('link', { name: 'Sunday, November 1' })).toBeInTheDocument();
    expect(within(sunday).getByRole('link', { name: /Hallow's End/ })).toBeInTheDocument();
    await user.click(within(sunday).getByRole('link', { name: /Fishing/ }));

    expect(router.state.location.search).toBe('?event=stv-fishing&on=2026-11-01');
    const dialog = await screen.findByRole('dialog', {
      name: 'Stranglethorn Fishing Extravaganza',
    });
    // The sheet is about Nov 1's contest (14:00 CET = 13:00Z), not a later one.
    expect(within(dialog).getByText('Starts in 5d 2h')).toBeInTheDocument();
  });

  it('desktop: ribbons for multi-day events and timed blocks for short ones', async () => {
    window.__desktop = true;
    renderRoute('/anniversary/week/2026-10-26', monday);
    await screen.findByRole('heading', { level: 1 });
    const ribbon = screen.getByRole('link', { name: "Hallow's End" });
    expect(ribbon.parentElement).toHaveStyle({ gridColumn: '1 / 8' });
    expect(
      screen.getByRole('link', { name: /14:00\s*Stranglethorn Fishing Extravaganza/ }),
    ).toBeInTheDocument();
  });
});

describe('Month view', () => {
  it('tints each day by its dominant event and marks today', async () => {
    renderRoute('/anniversary/month/2026-10', monday);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'October 2026' }),
    ).toBeInTheDocument();

    const cell = (date: string) => document.querySelector(`[data-date="${date}"]`) as HTMLElement;
    for (const date of ['2026-10-18', '2026-10-27', '2026-10-31']) {
      expect(cell(date)).toHaveAttribute('data-theme', 'hallows-end');
    }
    expect(cell('2026-10-17')).not.toHaveAttribute('data-has-events');
    expect(cell('2026-10-17')).toHaveAttribute('data-theme', 'base');
    expect(cell('2026-10-27')).toHaveAttribute('data-today');
    expect(cell('2026-09-28')).toHaveAttribute('data-outside');
    expect(
      screen.getByRole('button', { name: "Tuesday, October 27: Hallow's End" }),
    ).toHaveAttribute('aria-current', 'date');
  });

  it('tapping a day opens its Day sheet', async () => {
    const user = userEvent.setup();
    renderRoute('/anniversary/month/2026-11', monday);
    await screen.findByRole('heading', { level: 1, name: 'November 2026' });
    await user.click(
      screen.getByRole('button', {
        name: 'Sunday, November 15: Darkmoon Faire, Stranglethorn Fishing Extravaganza',
      }),
    );
    const sheet = await screen.findByRole('dialog', { name: 'Sunday, November 15' });
    expect(within(sheet).getByRole('link', { name: 'Darkmoon Faire' })).toHaveAttribute(
      'href',
      '/anniversary/day/2026-11-15?event=darkmoon-faire',
    );
    expect(within(sheet).getByRole('link', { name: 'Open day view' })).toHaveAttribute(
      'href',
      '/anniversary/day/2026-11-15',
    );
  });

  it('redirects a malformed month to the current one', async () => {
    const { router } = renderRoute('/anniversary/month/2026-13', monday);
    await screen.findByRole('heading', { level: 1, name: 'October 2026' });
    expect(router.state.location.pathname).toBe('/anniversary/month/2026-10');
  });
});

describe('navigation between views', () => {
  it('action bar keeps the date; keys 1/2/3, arrows and T work across views', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/anniversary/day/2026-11-15', monday);
    await screen.findByRole('heading', { level: 1, name: 'Darkmoon Faire' });

    const bar = screen.getByRole('navigation', { name: 'Views and actions' });
    expect(within(bar).queryByRole('button', { name: 'More' })).not.toBeInTheDocument();
    expect(within(bar).getByRole('link', { name: 'Week' })).toHaveAttribute(
      'href',
      '/anniversary/week/2026-11-09',
    );
    expect(within(bar).getByRole('link', { name: 'Month' })).toHaveAttribute(
      'href',
      '/anniversary/month/2026-11',
    );

    // Like a person, wait for each view to render before pressing the next key.
    const press = async (key: string, path: string, title: string) => {
      await user.keyboard(key);
      expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(router.state.location.pathname).toBe(path);
    };
    await press('3', '/anniversary/month/2026-11', 'November 2026');
    await press('{ArrowRight}', '/anniversary/month/2026-12', 'December 2026');
    await press('2', '/anniversary/week/2026-11-30', 'Nov 30 – Dec 6, 2026');
    await press('{ArrowLeft}', '/anniversary/week/2026-11-23', 'Nov 23 – 29, 2026');
    await press('t', '/anniversary/week/2026-10-26', 'Oct 26 – Nov 1, 2026');
    await press('1', '/anniversary/today', "Hallow's End");
  });
});
