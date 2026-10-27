import type { LocalDate } from '@/engine/time';
import { dayParts } from '@/lib/format';
import { Frame } from '@/ui';
import styles from './DateNumeral.module.css';

/** Big themed date numeral: colors and glow come from the day's theme tokens. */
export function DateNumeral({ date }: { date: LocalDate }) {
  const { weekday, day, month, year } = dayParts(date);
  return (
    <Frame className={styles.frame}>
      <time dateTime={date} className={styles.time}>
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>
          {month} <span className={styles.year}>{year}</span>
        </span>
      </time>
    </Frame>
  );
}
