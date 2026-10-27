import type { VersionConfig } from '@/domain/types';

/** The version's launch instant, if it has one. */
export function launchInstant(version: Pick<VersionConfig, 'launchDate'>): Date | null {
  if (!version.launchDate) return null;
  const date = new Date(version.launchDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Effective status at `now`: an 'upcoming' version becomes live once its launch time passes,
 * so the app needs no redeploy on launch day.
 */
export function versionStatus(version: VersionConfig, now: Date): VersionConfig['status'] {
  if (version.status !== 'upcoming') return version.status;
  const launch = launchInstant(version);
  return launch && now >= launch ? 'live' : 'upcoming';
}

/** Same view and date in another version: /anniversary/week/2026-10-25 → /forever/week/2026-10-25. */
export function switchVersionPath(pathname: string, fromId: string, toId: string): string {
  const prefix = `/${fromId}`;
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return `/${toId}${pathname.slice(prefix.length)}`;
  }
  return `/${toId}/today`;
}
