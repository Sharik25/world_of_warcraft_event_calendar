import { candyCane, snowCap } from '../art/winter';
import type { ThemeDefinition } from '../types';

/** Feast of Winter Veil: snowy blues, festive reds, gentle snowfall. */
export const theme: ThemeDefinition = {
  id: 'winter-veil',
  label: 'Feast of Winter Veil',
  tokens: {
    '--color-bg': '#0d1b2e',
    '--color-surface': '#eef3f7',
    '--color-ink': '#1a2433',
    '--color-ink-muted': '#46556b',
    '--color-ink-on-dark': '#eef5ff',
    '--color-ink-on-dark-muted': '#a9bdd6',
    '--color-accent': '#e0473f',
    '--color-gold': '#e8c76a',
    '--color-frame': '#1d3350',
    '--glow': '0 0 14px rgb(232 199 106 / 0.5)',
    '--cell-tint': 'rgb(150 200 255 / 0.14)',
    '--particle-color': '#ffffff',
  },
  background: {
    css: [
      'radial-gradient(ellipse at 50% 120%, rgb(255 255 255 / 0.18), transparent 55%)',
      'radial-gradient(ellipse at 20% 0%, rgb(120 170 230 / 0.25), transparent 50%)',
      'linear-gradient(180deg, #16304f 0%, #0d1b2e 60%, #08111e 100%)',
    ].join(', '),
  },
  particles: 'snow',
  numeral: { ornament: { svg: snowCap, placement: 'cap', size: 22 } },
  emblem: candyCane,
  decorations: [{ svg: snowCap, anchor: 'top', size: 34, mobileSize: 24 }],
};
