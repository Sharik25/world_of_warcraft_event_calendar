import { grassEdge, paintedEgg } from '../art/spring';
import type { ThemeDefinition } from '../types';

/** Noblegarden: spring meadow at dusk, pastel eggs. */
export const theme: ThemeDefinition = {
  id: 'noblegarden',
  label: 'Noblegarden',
  tokens: {
    '--color-bg': '#1b2d20',
    '--color-surface': '#fbf6e6',
    '--color-ink': '#24301f',
    '--color-ink-muted': '#4f5e45',
    '--color-ink-on-dark': '#f7fbef',
    '--color-ink-on-dark-muted': '#c6d8b8',
    '--color-accent': '#f7a8d0',
    '--color-gold': '#f2d06b',
    '--color-frame': '#1c3021',
    '--glow': '0 0 14px rgb(247 168 208 / 0.5)',
    '--cell-tint': 'rgb(247 168 208 / 0.14)',
    '--particle-color': '#ffd6ec',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 0%, rgb(168 216 247 / 0.2), transparent 55%)',
      'radial-gradient(ellipse at 50% 120%, rgb(120 200 100 / 0.25), transparent 60%)',
      'linear-gradient(180deg, #24402c 0%, #1b2d20 70%)',
    ].join(', '),
  },
  particles: 'petals',
  numeral: { ornament: { svg: paintedEgg('#a8d8f7', '#f7a8d0'), placement: 'corner', size: 40 } },
  emblem: paintedEgg('#a8d8f7', '#f7a8d0'),
  decorations: [{ svg: grassEdge, anchor: 'bottom', size: 44, mobileSize: 30 }],
};
