import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { VersionConfig } from '@/domain/types';
import { defaultSettings, useSettings } from '@/state/settings';
import { RegionSwitcher } from './RegionSwitcher';
import { ServerClock } from './ServerClock';

const version: VersionConfig = {
  id: 'anniversary',
  name: 'Anniversary',
  shortName: 'Anniversary',
  status: 'live',
  regions: [
    { id: 'us', label: 'Americas', timeZone: 'America/Los_Angeles' },
    { id: 'eu', label: 'Europe', timeZone: 'Europe/Paris' },
  ],
  defaultRegionId: 'eu',
  baseThemeId: 'base',
  events: [],
};

beforeEach(() => {
  localStorage.clear();
  useSettings.setState({ ...defaultSettings(), regionByVersion: { anniversary: 'eu' } });
});

describe('RegionSwitcher', () => {
  it('switches between Americas and Europe and updates the server clock', async () => {
    const user = userEvent.setup();
    render(
      <>
        <RegionSwitcher version={version} />
        <ServerClock version={version} />
      </>,
    );

    const group = screen.getByRole('group', { name: 'Server region' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Europe' })).toBeChecked();
    expect(screen.getByText('Europe server time')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Americas' }));

    expect(screen.getByRole('radio', { name: 'Americas' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Europe' })).not.toBeChecked();
    expect(screen.getByText('Americas server time')).toBeInTheDocument();
    expect(useSettings.getState().regionByVersion.anniversary).toBe('us');
  });

  it('renders nothing for a single-region version', () => {
    const { container } = render(
      <RegionSwitcher
        version={{ ...version, regions: [version.regions[0]!], defaultRegionId: 'us' }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
