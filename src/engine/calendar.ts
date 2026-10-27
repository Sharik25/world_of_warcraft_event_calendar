import type { DateRange, EventCatalog, Occurrence } from '@/domain/types';
import { compareDominance } from './dominance';
import {
  addDays,
  addMonths,
  dayRange,
  daysBetween,
  intersects,
  type LocalDate,
  type LocalMonth,
  weekdayOf,
} from './time';

export type WeekStart = 0 | 1; // Sunday | Monday

/** First day of the week containing `date`. */
export function startOfWeek(date: LocalDate, weekStartsOn: WeekStart): LocalDate {
  return addDays(date, -((weekdayOf(date) - weekStartsOn + 7) % 7));
}

/** The 7 dates of the week containing `date`. */
export function weekDays(date: LocalDate, weekStartsOn: WeekStart): LocalDate[] {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Full weeks covering a month (4–6 rows of 7 dates, including adjacent-month days). */
export function monthWeeks(month: LocalMonth, weekStartsOn: WeekStart): LocalDate[][] {
  const first = `${month}-01`;
  const last = addDays(`${addMonths(month, 1)}-01`, -1);
  const weeks: LocalDate[][] = [];
  for (let day = startOfWeek(first, weekStartsOn); day <= last; day = addDays(day, 7)) {
    weeks.push(weekDays(day, weekStartsOn));
  }
  return weeks;
}

/** Most dominant occurrence per date (null on quiet days). */
export function dominantByDay(
  occurrences: Occurrence[],
  dates: LocalDate[],
  timeZone: string,
  catalog: EventCatalog,
): Map<LocalDate, Occurrence | null> {
  const compare = compareDominance(catalog);
  return new Map(
    dates.map((date) => {
      const range = dayRange(date, timeZone);
      const on = occurrences.filter((o) => intersects(o, range)).sort(compare);
      return [date, on[0] ?? null];
    }),
  );
}

/** Occurrences per date, most dominant first. */
export function occurrencesByDay(
  occurrences: Occurrence[],
  dates: LocalDate[],
  timeZone: string,
  catalog: EventCatalog,
): Map<LocalDate, Occurrence[]> {
  const compare = compareDominance(catalog);
  return new Map(
    dates.map((date) => {
      const range = dayRange(date, timeZone);
      return [date, occurrences.filter((o) => intersects(o, range)).sort(compare)];
    }),
  );
}

export interface RibbonSegment {
  occurrence: Occurrence;
  /** First and last column (0-based, inclusive) the occurrence covers in this row. */
  startCol: number;
  endCol: number;
  /** Vertical slot; 0 is the top lane. */
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

/**
 * Lays out occurrences as horizontal ribbons across one row of consecutive days.
 * Lanes are assigned greedily: earlier start first, then more dominant, then longer span.
 */
export function layoutRibbons(
  occurrences: Occurrence[],
  days: LocalDate[],
  timeZone: string,
  catalog: EventCatalog,
): RibbonSegment[] {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return [];
  const row: DateRange = {
    start: dayRange(first, timeZone).start,
    end: dayRange(last, timeZone).end,
  };
  const compare = compareDominance(catalog);

  const segments = occurrences
    .filter((o) => intersects(o, row))
    .map((occurrence) => {
      const cols = days.flatMap((d, i) =>
        intersects(occurrence, dayRange(d, timeZone)) ? [i] : [],
      );
      return {
        occurrence,
        startCol: cols[0] ?? 0,
        endCol: cols[cols.length - 1] ?? 0,
        lane: 0,
        continuesBefore: occurrence.start < row.start,
        continuesAfter: occurrence.end > row.end,
      };
    })
    .sort(
      (a, b) =>
        a.startCol - b.startCol ||
        compare(a.occurrence, b.occurrence) ||
        b.endCol - b.startCol - (a.endCol - a.startCol),
    );

  const laneEnds: number[] = [];
  for (const seg of segments) {
    let lane = laneEnds.findIndex((end) => end < seg.startCol);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = seg.endCol;
    seg.lane = lane;
  }
  return segments;
}

/** Short events (e.g. a 2-hour contest) render as timed blocks rather than ribbons in Week view. */
export function isShortEvent(occurrence: Pick<Occurrence, 'start' | 'end'>): boolean {
  return occurrence.end.getTime() - occurrence.start.getTime() < 20 * 3_600_000;
}

/** Inclusive number of days a date span covers. */
export function spanDays(from: LocalDate, to: LocalDate): number {
  return daysBetween(from, to) + 1;
}
