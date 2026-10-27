import { bunting, star } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Darkmoon Faire: purple and teal carnival stripes. */
export const theme: ThemeDefinition = {
  id: 'darkmoon-faire',
  label: 'Darkmoon Faire',
  tokens: {
    '--color-bg': '#160f24',
    '--color-surface': '#f0e6d2',
    '--color-ink': '#24163a',
    '--color-ink-muted': '#54476b',
    '--color-ink-on-dark': '#f3eaff',
    '--color-ink-on-dark-muted': '#bfb0d8',
    '--color-accent': '#2ec4b6',
    '--color-gold': '#e3b04b',
    '--color-frame': '#2c1b47',
    '--glow': '0 0 14px rgb(46 196 182 / 0.5)',
    '--cell-tint': 'rgb(46 196 182 / 0.14)',
    '--particle-color': '#9ff0e6',
  },
  background: {
    css: [
      'repeating-linear-gradient(90deg, rgb(107 63 184 / 0.08) 0 60px, rgb(37 179 166 / 0.06) 60px 120px)',
      'radial-gradient(ellipse at 50% 0%, rgb(107 63 184 / 0.35), transparent 60%)',
      'linear-gradient(180deg, #231637 0%, #160f24 70%)',
    ].join(', '),
  },
  particles: 'sparkles',
  numeral: { ornament: { svg: star('#e3b04b'), placement: 'corner', size: 40 } },
  emblem: star('#e3b04b'),
  decorations: [
    { svg: bunting(['#6b3fb8', '#25b3a6', '#e3b04b']), anchor: 'top', size: 40, mobileSize: 28 },
  ],
};
