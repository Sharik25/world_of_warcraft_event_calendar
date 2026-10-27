import type { EventCatalog, Occurrence, ThemeId, VersionConfig } from '@/domain/types';
import { occurrencesOnDay } from '@/engine/dominance';
import type { LocalDate } from '@/engine/time';

/** Theme of the day's dominant event, or the version's base theme on a quiet day. */
export function dominantThemeId(
  occurrences: Occurrence[],
  date: LocalDate,
  timeZone: string,
  catalog: EventCatalog,
  version: VersionConfig,
): ThemeId {
  const [dominant] = occurrencesOnDay(occurrences, date, timeZone, catalog);
  return (dominant && catalog[dominant.eventId]?.themeId) || version.baseThemeId;
}
