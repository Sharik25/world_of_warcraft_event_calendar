import type { ThemeDefinition } from '../types';

/** "Inn at dusk": warm browns, ember accents, soft vignette. Used when no event is dominant. */
export const theme: ThemeDefinition = {
  id: 'base',
  label: 'Inn at dusk',
  tokens: {
    '--color-bg': '#1c120c',
    '--color-surface': '#efe0bf',
    '--color-ink': '#2b1a0e',
    '--color-ink-muted': '#5c4330',
    '--color-ink-on-dark': '#f3e3c3',
    '--color-ink-on-dark-muted': '#c9b48f',
    '--color-accent': '#e8823a',
    '--color-gold': '#d4a64a',
    '--color-frame': '#3a2516',
    '--glow': '0 0 12px rgb(232 130 58 / 0.45)',
    '--cell-tint': 'transparent',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 15%, rgb(232 130 58 / 0.2), transparent 60%)',
      'radial-gradient(ellipse at 50% 120%, rgb(0 0 0 / 0.6), transparent 70%)',
      'var(--color-bg)',
    ].join(', '),
  },
  particles: null,
};
