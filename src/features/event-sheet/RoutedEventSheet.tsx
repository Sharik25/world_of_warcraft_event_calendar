import { useLocation, useNavigate } from 'react-router';
import { isValidLocalDate } from '@/app/routes/loaders';
import { withEvent } from '@/app/paths';
import { EventSheet } from './EventSheet';

/** The event sheet driven by `?event=<id>&on=<date>`; closing clears both params. */
export function RoutedEventSheet() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const on = params.get('on') ?? undefined;

  return (
    <EventSheet
      eventId={params.get('event')}
      date={isValidLocalDate(on) ? on : undefined}
      onClose={() => navigate({ search: withEvent(location.search, null) }, { replace: true })}
    />
  );
}
