import { hourglass } from '../art/forever';
import { sparkle } from '../art/shared';
import type { ThemeDefinition } from '../types';

/** WoW: Forever: timeless midnight slate with arcane cyan and gold. */
export const theme: ThemeDefinition = {
  id: 'forever',
  label: 'Forever',
  tokens: {
    '--color-bg': '#0f1420',
    '--color-surface': '#f1ead8',
    '--color-ink': '#1d2230',
    '--color-ink-muted': '#4c5266',
    '--color-ink-on-dark': '#f2efe6',
    '--color-ink-on-dark-muted': '#b9b6c8',
    '--color-accent': '#5ec8d8',
    '--color-gold': '#e6c06a',
    '--color-frame': '#1a2236',
    '--glow': '0 0 16px rgb(94 200 216 / 0.5)',
    '--cell-tint': 'rgb(94 200 216 / 0.12)',
    '--particle-color': '#bfefff',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 0%, rgb(94 200 216 / 0.18), transparent 55%)',
      'radial-gradient(ellipse at 50% 120%, rgb(230 192 106 / 0.14), transparent 60%)',
      'linear-gradient(180deg, #161d2e 0%, #0f1420 70%)',
    ].join(', '),
  },
  particles: 'sparkles',
  numeral: { ornament: { svg: hourglass, placement: 'corner', size: 44 } },
  emblem: hourglass,
  decorations: [
    {
      svg: sparkle('#e6c06a'),
      anchor: 'top-left',
      size: 34,
      x: 120,
      y: 90,
      motion: 'pulse',
      mobileSize: 20,
    },
    {
      svg: sparkle('#5ec8d8'),
      anchor: 'top-right',
      size: 28,
      x: 160,
      y: 150,
      motion: 'pulse',
      mobileSize: null,
    },
  ],
};
