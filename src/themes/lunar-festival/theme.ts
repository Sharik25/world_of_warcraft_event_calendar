import { elderCoin, lantern } from '../art/lunar';
import type { ThemeDefinition } from '../types';

/** Lunar Festival: deep indigo night with lantern glow. */
export const theme: ThemeDefinition = {
  id: 'lunar-festival',
  label: 'Lunar Festival',
  tokens: {
    '--color-bg': '#0c0f2b',
    '--color-surface': '#f1ecdf',
    '--color-ink': '#1a1d3a',
    '--color-ink-muted': '#4a4e70',
    '--color-ink-on-dark': '#eef3ec',
    '--color-ink-on-dark-muted': '#aebfb8',
    '--color-accent': '#6fe3b0',
    '--color-gold': '#e8c56b',
    '--color-frame': '#151a3c',
    '--glow': '0 0 16px rgb(111 227 176 / 0.5)',
    '--cell-tint': 'rgb(111 227 176 / 0.12)',
    '--particle-color': '#c8ffe6',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 0%, rgb(111 227 176 / 0.15), transparent 55%)',
      'radial-gradient(ellipse at 50% 120%, rgb(216 50 42 / 0.2), transparent 60%)',
      'linear-gradient(180deg, #151a45 0%, #0c0f2b 70%)',
    ].join(', '),
  },
  particles: 'sparkles',
  numeral: { ornament: { svg: elderCoin, placement: 'corner', size: 44 } },
  emblem: lantern(),
  decorations: [
    {
      svg: lantern(),
      anchor: 'top-left',
      size: 60,
      x: 40,
      motion: 'sway',
      mobileSize: 34,
      glow: 'rgb(255 110 60 / 0.5)',
    },
    {
      svg: lantern('#e8a02a', '#ffd27a'),
      anchor: 'top-right',
      size: 64,
      x: 60,
      motion: 'sway',
      mobileSize: 34,
      glow: 'rgb(255 190 80 / 0.5)',
    },
  ],
};
