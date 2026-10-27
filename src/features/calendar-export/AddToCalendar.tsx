import { useEffect, useId, useRef, useState } from 'react';
import type { Occurrence } from '@/domain/types';
import { strings } from '@/strings/en';
import { cx, Icon } from '@/ui';
import { useCalendarExport } from './useCalendarExport';
import styles from './AddToCalendar.module.css';

function Options({ occurrence, onDone }: { occurrence: Occurrence; onDone?: () => void }) {
  const exp = useCalendarExport(occurrence);
  return (
    <ul className={styles.options}>
      <li>
        <a
          href={exp.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.option}
          onClick={onDone}
        >
          <Icon name="external" size={18} />
          {strings.calendarExport.google}
        </a>
      </li>
      <li>
        <button
          type="button"
          className={styles.option}
          onClick={() => {
            exp.downloadSingle();
            onDone?.();
          }}
        >
          <Icon name="calendarPlus" size={18} />
          {strings.calendarExport.appleOutlook}
        </button>
      </li>
    </ul>
  );
}

/** Add-to-calendar button disclosing Google Calendar and .ics options (PLAN.md §10). */
export function AddToCalendar({ occurrence }: { occurrence: Occurrence }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.menu} ref={rootRef}>
      <button
        type="button"
        className={cx(styles.trigger, open && styles.triggerOpen)}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="calendarPlus" size={18} />
        {strings.calendarExport.addToCalendar}
        <Icon name="chevronRight" size={16} className={styles.caret} />
      </button>
      {open && (
        <div id={menuId} className={styles.popover}>
          <Options occurrence={occurrence} onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
