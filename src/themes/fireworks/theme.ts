import { bunting, burst, sparkle, star } from '../art/shared';
import type { ThemeDefinition } from '../types';

const stars = [
  '12% 18%',
  '28% 8%',
  '44% 22%',
  '63% 12%',
  '78% 26%',
  '91% 9%',
  '8% 42%',
  '35% 38%',
  '56% 44%',
  '86% 48%',
]
  .map((at) => `radial-gradient(1.5px 1.5px at ${at}, rgb(255 255 255 / 0.8), transparent)`)
  .join(', ');

/** New Year's Eve and the Fireworks Spectacular: night sky and sparkling bursts. */
export const theme: ThemeDefinition = {
  id: 'fireworks',
  label: 'Fireworks',
  tokens: {
    '--color-bg': '#070b1f',
    '--color-surface': '#f2ecdc',
    '--color-ink': '#1b1630',
    '--color-ink-muted': '#4b4566',
    '--color-ink-on-dark': '#f4f1ff',
    '--color-ink-on-dark-muted': '#b8b3d9',
    '--color-accent': '#ff6b9a',
    '--color-gold': '#f2c14e',
    '--color-frame': '#161a3d',
    '--glow': '0 0 16px rgb(255 107 154 / 0.55)',
    '--cell-tint': 'rgb(255 107 154 / 0.14)',
    '--particle-color': '#ffe9a8',
  },
  background: {
    css: [
      stars,
      'radial-gradient(ellipse at 50% 120%, rgb(120 60 200 / 0.3), transparent 60%)',
      'linear-gradient(180deg, #0e1338 0%, #070b1f 70%)',
    ].join(', '),
  },
  particles: 'sparkles',
  numeral: { ornament: { svg: star('#ffd84a'), placement: 'corner', size: 44 } },
  emblem: burst('#ffd23f', '#ff5fa2'),
  decorations: [
    {
      svg: bunting(['#d6282c', '#f2c84b', '#3a7bd9', '#f4f1ff']),
      anchor: 'top',
      size: 40,
      mobileSize: 28,
    },
    {
      svg: burst('#ffd23f', '#ff5fa2'),
      anchor: 'top-left',
      size: 110,
      x: 60,
      y: 80,
      motion: 'pulse',
      mobileSize: 56,
    },
    {
      svg: burst('#5fe0ff', '#b98cff'),
      anchor: 'top-right',
      size: 90,
      x: 90,
      y: 120,
      motion: 'pulse',
      mobileSize: null,
    },
    {
      svg: sparkle('#ffe27a'),
      anchor: 'top-right',
      size: 36,
      x: 260,
      y: 70,
      motion: 'pulse',
      mobileSize: 22,
    },
    {
      svg: sparkle('#b98cff'),
      anchor: 'top-left',
      size: 30,
      x: 220,
      y: 200,
      motion: 'pulse',
      mobileSize: null,
    },
  ],
};
