import type { VersionConfig } from '@/domain/types';
import { expandOccurrences, findRegion, occurrenceKey } from '../expand';

const version: VersionConfig = {
  id: 'test',
  name: 'Test',
  shortName: 'Test',
  status: 'live',
  regions: [
    { id: 'us', label: 'Americas', timeZone: 'America/Los_Angeles' },
    { id: 'eu', label: 'Europe', timeZone: 'Europe/Paris' },
  ],
  defaultRegionId: 'eu',
  baseThemeId: 'base',
  events: [
    {
      eventId: 'holiday',
      rule: {
        kind: 'explicit',
        occurrences: [{ start: '2026-10-18T10:00', end: '2026-11-01T10:00', verified: true }],
      },
    },
    {
      eventId: 'fishing',
      rule: {
        kind: 'weekly',
        weekday: 0,
        startTime: '14:00',
        durationMinutes: 120,
        verified: true,
      },
      regionRules: {
        eu: {
          kind: 'weekly',
          weekday: 6,
          startTime: '14:00',
          durationMinutes: 120,
          verified: false,
        },
      },
    },
    // Same event bound twice with the same rule → duplicates collapse by key.
    {
      eventId: 'fishing',
      rule: {
        kind: 'weekly',
        weekday: 0,
        startTime: '14:00',
        durationMinutes: 120,
        verified: true,
      },
    },
  ],
};

const range = { start: new Date('2026-10-24T00:00Z'), end: new Date('2026-10-27T00:00Z') };

describe('expandOccurrences', () => {
  it('expands every binding in the region time zone, sorted by start', () => {
    const result = expandOccurrences(version, 'us', range);
    expect(result.map((o) => [o.eventId, o.start.toISOString()])).toEqual([
      ['holiday', '2026-10-18T17:00:00.000Z'],
      ['fishing', '2026-10-25T21:00:00.000Z'],
    ]);
    expect(result[1]).toEqual({
      key: 'test:fishing:2026-10-25T21:00:00.000Z',
      eventId: 'fishing',
      versionId: 'test',
      start: new Date('2026-10-25T21:00:00.000Z'),
      end: new Date('2026-10-25T23:00:00.000Z'),
      verified: true,
    });
  });

  it('applies per-region rule overrides', () => {
    const result = expandOccurrences(version, 'eu', range);
    expect(result.map((o) => [o.eventId, o.start.toISOString(), o.verified])).toEqual([
      ['holiday', '2026-10-18T08:00:00.000Z', true],
      ['fishing', '2026-10-24T12:00:00.000Z', false], // Saturday override
      ['fishing', '2026-10-25T13:00:00.000Z', true], // second binding, no override
    ]);
  });

  it('breaks start-time ties by event id', () => {
    const tie: VersionConfig = {
      ...version,
      events: [
        { eventId: 'b', rule: version.events[0]!.rule },
        { eventId: 'a', rule: version.events[0]!.rule },
      ],
    };
    expect(expandOccurrences(tie, 'eu', range).map((o) => o.eventId)).toEqual(['a', 'b']);
  });

  it('throws for an unknown region', () => {
    expect(() => expandOccurrences(version, 'oce', range)).toThrow(/Unknown region "oce"/);
    expect(findRegion(version, 'eu').timeZone).toBe('Europe/Paris');
  });

  it('builds stable keys', () => {
    expect(occurrenceKey('anniversary', 'hallows-end', new Date('2026-10-18T08:00:00Z'))).toBe(
      'anniversary:hallows-end:2026-10-18T08:00:00.000Z',
    );
  });
});
