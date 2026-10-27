import { strings } from '@/strings/en';
import styles from './HomePlaceholder.module.css';

/** Phase 0 placeholder. Replaced by the Today view in Phase 3. */
export function HomePlaceholder() {
  return (
    <section className={styles.card} aria-labelledby="app-title">
      <h1 id="app-title" className={styles.title}>
        {strings.app.name}
      </h1>
      <p className={styles.tagline}>{strings.app.tagline}</p>
    </section>
  );
}
