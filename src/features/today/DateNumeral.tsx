import { useId, type CSSProperties } from 'react';
import type { LocalDate } from '@/engine/time';
import { useTheme } from '@/hooks/useTheme';
import { svgDataUrl, uniqueSvgIds } from '@/themes/art/helpers';
import { dayParts } from '@/lib/format';
import { Frame, useScopeThemeId } from '@/ui';
import styles from './DateNumeral.module.css';

/** Big themed date numeral: colors and glow come from the day's theme tokens. */
export function DateNumeral({ date }: { date: LocalDate }) {
  const { weekday, day, month, year } = dayParts(date);
  const ornament = useTheme(useScopeThemeId()).numeral?.ornament;
  const instance = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Frame className={styles.frame}>
      {ornament?.placement === 'cap' && (
        <span
          className={styles.ornament}
          data-placement="cap"
          style={
            {
              '--ornament-size': `${ornament.size}px`,
              backgroundImage: svgDataUrl(ornament.svg),
            } as CSSProperties
          }
          aria-hidden="true"
        />
      )}
      {ornament?.placement === 'corner' && (
        <span
          className={styles.ornament}
          data-placement="corner"
          style={{ '--ornament-size': `${ornament.size}px` } as CSSProperties}
          aria-hidden="true"
          // Static, bundled art from theme files (never user input).
          dangerouslySetInnerHTML={{ __html: uniqueSvgIds(ornament.svg, instance) }}
        />
      )}
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
