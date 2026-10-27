import { versions, defaultVersionId } from '@/data/versions';
import { RegionSwitcher } from '@/features/settings/RegionSwitcher';
import { ServerClock } from '@/features/settings/ServerClock';
import { useSettings } from '@/state/settings';
import { strings } from '@/strings/en';
import styles from './HomePlaceholder.module.css';

/** Placeholder home. Replaced by the Today view in Phase 3. */
export function HomePlaceholder() {
  const versionId = useSettings((s) => s.versionId);
  const version =
    versions.find((v) => v.id === versionId) ?? versions.find((v) => v.id === defaultVersionId);

  return (
    <section className={styles.card} aria-labelledby="app-title">
      <h1 id="app-title" className={styles.title}>
        {strings.app.name}
      </h1>
      <p className={styles.tagline}>{strings.app.tagline}</p>
      {version && (
        <div className={styles.region}>
          <RegionSwitcher version={version} />
          <ServerClock version={version} />
        </div>
      )}
    </section>
  );
}
