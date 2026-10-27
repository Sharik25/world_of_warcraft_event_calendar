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
  },
  background: {
    css: [
      // Harvest moon
      'radial-gradient(circle at 82% 12%, rgb(255 214 150 / 0.9) 0 28px, rgb(255 170 80 / 0.25) 30px, transparent 90px)',
      'radial-gradient(ellipse at 50% 110%, rgb(255 120 20 / 0.28), transparent 60%)',
      'linear-gradient(180deg, #241038 0%, #170d22 55%, #0f0816 100%)',
    ].join(', '),
  },
  particles: 'embers',
};
