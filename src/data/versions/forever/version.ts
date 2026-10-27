import type { VersionConfig } from '@/domain/types';

/** WoW: Forever. Events stay empty until the post-launch calendar is verified (PLAN.md §14). */
export const forever: VersionConfig = {
  id: 'forever',
  name: 'WoW: Forever',
  shortName: 'Forever',
  status: 'upcoming',
  launchDate: '2026-11-04T15:00:00-08:00', // 3:00 pm PT
  // Realmless: a single region, set up in Phase 7 once the event clock is known.
  regions: [{ id: 'global', label: 'All realms', timeZone: 'America/Los_Angeles' }],
  defaultRegionId: 'global',
  baseThemeId: 'base',
  events: [],
};
