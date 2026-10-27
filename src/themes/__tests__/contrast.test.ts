import { baseTheme, loadTheme, themeIds, type ThemeToken } from '..';
import { contrastRatio, luminance, mix, parseHex } from '../contrast';

/**
 * WCAG AA for every theme (PLAN.md §8.5): body text 4.5:1, large display text (date numeral,
 * countdown, titles) 3:1. Missing tokens inherit from the base theme, as they do in CSS.
 */
const AA = 4.5;
const AA_LARGE = 3;

const COLOR_TOKENS: ThemeToken[] = [
  '--color-bg',
  '--color-surface',
  '--color-ink',
  '--color-ink-muted',
  '--color-ink-on-dark',
  '--color-ink-on-dark-muted',
  '--color-accent',
  '--color-gold',
  '--color-frame',
  '--particle-color',
];

describe('contrast helpers', () => {
  it('computes WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#777777')).toBe(1);
    expect(luminance('#ffffff')).toBe(1);
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(() => parseHex('rgb(0 0 0)')).toThrow(/#rrggbb/);
  });
});

describe.each(themeIds)('theme "%s"', (id) => {
  it('meets AA contrast on parchment, background, frames and event chips', async () => {
    const theme = await loadTheme(id);
    expect(theme.id).toBe(id);
    const t = { ...baseTheme.tokens, ...theme.tokens } as Record<ThemeToken, string>;
    for (const token of COLOR_TOKENS) expect(() => parseHex(t[token]), token).not.toThrow();

    const pairs: [string, string, string, number][] = [
      ['ink on parchment', t['--color-ink'], t['--color-surface'], AA],
      ['muted ink on parchment', t['--color-ink-muted'], t['--color-surface'], AA],
      ['text on background', t['--color-ink-on-dark'], t['--color-bg'], AA],
      ['muted text on background', t['--color-ink-on-dark-muted'], t['--color-bg'], AA],
      ['text on frame (chips, top bar)', t['--color-ink-on-dark'], t['--color-frame'], AA],
      ['date numeral (gold) on frame', t['--color-gold'], t['--color-frame'], AA_LARGE],
      ['countdown (accent) on background', t['--color-accent'], t['--color-bg'], AA_LARGE],
      // Event chips/ribbons: light text on accent mixed into the frame color (lightest stop: 45%).
      [
        'text on event chip',
        t['--color-ink-on-dark'],
        mix(t['--color-accent'], t['--color-frame'], 0.45),
        AA,
      ],
    ];
    const failures = pairs
      .map(([what, fg, bg, min]) => [what, contrastRatio(fg, bg), min] as const)
      .filter(([, ratio, min]) => ratio < min)
      .map(([what, ratio, min]) => `${what}: ${ratio.toFixed(2)} < ${min}`);
    expect(failures).toEqual([]);
  });

  it('stays within the 150 KB asset budget', async () => {
    const theme = await loadTheme(id);
    const bytes = new TextEncoder().encode(JSON.stringify(theme)).length;
    expect(bytes).toBeLessThan(150 * 1024);
  });

  it('keeps decorations well-formed', async () => {
    const theme = await loadTheme(id);
    for (const d of theme.decorations ?? []) {
      expect(d.svg.startsWith('<svg')).toBe(true);
      expect(d.svg).not.toMatch(/<script|on\w+=|javascript:/i);
      expect(d.size).toBeGreaterThan(0);
    }
  });
});
