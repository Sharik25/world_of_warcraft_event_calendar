import { bat, cobweb, hangingSpider } from '../art/halloween';
import { pumpkin } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Hallow's End: dusk purple and pumpkin amber under a harvest moon. */
export const theme: ThemeDefinition = {
  id: 'hallows-end',
  label: "Hallow's End",
  tokens: {
    '--color-bg': '#170d22',
    '--color-surface': '#f1dfc4',
    '--color-ink': '#2a1230',
    '--color-ink-muted': '#5a3a52',
    '--color-ink-on-dark': '#f6e2c8',
    '--color-ink-on-dark-muted': '#c9b0c4',
    '--color-accent': '#ff8a1f',
    '--color-gold': '#e5a63c',
    '--color-frame': '#2d1a3b',
    '--glow': '0 0 14px rgb(255 138 31 / 0.55)',
    '--cell-tint': 'rgb(255 138 31 / 0.16)',
    '--particle-color': '#ff9a3c',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 110%, rgb(255 120 20 / 0.28), transparent 60%)',
      'radial-gradient(ellipse at 85% 10%, rgb(255 214 150 / 0.12), transparent 40%)',
      'linear-gradient(180deg, #241038 0%, #170d22 55%, #0f0816 100%)',
    ].join(', '),
  },
  particles: 'embers',
  numeral: { ornament: { svg: pumpkin(true, false), placement: 'corner', size: 52 } },
  emblem: pumpkin(true, false),
  decorations: [
    { svg: cobweb, anchor: 'top-left', size: 150, mobileSize: 80 },
    { svg: hangingSpider, anchor: 'top-right', size: 46, x: 220, mobileSize: 30, motion: 'bob' },
    { svg: bat, anchor: 'top-left', size: 76, x: 230, y: 150, motion: 'float', mobileSize: null },
    {
      svg: bat,
      anchor: 'top-right',
      size: 56,
      x: 120,
      y: 220,
      motion: 'float',
      flip: true,
      mobileSize: null,
    },
  ],
};
