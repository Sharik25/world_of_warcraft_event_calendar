import { leaf } from '../art/harvest';
import { bunting } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Harvest Festival: autumn ochre, wheat and falling leaves. */
export const theme: ThemeDefinition = {
  id: 'harvest-festival',
  label: 'Harvest Festival',
  tokens: {
    '--color-bg': '#22140a',
    '--color-surface': '#f6e7c8',
    '--color-ink': '#2f1d0d',
    '--color-ink-muted': '#634829',
    '--color-ink-on-dark': '#fdf0d8',
    '--color-ink-on-dark-muted': '#dbc195',
    '--color-accent': '#e0913a',
    '--color-gold': '#e6b54a',
    '--color-frame': '#45290f',
    '--glow': '0 0 14px rgb(224 145 58 / 0.55)',
    '--cell-tint': 'rgb(224 145 58 / 0.16)',
    '--particle-color': '#e0913a',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 120%, rgb(224 145 58 / 0.3), transparent 60%)',
      'linear-gradient(180deg, #33200f 0%, #22140a 70%)',
    ].join(', '),
  },
  particles: 'petals',
  numeral: { ornament: { svg: leaf('#d9622b'), placement: 'corner', size: 44 } },
  emblem: leaf('#d9622b'),
  decorations: [
    {
      svg: bunting(['#c8402a', '#e0913a', '#f0b23c', '#8a5a2b']),
      anchor: 'top',
      size: 40,
      mobileSize: 28,
    },
  ],
};
