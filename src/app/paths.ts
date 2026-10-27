import type { VersionId } from '@/domain/types';
import type { LocalDate, LocalMonth } from '@/engine/time';

export type ViewMode = 'day' | 'week' | 'month';

/** URL builders: URL = state (PLAN.md §2). */
export const paths = {
  today: (versionId: VersionId) => `/${versionId}/today`,
  day: (versionId: VersionId, date: LocalDate) => `/${versionId}/day/${date}`,
  week: (versionId: VersionId, date: LocalDate) => `/${versionId}/week/${date}`,
  month: (versionId: VersionId, month: LocalMonth) => `/${versionId}/month/${month}`,
};

/**
 * Adds/replaces `?event=` (and optionally `&on=<date>`, the day the sheet refers to) on a search
 * string. Passing `null` removes both.
 */
export function withEvent(search: string, eventId: string | null, on?: LocalDate): string {
  const params = new URLSearchParams(search);
  if (eventId) params.set('event', eventId);
  else params.delete('event');
  if (eventId && on) params.set('on', on);
  else params.delete('on');
  const query = params.toString();
  return query ? `?${query}` : '';
}
