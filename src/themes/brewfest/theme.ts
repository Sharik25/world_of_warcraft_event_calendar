import { mug } from '../art/brewfest';
import { bunting } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Brewfest: amber and oak, rising foam. */
export const theme: ThemeDefinition = {
  id: 'brewfest',
  label: 'Brewfest',
  tokens: {
    '--color-bg': '#1f1408',
    '--color-surface': '#f7e6c4',
    '--color-ink': '#2f1f0b',
    '--color-ink-muted': '#634a2a',
    '--color-ink-on-dark': '#fff3dc',
    '--color-ink-on-dark-muted': '#dcc49b',
    '--color-accent': '#e8a33b',
    '--color-gold': '#f0c35a',
    '--color-frame': '#3d2812',
    '--glow': '0 0 14px rgb(232 163 59 / 0.55)',
    '--cell-tint': 'rgb(232 163 59 / 0.16)',
    '--particle-color': '#fff4cf',
  },
  background: {
    css: [
      'repeating-linear-gradient(90deg, rgb(0 0 0 / 0.08) 0 2px, transparent 2px 46px)',
      'radial-gradient(ellipse at 50% 0%, rgb(240 195 90 / 0.18), transparent 55%)',
      'linear-gradient(180deg, #2c1d0c 0%, #1f1408 70%)',
    ].join(', '),
  },
  particles: 'bubbles',
  numeral: { ornament: { svg: mug, placement: 'corner', size: 48 } },
  emblem: mug,
  decorations: [
    { svg: bunting(['#e8a33b', '#7a4622', '#3f7a3a']), anchor: 'top', size: 40, mobileSize: 28 },
  ],
};
