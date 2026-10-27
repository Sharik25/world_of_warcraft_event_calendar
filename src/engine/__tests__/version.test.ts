import type { VersionConfig } from '@/domain/types';
import { launchInstant, switchVersionPath, versionStatus } from '../version';

const forever: VersionConfig = {
  id: 'forever',
  name: 'WoW: Forever',
  shortName: 'Forever',
  status: 'upcoming',
  launchDate: '2026-11-04T15:00:00-08:00',
  regions: [{ id: 'global', label: 'All realms', timeZone: 'America/Los_Angeles' }],
  defaultRegionId: 'global',
  baseThemeId: 'forever',
  events: [],
};

describe('version status', () => {
  it('parses the launch instant', () => {
    expect(launchInstant(forever)?.toISOString()).toBe('2026-11-04T23:00:00.000Z');
    expect(launchInstant({ launchDate: '2026-11-04' })?.toISOString()).toBe(
      '2026-11-04T00:00:00.000Z',
    );
    expect(launchInstant({})).toBeNull();
    expect(launchInstant({ launchDate: 'soon' })).toBeNull();
  });

  it('turns an upcoming version live at launch time', () => {
    expect(versionStatus(forever, new Date('2026-11-04T22:59:59Z'))).toBe('upcoming');
    expect(versionStatus(forever, new Date('2026-11-04T23:00:00Z'))).toBe('live');
    expect(versionStatus({ ...forever, launchDate: undefined }, new Date('2030-01-01'))).toBe(
      'upcoming',
    );
    expect(versionStatus({ ...forever, status: 'live' }, new Date('2000-01-01'))).toBe('live');
    expect(versionStatus({ ...forever, status: 'retired' }, new Date('2030-01-01'))).toBe(
      'retired',
    );
  });
});

describe('switchVersionPath', () => {
  it('keeps the view and date', () => {
    expect(switchVersionPath('/anniversary/week/2026-10-25', 'anniversary', 'forever')).toBe(
      '/forever/week/2026-10-25',
    );
    expect(switchVersionPath('/anniversary/today', 'anniversary', 'forever')).toBe(
      '/forever/today',
    );
    expect(switchVersionPath('/anniversary', 'anniversary', 'forever')).toBe('/forever');
  });

  it('falls back to Today for unrelated paths', () => {
    expect(switchVersionPath('/anniversaryx/today', 'anniversary', 'forever')).toBe(
      '/forever/today',
    );
  });
});
