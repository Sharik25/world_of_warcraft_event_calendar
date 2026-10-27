import { kite, paperStar } from '../art/children';
import { bunting } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** Children's Week: warm yellows, kites and toys. */
export const theme: ThemeDefinition = {
  id: 'childrens-week',
  label: "Children's Week",
  tokens: {
    '--color-bg': '#2a2312',
    '--color-surface': '#fff6d8',
    '--color-ink': '#33280f',
    '--color-ink-muted': '#625434',
    '--color-ink-on-dark': '#fff8e1',
    '--color-ink-on-dark-muted': '#e0cf9c',
    '--color-accent': '#ffcd3c',
    '--color-gold': '#f0b23c',
    '--color-frame': '#2a210d',
    '--glow': '0 0 14px rgb(255 205 60 / 0.5)',
    '--cell-tint': 'rgb(255 205 60 / 0.14)',
    '--particle-color': '#fff1a8',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 0%, rgb(255 205 60 / 0.2), transparent 55%)',
      'linear-gradient(180deg, #3a3018 0%, #2a2312 70%)',
    ].join(', '),
  },
  particles: 'sparkles',
  numeral: { ornament: { svg: paperStar, placement: 'corner', size: 44 } },
  emblem: kite,
  decorations: [
    {
      svg: bunting(['#ffcd3c', '#e8463c', '#3a8fd9', '#3fb26a']),
      anchor: 'top',
      size: 40,
      mobileSize: 28,
    },
  ],
};
