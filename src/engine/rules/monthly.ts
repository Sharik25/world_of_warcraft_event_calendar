import {
  addDays,
  addMonths,
  intersects,
  localDateOf,
  monthOf,
  monthsBetween,
  nthWeekdayOfMonth,
  wallTimeToInstant,
} from '../time';
import type { RawOccurrence, RuleExpander } from './types';

export const expandMonthly: RuleExpander<'monthly'> = (rule, { timeZone, range }) => {
  const offset = rule.offsetDays ?? 0;
  // Months whose occurrence could reach into the range, given offset and duration.
  const spanMonths = Math.ceil((Math.abs(offset) + rule.durationDays) / 28) + 1;
  const firstMonth = addMonths(monthOf(localDateOf(range.start, timeZone)), -spanMonths);
  const lastMonth = addMonths(monthOf(localDateOf(range.end, timeZone)), spanMonths);

  const result: RawOccurrence[] = [];
  for (let month = firstMonth; month <= lastMonth; month = addMonths(month, 1)) {
    const startDay = addDays(
      nthWeekdayOfMonth(month, rule.anchor.weekday, rule.anchor.nth),
      offset,
    );
    const occurrence: RawOccurrence = {
      // Days are added on the wall clock, so DST shifts never move the server start/end time.
      start: wallTimeToInstant(`${startDay}T${rule.startTime}`, timeZone),
      end: wallTimeToInstant(`${addDays(startDay, rule.durationDays)}T${rule.startTime}`, timeZone),
      verified: rule.verified,
      ...(rule.source && { source: rule.source }),
    };
    if (rule.rotation) {
      const n = rule.rotation.length;
      const index = monthsBetween(rule.rotationAnchor ?? month, month);
      occurrence.location = rule.rotation[((index % n) + n) % n];
    }
    if (intersects(occurrence, range)) result.push(occurrence);
  }
  return result;
};
