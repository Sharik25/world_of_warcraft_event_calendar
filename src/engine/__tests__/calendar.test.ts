import type { EventCatalog, EventDefinition, Occurrence } from '@/domain/types';
import {
  dominantByDay,
  isShortEvent,
  layoutRibbons,
  monthWeeks,
  occurrencesByDay,
  spanDays,
  startOfWeek,
  weekDays,
} from '../calendar';

const def = (id: string, rarity: EventDefinition['rarity']): EventDefinition => ({
  id,
  name: id,
  category: 'holiday',
  rarity,
  themeId: id,
  summary: id,
});
const catalog: EventCatalog = {
  hallows: def('hallows', 'annual'),
  brewfest: def('brewfest', 'annual'),
  fishing: def('fishing', 'weekly'),
  dmf: def('dmf', 'monthly'),
};
const occ = (eventId: string, start: string, end: string): Occurrence => ({
  key: `v:${eventId}:${start}`,
  eventId,
  versionId: 'v',
  start: new Date(start),
  end: new Date(end),
  verified: true,
});
const TZ = 'Europe/Paris';

describe('weeks', () => {
  it('starts weeks on Sunday or Monday', () => {
    expect(startOfWeek('2026-10-27', 1)).toBe('2026-10-26'); // Tue → Mon
    expect(startOfWeek('2026-10-27', 0)).toBe('2026-10-25'); // Tue → Sun
    expect(startOfWeek('2026-10-25', 0)).toBe('2026-10-25');
    expect(startOfWeek('2026-10-25', 1)).toBe('2026-10-19'); // Sun → previous Mon
    expect(weekDays('2026-10-27', 1)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });

  it('covers a month with full weeks', () => {
    const oct = monthWeeks('2026-10', 1);
    expect(oct).toHaveLength(5);
    expect(oct[0]![0]).toBe('2026-09-28');
    expect(oct[4]![6]).toBe('2026-11-01');
    expect(monthWeeks('2026-08', 0)).toHaveLength(6); // Aug 1 2026 is a Saturday
    expect(monthWeeks('2027-02', 1)).toHaveLength(4); // Feb 2027 starts on a Monday
    expect(spanDays('2026-10-26', '2026-11-01')).toBe(7);
  });
});

const hallows = occ('hallows', '2026-10-18T08:00Z', '2026-11-01T09:00Z');
const fishing = occ('fishing', '2026-10-25T13:00Z', '2026-10-25T15:00Z');
const brewfest = occ('brewfest', '2026-09-20T08:00Z', '2026-10-06T08:00Z');
const dmf = occ('dmf', '2026-10-04T22:00Z', '2026-10-11T22:00Z');

describe('per-day lookups', () => {
  it('finds the dominant occurrence per day', () => {
    const map = dominantByDay(
      [hallows, fishing, brewfest],
      ['2026-10-17', '2026-10-25', '2026-10-05'],
      TZ,
      catalog,
    );
    expect(map.get('2026-10-17')).toBeNull();
    expect(map.get('2026-10-25')).toBe(hallows);
    expect(map.get('2026-10-05')).toBe(brewfest);
  });

  it('lists occurrences per day, dominant first', () => {
    const map = occurrencesByDay([fishing, hallows], ['2026-10-25', '2026-11-02'], TZ, catalog);
    expect(map.get('2026-10-25')).toEqual([hallows, fishing]);
    expect(map.get('2026-11-02')).toEqual([]);
  });
});

describe('layoutRibbons', () => {
  const week = weekDays('2026-10-05', 1); // Mon Oct 5 – Sun Oct 11

  it('spans columns and flags continuation beyond the row', () => {
    const segs = layoutRibbons([brewfest, dmf], week, TZ, catalog);
    const b = segs.find((s) => s.occurrence === brewfest)!;
    const d = segs.find((s) => s.occurrence === dmf)!;
    expect(b).toMatchObject({
      startCol: 0,
      endCol: 1,
      continuesBefore: true,
      continuesAfter: false,
    });
    // DMF: Mon Oct 5 00:00 → Mon Oct 12 00:00 local → exactly the 7 columns, no continuation.
    expect(d).toMatchObject({
      startCol: 0,
      endCol: 6,
      continuesBefore: false,
      continuesAfter: false,
    });
  });

  it('stacks overlapping ribbons in lanes, more dominant first', () => {
    const segs = layoutRibbons([dmf, brewfest], week, TZ, catalog);
    expect(segs.map((s) => [s.occurrence.eventId, s.lane])).toEqual([
      ['brewfest', 0], // annual beats monthly when both start in column 0
      ['dmf', 1],
    ]);
  });

  it('reuses a lane once the earlier ribbon has ended', () => {
    const a = occ('hallows', '2026-10-05T08:00Z', '2026-10-06T08:00Z'); // Mon–Tue
    const b = occ('brewfest', '2026-10-08T08:00Z', '2026-10-09T08:00Z'); // Thu–Fri
    const c = occ('fishing', '2026-10-05T13:00Z', '2026-10-05T15:00Z'); // Mon only
    const segs = layoutRibbons([a, b, c], week, TZ, catalog);
    expect(segs.map((s) => [s.occurrence.eventId, s.startCol, s.endCol, s.lane])).toEqual([
      ['hallows', 0, 1, 0],
      ['fishing', 0, 0, 1],
      ['brewfest', 3, 4, 0],
    ]);
  });

  it('orders same-start ribbons by dominance and ignores rows without days', () => {
    const short = occ('hallows', '2026-10-05T08:00Z', '2026-10-06T08:00Z');
    const long = occ('hallows', '2026-10-05T08:00Z', '2026-10-08T08:00Z');
    const segs = layoutRibbons([short, long], week, TZ, { hallows: def('hallows', 'annual') });
    expect(segs[0]!.occurrence).toBe(short); // shorter wins dominance (tie-breaker 3)
    expect(layoutRibbons([short], [], TZ, catalog)).toEqual([]);
  });

  it('classifies short events', () => {
    expect(isShortEvent(fishing)).toBe(true);
    expect(isShortEvent(hallows)).toBe(false);
  });
});
