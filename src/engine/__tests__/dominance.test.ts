import type { EventCatalog, EventDefinition, Occurrence, Rarity } from '@/domain/types';
import { compareDominance, occurrencesOnDay, pickDominant, RARITY_WEIGHT } from '../dominance';

const def = (id: string, rarity: Rarity, priority?: number): EventDefinition => ({
  id,
  name: id,
  category: 'holiday',
  rarity,
  themeId: id,
  summary: id,
  ...(priority !== undefined && { priority }),
});

const catalog: EventCatalog = Object.fromEntries(
  [
    def('midsummer', 'annual'),
    def('fireworks', 'annual'),
    def('dmf', 'monthly'),
    def('fishing', 'weekly'),
    def('important', 'annual', 1),
    def('alpha', 'annual'),
    def('beta', 'annual'),
    def('once', 'once'),
    def('season', 'seasonal'),
  ].map((d) => [d.id, d]),
);

const occ = (eventId: string, start: string, end: string): Occurrence => ({
  key: `v:${eventId}:${start}`,
  eventId,
  versionId: 'v',
  start: new Date(start),
  end: new Date(end),
  verified: true,
});

describe('pickDominant', () => {
  it('returns null when nothing is active', () => {
    expect(pickDominant([], catalog)).toBeNull();
  });

  it('1. rarity: monthly faire beats weekly fishing', () => {
    const dmf = occ('dmf', '2026-11-09T00:00Z', '2026-11-16T00:00Z');
    const fishing = occ('fishing', '2026-11-15T14:00Z', '2026-11-15T16:00Z');
    expect(pickDominant([fishing, dmf], catalog)).toBe(dmf);
  });

  it('weights rarities once > annual > seasonal > monthly > weekly', () => {
    expect(
      Object.entries(RARITY_WEIGHT)
        .sort((a, b) => b[1] - a[1])
        .map(([r]) => r),
    ).toEqual(['once', 'annual', 'seasonal', 'monthly', 'weekly']);
    const all = ['fishing', 'dmf', 'season', 'midsummer', 'once'].map((id) =>
      occ(id, '2026-07-01T00:00Z', '2026-07-02T00:00Z'),
    );
    expect(pickDominant(all, catalog)?.eventId).toBe('once');
  });

  it('2. priority breaks a rarity tie', () => {
    const plain = occ('alpha', '2026-07-01T00:00Z', '2026-07-02T00:00Z');
    const important = occ('important', '2026-07-01T00:00Z', '2026-07-08T00:00Z');
    expect(pickDominant([plain, important], catalog)).toBe(important);
  });

  it('3. shorter duration wins: Fireworks over Midsummer on Jul 4', () => {
    const midsummer = occ('midsummer', '2026-06-21T08:00Z', '2026-07-05T08:00Z');
    const fireworks = occ('fireworks', '2026-07-04T08:00Z', '2026-07-05T08:00Z');
    expect(pickDominant([midsummer, fireworks], catalog)).toBe(fireworks);
  });

  it('4. earlier start breaks a duration tie', () => {
    const later = occ('alpha', '2026-07-02T00:00Z', '2026-07-03T00:00Z');
    const earlier = occ('beta', '2026-07-01T00:00Z', '2026-07-02T00:00Z');
    expect(pickDominant([later, earlier], catalog)).toBe(earlier);
  });

  it('5. event id breaks a full tie deterministically', () => {
    const b = occ('beta', '2026-07-01T00:00Z', '2026-07-02T00:00Z');
    const a = occ('alpha', '2026-07-01T00:00Z', '2026-07-02T00:00Z');
    expect(pickDominant([b, a], catalog)).toBe(a);
  });

  it('ranks events missing from the catalog last', () => {
    const ghost = occ('ghost', '2026-07-01T00:00Z', '2026-07-01T01:00Z');
    const fishing = occ('fishing', '2026-07-01T00:00Z', '2026-07-02T00:00Z');
    expect(pickDominant([ghost, fishing], catalog)).toBe(fishing);
    expect(pickDominant([fishing, ghost], catalog)).toBe(fishing);
    expect([ghost, fishing].sort(compareDominance(catalog))[1]).toBe(ghost);
  });
});

describe('occurrencesOnDay', () => {
  // US Hallow's End: Oct 18 10:00 PDT → Nov 1 10:00 PST.
  const hallows = occ('alpha', '2026-10-18T17:00Z', '2026-11-01T18:00Z');
  const fishing = occ('fishing', '2026-10-25T21:00Z', '2026-10-25T23:00Z');

  it('includes a multi-day event on every local day it intersects', () => {
    expect(occurrencesOnDay([hallows], '2026-10-18', 'Asia/Jerusalem', catalog)).toEqual([hallows]);
    expect(occurrencesOnDay([hallows], '2026-11-01', 'Asia/Jerusalem', catalog)).toEqual([hallows]);
    expect(occurrencesOnDay([hallows], '2026-11-02', 'Asia/Jerusalem', catalog)).toEqual([]);
  });

  it('uses the user time zone, so the first day can differ by zone', () => {
    // In UTC+14 the start is already Oct 19, 07:00.
    expect(occurrencesOnDay([hallows], '2026-10-18', 'Pacific/Kiritimati', catalog)).toEqual([]);
    expect(occurrencesOnDay([hallows], '2026-10-19', 'Pacific/Kiritimati', catalog)).toEqual([
      hallows,
    ]);
  });

  it('orders the day most dominant first', () => {
    expect(occurrencesOnDay([fishing, hallows], '2026-10-25', 'Europe/Paris', catalog)).toEqual([
      hallows,
      fishing,
    ]);
  });
});
