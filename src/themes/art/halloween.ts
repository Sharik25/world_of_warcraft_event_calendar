import { INK, polar, r1, svg } from './helpers';

/** Spider dangling on a silk thread. */
export const hangingSpider = svg(
  '0 0 60 140',
  `<line x1="30" y1="0" x2="30" y2="78" stroke="#e6def0" stroke-width="1.2" opacity=".85"/>
<g stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round">
<path d="M24 88 Q10 78 4 86"/><path d="M24 93 Q8 92 2 103"/><path d="M25 99 Q10 105 6 119"/><path d="M26 105 Q16 117 14 129"/>
<path d="M36 88 Q50 78 56 86"/><path d="M36 93 Q52 92 58 103"/><path d="M35 99 Q50 105 54 119"/><path d="M34 105 Q44 117 46 129"/></g>
<ellipse cx="30" cy="101" rx="13" ry="15" fill="#2c1a3a" stroke="${INK}" stroke-width="2.5"/>
<path d="M25 106 L30 100 L35 106 L30 112 Z" fill="#c9381a"/>
<circle cx="30" cy="83" r="8" fill="#3b2550" stroke="${INK}" stroke-width="2.5"/>
<ellipse cx="25" cy="95" rx="3.5" ry="6" fill="#fff" opacity=".18"/>
<circle cx="27" cy="82" r="1.9" fill="#ff5a2e"/><circle cx="33" cy="82" r="1.9" fill="#ff5a2e"/>`,
);

/** Bat with spread wings. */
export const bat = svg(
  '0 0 120 60',
  `<path d="M60 24 C55 15 50 14 48 18 C42 9 28 5 12 11 C21 15 23 21 21 28 C29 24 35 27 37 34 C43 30 49 32 51 38 C54 34 57 34 60 38 C63 34 66 34 69 38 C71 32 77 30 83 34 C85 27 91 24 99 28 C97 21 99 15 108 11 C92 5 78 9 72 18 C70 14 65 15 60 24 Z" fill="#2b1534" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
<path d="M53 22 L51 11 L57 17 Z M67 22 L69 11 L63 17 Z" fill="#2b1534" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
<ellipse cx="60" cy="26" rx="7" ry="8" fill="#3a1d46" stroke="${INK}" stroke-width="2"/>
<circle cx="57.5" cy="24.5" r="1.6" fill="#ffd23f"/><circle cx="62.5" cy="24.5" r="1.6" fill="#ffd23f"/>
<path d="M30 14 C38 14 44 18 46 22" fill="none" stroke="#fff" stroke-width="1.5" opacity=".2"/>`,
);

/** Cobweb fanning out from a top-left corner. */
export const cobweb = (() => {
  const angles = [0, 18, 36, 54, 72, 90].map((a) => a + 90); // fan from right (90°) to down (180°)
  const spokes = angles
    .map((deg) => {
      const [x, y] = polar(0, 0, 140, deg);
      return `<line x1="0" y1="0" x2="${x}" y2="${y}"/>`;
    })
    .join('');
  const rings = [32, 58, 86, 116]
    .map((rad) => {
      // Threads sag toward the corner between spokes.
      const d = angles
        .map((deg, i) => {
          const [x, y] = polar(0, 0, rad, deg);
          if (i === 0) return `M${x} ${y}`;
          const [px, py] = polar(0, 0, rad, angles[i - 1] ?? deg);
          return `Q${r1((px + x) / 2 - rad * 0.06)} ${r1((py + y) / 2 - rad * 0.06)} ${x} ${y}`;
        })
        .join(' ');
      return `<path d="${d}"/>`;
    })
    .join('');
  return svg(
    '0 0 120 120',
    `<g fill="none" stroke="#ece6f4" stroke-width="1.3" opacity=".7">${spokes}${rings}</g>`,
  );
})();
