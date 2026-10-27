import type { ExplicitOccurrence, ScheduleFile, VersionEventBinding } from '@/domain/types';

/**
 * Turns a version's `schedule-<year>.json` files into explicit-rule bindings, one per event.
 * Adding a year of dates is just adding a file: version configs glob them.
 */
export function explicitBindingsFromSchedules(files: ScheduleFile[]): VersionEventBinding[] {
  const byEvent = new Map<string, ExplicitOccurrence[]>();
  for (const file of [...files].sort((a, b) => a.year - b.year)) {
    for (const [eventId, occurrences] of Object.entries(file.events)) {
      byEvent.set(eventId, [...(byEvent.get(eventId) ?? []), ...occurrences]);
    }
  }
  return [...byEvent].map(([eventId, occurrences]) => ({
    eventId,
    rule: {
      kind: 'explicit',
      occurrences: [...occurrences].sort((a, b) => a.start.localeCompare(b.start)),
    },
  }));
}

/** Eager glob result → schedule files. */
export function scheduleFilesFromGlob(modules: Record<string, ScheduleFile>): ScheduleFile[] {
  return Object.values(modules);
}
