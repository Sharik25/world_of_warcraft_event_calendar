/**
 * Helpers for the original SVG art used by event themes. Style: chunky dark outlines,
 * warm cel-shaded gradients and highlights, in the spirit of classic hand-painted fantasy art.
 */

/** Dark outline shared by most art. */
export const INK = '#1c1008';

export function svg(viewBox: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;
}

/** Rounds to one decimal to keep markup small. */
export const r1 = (x: number) => Math.round(x * 10) / 10;

/** Point at `deg` (0 = up, clockwise) on a circle. */
export function polar(cx: number, cy: number, radius: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r1(cx + radius * Math.cos(a)), r1(cy + radius * Math.sin(a))];
}

/** Path data for a star with `points` tips. */
export function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 5,
  rot = 0,
) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const [x, y] = polar(cx, cy, i % 2 ? inner : outer, rot + (i * 180) / points);
    pts.push(`${x} ${y}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** Four-point twinkle star. */
export function sparklePath(cx: number, cy: number, radius: number) {
  const k = radius * 0.16;
  return `M${cx} ${cy - radius} C${cx + k} ${cy - k} ${cx + k} ${cy - k} ${cx + radius} ${cy} C${cx + k} ${cy + k} ${cx + k} ${cy + k} ${cx} ${cy + radius} C${cx - k} ${cy + k} ${cx - k} ${cy + k} ${cx - radius} ${cy} C${cx - k} ${cy - k} ${cx - k} ${cy - k} ${cx} ${cy - radius} Z`;
}

/** `url("data:image/svg+xml,…")` for repeating edge strips. */
export function svgDataUrl(markup: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(markup)}")`;
}

/**
 * Suffixes every `id` in SVG markup (and its `url(#…)` / `href="#…"` references) so several copies
 * of the same art can live on one page. Without this, a gradient defined in a hidden copy can't be
 * used by a visible one, and the visible copy loses its fill.
 */
export function uniqueSvgIds(markup: string, suffix: string): string {
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].flatMap((m) => (m[1] ? [m[1]] : []));
  return ids.reduce<string>(
    (out, id) =>
      out
        .replaceAll(`id="${id}"`, `id="${id}-${suffix}"`)
        .replaceAll(`url(#${id})`, `url(#${id}-${suffix})`)
        .replaceAll(`href="#${id}"`, `href="#${id}-${suffix}"`),
    markup,
  );
}
