import type { VersionId } from '@/domain/types';
import type { LocalDate } from '@/engine/time';

/** URL builders: URL = state (PLAN.md §2). */
export const paths = {
  today: (versionId: VersionId) => `/${versionId}/today`,
  day: (versionId: VersionId, date: LocalDate) => `/${versionId}/day/${date}`,
};

/** Adds/replaces `?event=` on the current search string. */
export function withEvent(search: string, eventId: string | null): string {
  const params = new URLSearchParams(search);
  if (eventId) params.set('event', eventId);
  else params.delete('event');
  const query = params.toString();
  return query ? `?${query}` : '';
}
