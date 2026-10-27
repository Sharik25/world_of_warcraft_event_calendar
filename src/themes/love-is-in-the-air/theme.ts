import { heart } from '../art/love';
import { bunting } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Love is in the Air: rose and pink, drifting petals. */
export const theme: ThemeDefinition = {
  id: 'love-is-in-the-air',
  label: 'Love is in the Air',
  tokens: {
    '--color-bg': '#2a0f1f',
    '--color-surface': '#fbe9ec',
    '--color-ink': '#3a1424',
    '--color-ink-muted': '#6e3a50',
    '--color-ink-on-dark': '#ffeef3',
    '--color-ink-on-dark-muted': '#e0b0c2',
    '--color-accent': '#ff5c8a',
    '--color-gold': '#f2b26b',
    '--color-frame': '#4a1a33',
    '--glow': '0 0 14px rgb(255 92 138 / 0.55)',
    '--cell-tint': 'rgb(255 92 138 / 0.15)',
    '--particle-color': '#ffb3c8',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 0%, rgb(255 92 138 / 0.22), transparent 55%)',
      'linear-gradient(180deg, #3a1429 0%, #2a0f1f 65%, #1c0a15 100%)',
    ].join(', '),
  },
  particles: 'petals',
  numeral: { ornament: { svg: heart(), placement: 'corner', size: 44 } },
  emblem: heart(),
  decorations: [
    {
      svg: bunting(['#ff5c8a', '#ffb3c8', '#e8436f'], 'heart', '#f2b26b'),
      anchor: 'top',
      size: 40,
      mobileSize: 28,
    },
  ],
};
