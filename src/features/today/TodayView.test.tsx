import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSettings } from '@/state/settings';
import { renderRoute } from '@/test/renderRoute';

// User is in Europe/Paris (see vite.config.ts) → EU region is guessed.
const NOW = new Date('2026-10-27T11:00:00Z'); // Tue Oct 27, 12:00 Paris

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('routing', () => {
  it('redirects / to the last-used version Today', async () => {
    const { router } = renderRoute('/');
    expect(
      await screen.findByRole('heading', { level: 1, name: "Hallow's End" }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/anniversary/today');
  });

  it('shows Not Found for an unknown version or path', async () => {
    renderRoute('/retail/today');
    expect(
      await screen.findByRole('heading', { name: 'Lost in the Twisting Nether' }),
    ).toBeInTheDocument();
  });

  it('sends a malformed date to Today', async () => {
    const { router } = renderRoute('/anniversary/day/2026-02-31');
    await screen.findByRole('heading', { level: 1 });
    expect(router.state.location.pathname).toBe('/anniversary/today');
  });
});

describe('Today view', () => {
  it("shows Hallow's End as the dominant event with a live countdown", async () => {
    renderRoute('/anniversary/today');
    expect(
      await screen.findByRole('heading', { level: 1, name: "Hallow's End" }),
    ).toBeInTheDocument();
    // EU ends Nov 1 10:00 CET = 09:00Z → 4d 22h from 11:00Z Oct 27.
    expect(screen.getByText('Ends in 4d 22h')).toBeInTheDocument();
    expect(screen.queryByText('Unconfirmed')).not.toBeInTheDocument(); // verified date
    expect(screen.getByText('Trick-or-treat at innkeepers')).toBeInTheDocument();

    const soon = screen.getByRole('region', { name: 'Coming soon' });
    expect(within(soon).getByRole('link', { name: /Fishing in 5d/ })).toBeInTheDocument();
    expect(within(soon).getByRole('link', { name: /Darkmoon Faire in 12d/ })).toBeInTheDocument();
    expect(within(soon).queryByText(/Winter Veil/)).not.toBeInTheDocument(); // beyond 30 days
  });

  it('opens and closes the event sheet via ?event=', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/anniversary/today');
    await user.click(await screen.findByRole('link', { name: "Details for Hallow's End" }));

    const dialog = await screen.findByRole('dialog', { name: "Hallow's End" });
    expect(router.state.location.search).toBe('?event=hallows-end');
    // Both zones are Paris; the label reflects the start (Oct 18, still summer time).
    expect(within(dialog).getByText('Your time (GMT+2)')).toBeInTheDocument();
    expect(within(dialog).getByText('Europe server time (GMT+2)')).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Date source/ })).toHaveAttribute(
      'href',
      expect.stringContaining('warcrafttavern.com'),
    );

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(router.state.location.search).toBe('');
  });

  it('picks Fireworks over Midsummer on Jul 4 and lists Midsummer as also on', async () => {
    renderRoute('/anniversary/day/2026-07-04');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Fireworks Spectacular' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Unconfirmed').length).toBeGreaterThan(0);
    const also = screen.getByRole('region', { name: 'Also on this day' });
    expect(within(also).getByRole('link', { name: 'Midsummer Fire Festival' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to today/ })).toBeInTheDocument();
  });

  it('shows a quiet day, with coming-soon distances counted from that day', async () => {
    renderRoute('/anniversary/day/2026-11-24');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'A quiet day at the inn' }),
    ).toBeInTheDocument();
    const soon = screen.getByRole('region', { name: 'Coming soon' });
    // Next fishing is Sun Nov 29 14:00 → 5 days after the start of Nov 24, not 33 days from now.
    expect(within(soon).getByRole('link', { name: /Fishing in 5d/ })).toBeInTheDocument();
  });

  it('shows countdowns only on Today', async () => {
    renderRoute('/anniversary/day/2026-11-15');
    await screen.findByRole('heading', { level: 1, name: 'Darkmoon Faire' });
    expect(screen.queryByText(/Starts in|Ends in/)).not.toBeInTheDocument();
  });

  it('opens a secondary event from its card', async () => {
    const user = userEvent.setup();
    renderRoute('/anniversary/day/2026-11-15'); // DMF Sunday + fishing
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Darkmoon Faire' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Stranglethorn Fishing Extravaganza' }));
    expect(
      await screen.findByRole('dialog', { name: 'Stranglethorn Fishing Extravaganza' }),
    ).toBeInTheDocument();
  });

  it('navigates days with arrows and keyboard shortcuts', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/anniversary/today');
    await screen.findByRole('heading', { level: 1 });

    await user.click(screen.getByRole('link', { name: 'Next day' }));
    expect(router.state.location.pathname).toBe('/anniversary/day/2026-10-28');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(router.state.location.pathname).toBe('/anniversary/day/2026-10-26');

    await user.keyboard('t');
    expect(router.state.location.pathname).toBe('/anniversary/today');
  });

  it('follows the selected region', async () => {
    const user = userEvent.setup();
    renderRoute('/anniversary/today');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('button', { name: 'Anniversary · Europe' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.click(await screen.findByRole('radio', { name: 'Americas' }));
    expect(useSettings.getState().regionByVersion.anniversary).toBe('us');
    await user.keyboard('{Escape}');
    // US ends Nov 1 10:00 PST = 18:00Z → 5d 7h.
    expect(await screen.findByText('Ends in 5d 7h')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anniversary · Americas' })).toBeInTheDocument();
  });

  it('ticks the countdown each minute', async () => {
    vi.useRealTimers();
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(new Date('2026-10-27T10:59:30Z'));
    renderRoute('/anniversary/today');
    await vi.waitFor(() => screen.getByText('Ends in 4d 22h'));
    act(() => {
      vi.advanceTimersByTime(60 * 60_000);
    });
    expect(screen.getByText('Ends in 4d 21h')).toBeInTheDocument();
  });
});
