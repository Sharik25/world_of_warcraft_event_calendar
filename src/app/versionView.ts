import { useOutletContext } from 'react-router';
import type { EventCatalog, EventCategory, Region, VersionConfig } from '@/domain/types';
import type { LocalDate } from '@/engine/time';

/** Everything a view under /:versionId needs, provided by VersionLayout. */
export interface VersionView {
  version: VersionConfig;
  catalog: EventCatalog;
  region: Region;
  userTimeZone: string;
  /** Zone used to display times: the user's, or the region server's ("Show server time"). */
  displayTimeZone: string;
  now: Date;
  today: LocalDate;
  viewDate: LocalDate;
  isToday: boolean;
  hiddenCategories: EventCategory[];
}

export function useVersionView(): VersionView {
  return useOutletContext<VersionView>();
}
