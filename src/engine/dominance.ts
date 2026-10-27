import type { DateRange, EventCatalog, Occurrence, Rarity } from '@/domain/types';
import { dayRange, intersects, type LocalDate } from './time';

export const RARITY_WEIGHT: Record<Rarity, number> = {
  once: 5,
  annual: 4,
  seasonal: 3,
  monthly: 2,
  weekly: 1,
};

/**
 * Orders occurrences from most to least dominant (PLAN.md §6). Tie-breakers in order:
 * rarity weight, definition priority, shorter duration, earlier start, event id.
 */
export function compareDominance(catalog: EventCatalog) {
  return (a: Occurrence, b: Occurrence): number => {
    const defA = catalog[a.eventId];
    const defB = catalog[b.eventId];
    const rarity =
      (defB ? RARITY_WEIGHT[defB.rarity] : 0) - (defA ? RARITY_WEIGHT[defA.rarity] : 0);
    if (rarity) return rarity;
    const priority = (defB?.priority ?? 0) - (defA?.priority ?? 0);
    if (priority) return priority;
    const duration = a.end.getTime() - a.start.getTime() - (b.end.getTime() - b.start.getTime());
    if (duration) return duration;
    const start = a.start.getTime() - b.start.getTime();
    if (start) return start;
    return a.eventId.localeCompare(b.eventId);
  };
}

/** The occurrence that styles the day, or null when nothing is active (→ version base theme). */
export function pickDominant(
  occurrencesOnDay: Occurrence[],
  catalog: EventCatalog,
): Occurrence | null {
  if (occurrencesOnDay.length === 0) return null;
  return [...occurrencesOnDay].sort(compareDominance(catalog))[0] ?? null;
}

/** Occurrences intersecting a range, ordered most dominant first. */
export function occurrencesIn(
  occurrences: Occurrence[],
  range: DateRange,
  catalog: EventCatalog,
): Occurrence[] {
  return occurrences.filter((o) => intersects(o, range)).sort(compareDominance(catalog));
}

/** Occurrences intersecting a calendar day in the user's time zone, most dominant first. */
export function occurrencesOnDay(
  occurrences: Occurrence[],
  date: LocalDate,
  timeZone: string,
  catalog: EventCatalog,
): Occurrence[] {
  return occurrencesIn(occurrences, dayRange(date, timeZone), catalog);
}
