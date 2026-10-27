import { useVersionView } from '@/app/versionView';
import type { Occurrence } from '@/domain/types';

/** Theme id for a day given its occurrences (most dominant first). */
export function useDayThemeId() {
  const { catalog, version } = useVersionView();
  return (occurrences: Occurrence[] | undefined) => {
    const dominant = occurrences?.[0];
    return (dominant && catalog[dominant.eventId]?.themeId) || version.baseThemeId;
  };
}
