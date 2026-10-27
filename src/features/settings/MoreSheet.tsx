import type { VersionConfig } from '@/domain/types';
import { findRegion } from '@/engine/expand';
import { SubscribeSection } from '@/features/calendar-export/SubscribeSection';
import { useRegionId } from '@/state/settings';
import { strings } from '@/strings/en';
import { Sheet } from '@/ui';
import { RegionSwitcher } from './RegionSwitcher';
import { ServerClock } from './ServerClock';
import styles from './MoreSheet.module.css';

/** Version/region settings and About. Grows into the full settings page in Phase 8. */
export function MoreSheet({
  open,
  onClose,
  version,
}: {
  open: boolean;
  onClose: () => void;
  version: VersionConfig;
}) {
  const region = findRegion(version, useRegionId(version));
  return (
    <Sheet open={open} onClose={onClose} title={strings.more.title}>
      <section className={styles.section}>
        <h3 className={styles.heading}>{version.name}</h3>
        <RegionSwitcher version={version} />
        <ServerClock version={version} />
      </section>
      {version.events.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.heading}>{strings.calendarExport.subscribe}</h3>
          <SubscribeSection version={version} region={region} />
        </section>
      )}
      <section className={styles.section}>
        <h3 className={styles.heading}>{strings.more.about}</h3>
        <p className={styles.text}>{strings.more.aboutText}</p>
        <p className={styles.legal}>{strings.legal.disclaimer}</p>
      </section>
    </Sheet>
  );
}
