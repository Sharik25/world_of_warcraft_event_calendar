import { INK, r1, svg } from './helpers';

/** Striped candy cane. */
export const candyCane = svg(
  '0 0 64 140',
  `<path d="M20 134 V42 C20 12 52 12 52 34" fill="none" stroke="${INK}" stroke-width="19" stroke-linecap="round"/>
<path d="M20 134 V42 C20 12 52 12 52 34" fill="none" stroke="#fbf6ee" stroke-width="13" stroke-linecap="round"/>
<path d="M20 134 V42 C20 12 52 12 52 34" fill="none" stroke="#d63a3a" stroke-width="13" stroke-dasharray="9 9"/>
<path d="M16 128 V46" stroke="#fff" stroke-width="2.5" opacity=".5" stroke-linecap="round"/>`,
);

/** Snow-capped top edge with icicles; seamless 200px tile. */
export const snowCap = (() => {
  const drips = [0, 25, 50, 75, 100, 125, 150, 175, 200];
  let d = 'M0 0 H200 V14';
  for (let i = drips.length - 1; i > 0; i--) {
    const a = drips[i] ?? 0;
    const b = drips[i - 1] ?? 0;
    d += ` Q${r1((a + b) / 2)} ${i % 2 ? 30 : 24} ${b} 14`;
  }
  d += ' Z';
  const icicles = [12, 63, 112, 162]
    .map(
      (x) =>
        `<path d="M${x} 16 L${x + 4} 34 L${x + 8} 16 Z" fill="#cfe6fb" stroke="#9cc0e3" stroke-width="1"/>`,
    )
    .join('');
  return svg(
    '0 0 200 40',
    `${icicles}<path d="${d}" fill="#f6f9ff" stroke="#c4d6ea" stroke-width="1.5"/>`,
  );
})();
