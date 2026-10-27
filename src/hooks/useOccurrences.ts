import { useMemo } from 'react';
import type { EventCatalog, EventCategory, Occurrence, VersionConfig } from '@/domain/types';
import { filterByCategory } from '@/engine/agenda';
import { expandOccurrences } from '@/engine/expand';
import { daysRange, type LocalDate } from '@/engine/time';

/** Visible occurrences intersecting the user-local days [from, toInclusive]. */
export function useOccurrences(
  version: VersionConfig,
  regionId: string,
  from: LocalDate,
  toInclusive: LocalDate,
  timeZone: string,
  catalog: EventCatalog,
  hiddenCategories: readonly EventCategory[],
): Occurrence[] {
  return useMemo(
    () =>
      filterByCategory(
        expandOccurrences(version, regionId, daysRange(from, toInclusive, timeZone)),
        catalog,
        hiddenCategories,
      ),
    [version, regionId, from, toInclusive, timeZone, catalog, hiddenCategories],
  );
}
