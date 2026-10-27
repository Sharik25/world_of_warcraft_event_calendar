import type { Region, VersionConfig } from '@/domain/types';
import { feedFileName } from '@/engine/feeds';

/** Build-time feed URLs for a version/region and how to subscribe (PLAN.md §10). */
export function feedUrls(version: VersionConfig, region: Region, origin = window.location.origin) {
  const path = `/calendars/${feedFileName(version.id, region.id)}`;
  const https = `${origin}${path}`;
  const webcal = https.replace(/^https?:/, 'webcal:');
  return {
    path,
    https,
    webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
  };
}
