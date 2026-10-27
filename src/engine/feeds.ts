import type { DateRange, EventCatalog, Region, VersionConfig } from '@/domain/types';
import { expandOccurrences } from './expand';
import { buildIcs, occurrenceToIcsEvent, type ExportOptions } from './ics';

export interface FeedFile {
  fileName: string; // "<version>-<region>.ics"
  versionId: string;
  regionId: string;
  eventCount: number;
  content: string;
}

export function feedFileName(versionId: string, regionId: string): string {
  return `${versionId}-${regionId}.ics`;
}

/** Subscription feeds for every version × region that has events (PLAN.md §10). */
export function buildFeeds(
  versions: VersionConfig[],
  catalog: EventCatalog,
  range: DateRange,
  options: ExportOptions & { appName: string; stamp?: Date; refreshHours?: number },
): FeedFile[] {
  return versions.flatMap((version) =>
    version.regions.flatMap((region: Region) => {
      const events = expandOccurrences(version, region.id, range).flatMap((o) => {
        const def = catalog[o.eventId];
        return def && def.category !== 'milestone' ? [occurrenceToIcsEvent(o, def, options)] : [];
      });
      // An iCalendar object needs at least one component; versions without events get no feed.
      if (events.length === 0) return [];
      return [
        {
          fileName: feedFileName(version.id, region.id),
          versionId: version.id,
          regionId: region.id,
          eventCount: events.length,
          content: buildIcs({
            name: `${options.appName} · ${version.shortName} (${region.label})`,
            description: `${version.name}: in-game events, ${region.label} server time.`,
            refreshHours: options.refreshHours ?? 12,
            stamp: options.stamp,
            events,
          }),
        },
      ];
    }),
  );
}
