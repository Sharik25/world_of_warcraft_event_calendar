import { useVersionView } from '@/app/versionView';
import type { Occurrence } from '@/domain/types';
import {
  buildIcs,
  googleCalendarUrl,
  occurrenceToIcsEvent,
  type ExportOptions,
} from '@/engine/ics';
import { localDateOf } from '@/engine/time';
import { downloadText } from '@/lib/download';
import { strings } from '@/strings/en';

/** Export actions for one occurrence. */
export function useCalendarExport(occurrence: Occurrence) {
  const { catalog } = useVersionView();
  const def = catalog[occurrence.eventId];
  const options: ExportOptions = {
    appUrl: typeof window === 'undefined' ? undefined : window.location.origin,
    tentativeLabel: strings.calendarExport.tentative,
    locationLabel: strings.eventSheet.location,
  };
  const event = def ? occurrenceToIcsEvent(occurrence, def, options) : null;

  return {
    googleUrl: event ? googleCalendarUrl(event) : '',
    downloadSingle() {
      if (!event || !def) return;
      downloadText(
        `${def.id}-${localDateOf(occurrence.start, 'UTC')}.ics`,
        buildIcs({ events: [event] }),
      );
    },
  };
}
