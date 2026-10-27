import { useOutletContext } from 'react-router';
import type { EventCatalog, EventCategory, Region, VersionConfig } from '@/domain/types';
import type { WeekStart } from '@/engine/calendar';
import type { LocalDate } from '@/engine/time';
import type { ViewMode } from './paths';

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
  mode: ViewMode;
  /** The date the view is about: the day itself, the week's first day, or a day in the month. */
  viewDate: LocalDate;
  isToday: boolean;
  weekStartsOn: WeekStart;
  hiddenCategories: EventCategory[];
  /** Links for the view header: previous/next period and the period containing today. */
  nav: { prev: string; next: string; current: string; isCurrent: boolean };
  /** Link to the same date in another mode. */
  hrefFor: (mode: ViewMode, date: LocalDate) => string;
}

export function useVersionView(): VersionView {
  return useOutletContext<VersionView>();
}
