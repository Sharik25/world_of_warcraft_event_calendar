import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { ParticleKind } from '@/themes';
import styles from './AmbientParticles.module.css';

export const MAX_PARTICLES = 36;

/** Deterministic pseudo-random sequence so particles don't jump between renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Light CSS-only ambient particles (embers, snow, petals, sparkles, bubbles), colored by the
 * theme's `--particle-color`. Capped at 36 (18 on mobile) and paused while the tab is hidden.
 * Don't render it at all when the user prefers reduced motion.
 */
export function AmbientParticles({
  kind,
  count = MAX_PARTICLES,
}: {
  kind: ParticleKind;
  count?: number;
}) {
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  const particles = useMemo(() => {
    const rand = seeded(kind.length * 7919 + 17);
    return Array.from({ length: Math.min(count, MAX_PARTICLES) }, () => ({
      '--px': `${(rand() * 100).toFixed(1)}%`,
      '--py': `${(rand() * 100).toFixed(1)}%`,
      '--delay': `${(-rand() * 20).toFixed(1)}s`,
      '--duration': `${(10 + rand() * 12).toFixed(1)}s`,
      '--size': `${(3 + rand() * 6).toFixed(1)}px`,
      '--drift': `${((rand() - 0.5) * 120).toFixed(0)}px`,
      '--spin': `${(rand() * 720 - 360).toFixed(0)}deg`,
    }));
  }, [kind, count]);

  return (
    <div
      className={styles.layer}
      data-kind={kind}
      data-paused={hidden || undefined}
      aria-hidden="true"
    >
      {particles.map((style, i) => (
        <span key={i} className={styles.particle} style={style as CSSProperties} />
      ))}
    </div>
  );
}
