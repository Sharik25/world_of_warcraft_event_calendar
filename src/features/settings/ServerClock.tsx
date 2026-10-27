import { formatInTimeZone } from 'date-fns-tz';
import type { VersionConfig } from '@/domain/types';
import { findRegion } from '@/engine/expand';
import { useNow } from '@/hooks/useNow';
import { useRegionId } from '@/state/settings';
import { strings } from '@/strings/en';
import styles from './ServerClock.module.css';

/** Current server time for the selected region of a version. */
export function ServerClock({ version }: { version: VersionConfig }) {
  const now = useNow();
  const region = findRegion(version, useRegionId(version));

  return (
    <p className={styles.clock}>
      <span className={styles.caption}>{strings.settings.serverTime(region.label)}</span>
      <time
        className={styles.time}
        dateTime={formatInTimeZone(now, region.timeZone, "yyyy-MM-dd'T'HH:mmXXX")}
      >
        {formatInTimeZone(now, region.timeZone, 'HH:mm')}
        <span className={styles.date}>
          {formatInTimeZone(now, region.timeZone, 'EEE, MMM d · zzz')}
        </span>
      </time>
    </p>
  );
}
