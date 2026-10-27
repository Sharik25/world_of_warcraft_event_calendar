import { bonfire, sun } from '../art/midsummer';
import { bunting } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Midsummer Fire Festival: gold and red bonfire glow. */
export const theme: ThemeDefinition = {
  id: 'midsummer',
  label: 'Midsummer Fire Festival',
  tokens: {
    '--color-bg': '#2a0c05',
    '--color-surface': '#fbe7c6',
    '--color-ink': '#3a1608',
    '--color-ink-muted': '#6b3a22',
    '--color-ink-on-dark': '#fff1dd',
    '--color-ink-on-dark-muted': '#f0c49a',
    '--color-accent': '#ff6a1a',
    '--color-gold': '#ffc040',
    '--color-frame': '#4a1a0c',
    '--glow': '0 0 16px rgb(255 106 26 / 0.6)',
    '--cell-tint': 'rgb(255 106 26 / 0.16)',
    '--particle-color': '#ffb347',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 120%, rgb(255 106 26 / 0.4), transparent 60%)',
      'radial-gradient(ellipse at 85% 0%, rgb(255 192 64 / 0.2), transparent 45%)',
      'linear-gradient(180deg, #3d1308 0%, #2a0c05 65%, #1a0703 100%)',
    ].join(', '),
  },
  particles: 'embers',
  numeral: { ornament: { svg: sun, placement: 'corner', size: 50 } },
  emblem: bonfire,
  decorations: [
    {
      svg: bunting(['#ff6a1a', '#ffc040', '#d8322c'], 'flame'),
      anchor: 'top',
      size: 40,
      mobileSize: 28,
    },
  ],
};
