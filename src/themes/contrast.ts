/** WCAG 2.x contrast helpers for theme tokens (hex colors only). */

export function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m?.[1]) throw new Error(`Expected a #rrggbb color, got "${hex}"`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** `color-mix(in srgb, a p%, b)` as hex. */
export function mix(a: string, b: string, p: number): string {
  const ca = parseHex(a);
  const cb = parseHex(b);
  return `#${ca
    .map((v, i) => Math.round(v * p + (cb[i] ?? 0) * (1 - p)))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}
