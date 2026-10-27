import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { paths, withEvent } from '@/app/paths';
import { useVersionView } from '@/app/versionView';
import type { VersionView } from '@/app/versionView';
import type { Occurrence } from '@/domain/types';
import { buildDayAgenda } from '@/engine/agenda';
import { addDays, dayRange } from '@/engine/time';
import { Countdown } from '@/features/common/Countdown';
import { UnconfirmedMarker } from '@/features/common/UnconfirmedMarker';
import { EventSheet } from '@/features/event-sheet/EventSheet';
import { useOccurrences } from '@/hooks/useOccurrences';
import { formatDistance, formatRange } from '@/lib/format';
import { strings } from '@/strings/en';
import { Icon, ParchmentCard } from '@/ui';
import { DateNumeral } from './DateNumeral';
import styles from './TodayView.module.css';

const COMING_SOON_DAYS = 30;

/** Today (`/:versionId/today`) and any day (`/:versionId/day/:date`). */
export function TodayView() {
  const view = useVersionView();
  const { version, catalog, region, userTimeZone, displayTimeZone, now, today, viewDate, isToday } =
    view;
  const location = useLocation();
  const navigate = useNavigate();

  const occurrences = useOccurrences(
    version,
    region.id,
    viewDate,
    addDays(viewDate, COMING_SOON_DAYS + 1),
    userTimeZone,
    catalog,
    view.hiddenCategories,
  );
  const agenda = useMemo(
    () => buildDayAgenda(occurrences, viewDate, userTimeZone, catalog, COMING_SOON_DAYS),
    [occurrences, viewDate, userTimeZone, catalog],
  );

  const dayHref = (date: string) =>
    date === today ? paths.today(version.id) : paths.day(version.id, date);
  const eventHref = (eventId: string) => ({ search: withEvent(location.search, eventId) });
  const eventParam = new URLSearchParams(location.search).get('event');
  const { dominant } = agenda;
  const dominantDef = dominant ? catalog[dominant.eventId] : undefined;
  const also = agenda.active.slice(1);
  // "Coming soon" distances count from now on Today, from the start of the viewed day otherwise.
  const soonFrom = isToday ? now.getTime() : dayRange(viewDate, userTimeZone).start.getTime();

  return (
    <div className={styles.layout}>
      <section className={styles.hero} aria-labelledby="day-title">
        <div className={styles.dayNav}>
          <Link
            to={dayHref(addDays(viewDate, -1))}
            className={styles.navArrow}
            aria-label={strings.today.previousDay}
          >
            <Icon name="chevronLeft" />
          </Link>
          <DateNumeral date={viewDate} />
          <Link
            to={dayHref(addDays(viewDate, 1))}
            className={styles.navArrow}
            aria-label={strings.today.nextDay}
          >
            <Icon name="chevronRight" />
          </Link>
        </div>

        {!isToday && (
          <Link to={paths.today(version.id)} className={styles.todayLink}>
            <Icon name="today" size={18} />
            {strings.today.backToToday}
          </Link>
        )}

        {dominant && dominantDef ? (
          <>
            <h1 id="day-title" className={styles.title}>
              {dominantDef.name}
            </h1>
            <p className={styles.timing}>
              {isToday && (
                <Countdown
                  occurrence={dominant}
                  now={now}
                  timeZone={displayTimeZone}
                  className={styles.countdown}
                />
              )}
              {!dominant.verified && <UnconfirmedMarker onDark />}
            </p>
            <p className={styles.range}>
              <time dateTime={dominant.start.toISOString()}>
                {formatRange(dominant.start, dominant.end, displayTimeZone)}
              </time>
            </p>
            <ParchmentCard className={styles.heroCard}>
              <p className={styles.summary}>{dominantDef.summary}</p>
              {dominantDef.highlights && (
                <ul className={styles.highlights}>
                  {dominantDef.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              <Link
                to={eventHref(dominantDef.id)}
                className={styles.detailsButton}
                aria-label={strings.today.detailsFor(dominantDef.name)}
              >
                {strings.today.details}
              </Link>
            </ParchmentCard>
          </>
        ) : (
          <>
            <h1 id="day-title" className={styles.title}>
              {strings.today.quietDay}
            </h1>
            <p className={styles.quiet}>{strings.today.quietDayHint}</p>
          </>
        )}
      </section>

      <div className={styles.side}>
        {also.length > 0 && (
          <section aria-labelledby="also-title">
            <h2 id="also-title" className={styles.sectionTitle}>
              {strings.today.alsoToday}
            </h2>
            <ul className={styles.cards}>
              {also.map((o) => (
                <li key={o.key}>
                  <EventCard occurrence={o} href={eventHref(o.eventId)} view={view} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="soon-title">
          <h2 id="soon-title" className={styles.sectionTitle}>
            {strings.today.comingSoon}
          </h2>
          {agenda.comingSoon.length > 0 ? (
            <ul className={styles.chips}>
              {agenda.comingSoon.map((o) => {
                const def = catalog[o.eventId];
                return (
                  def && (
                    <li key={o.key}>
                      <Link to={eventHref(o.eventId)} className={styles.chip}>
                        <span className={styles.chipName}>{def.shortName ?? def.name}</span>{' '}
                        <time dateTime={o.start.toISOString()} className={styles.chipWhen}>
                          {strings.today.inDistance(formatDistance(o.start.getTime() - soonFrom))}
                        </time>
                      </Link>
                    </li>
                  )
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>{strings.today.comingSoonEmpty}</p>
          )}
        </section>
      </div>

      <EventSheet
        eventId={eventParam}
        onClose={() => navigate({ search: withEvent(location.search, null) }, { replace: true })}
      />
    </div>
  );
}

function EventCard({
  occurrence,
  href,
  view: { catalog, now, displayTimeZone, isToday },
}: {
  occurrence: Occurrence;
  href: { search: string };
  view: VersionView;
}) {
  const def = catalog[occurrence.eventId];
  if (!def) return null;
  return (
    <ParchmentCard as="article" compact className={styles.card}>
      <h3 className={styles.cardTitle}>
        <Link to={href} className={styles.cardLink}>
          {def.name}
        </Link>
      </h3>
      <p className={styles.cardMeta}>
        {isToday && (
          <>
            <Countdown occurrence={occurrence} now={now} timeZone={displayTimeZone} />
            {' · '}
          </>
        )}
        <time dateTime={occurrence.start.toISOString()}>
          {formatRange(occurrence.start, occurrence.end, displayTimeZone)}
        </time>
      </p>
      {!occurrence.verified && (
        <span className={styles.cardBadge}>{strings.common.unconfirmed}</span>
      )}
    </ParchmentCard>
  );
}
