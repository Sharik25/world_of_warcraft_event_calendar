import { useId } from 'react';
import type { VersionConfig } from '@/domain/types';
import { useRegionId, useSettings } from '@/state/settings';
import { strings } from '@/strings/en';
import styles from './RegionSwitcher.module.css';

/** Segmented control choosing which region's server time a version's events follow. */
export function RegionSwitcher({ version }: { version: VersionConfig }) {
  const regionId = useRegionId(version);
  const setRegion = useSettings((s) => s.setRegion);
  const name = useId();

  if (version.regions.length < 2) return null;

  return (
    <fieldset className={styles.switcher}>
      <legend className={styles.legend}>{strings.settings.region}</legend>
      <div className={styles.options}>
        {version.regions.map((region) => (
          <label key={region.id} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={region.id}
              checked={region.id === regionId}
              onChange={() => setRegion(version.id, region.id)}
              className={styles.input}
            />
            <span className={styles.label}>{region.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
