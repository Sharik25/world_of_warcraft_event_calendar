import { INK, r1, svg } from './helpers';

/** Painted egg with a zigzag band and dots. */
export function paintedEgg(base: string, band: string, dots = '#ffffff') {
  return svg(
    '0 0 70 90',
    `<path d="M35 4 C56 4 66 40 66 56 C66 76 52 86 35 86 C18 86 4 76 4 56 C4 40 14 4 35 4 Z" fill="${base}" stroke="${INK}" stroke-width="2.5"/>
<path d="M6 50 L14 44 L22 50 L30 44 L38 50 L46 44 L54 50 L62 44 L65 47 L65 58 L58 64 L50 58 L42 64 L34 58 L26 64 L18 58 L10 64 L5 60 Z" fill="${band}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
<g fill="${dots}"><circle cx="24" cy="28" r="3"/><circle cx="40" cy="22" r="3"/><circle cx="48" cy="34" r="3"/><circle cx="30" cy="74" r="3"/><circle cx="46" cy="74" r="3"/></g>
<path d="M18 30 C20 18 26 12 32 10" fill="none" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`,
  );
}

/** Grass with little flowers along the bottom edge; seamless 200px tile. */
export const grassEdge = (() => {
  const blades = Array.from({ length: 25 }, (_, i) => {
    const x = r1(i * 8 + 2);
    const h = 14 + ((i * 7) % 11);
    return `<path d="M${x} 40 Q${x + 2} ${40 - h / 2} ${x + 5} ${40 - h} Q${x + 4} ${40 - h / 2} ${x + 7} 40 Z"/>`;
  }).join('');
  const flowers = [
    [30, 26, '#f7a8d0'],
    [88, 22, '#fff3a6'],
    [146, 27, '#a8d8f7'],
    [180, 24, '#f7a8d0'],
  ]
    .map(
      ([x, y, c]) =>
        `<path d="M${x} ${y} V40" stroke="#2c5e24" stroke-width="1.5"/><g transform="translate(${x} ${y})"><circle cx="0" cy="-5" r="4" fill="${c}"/><circle cx="5" cy="0" r="4" fill="${c}"/><circle cx="0" cy="5" r="4" fill="${c}"/><circle cx="-5" cy="0" r="4" fill="${c}"/><circle r="3" fill="#ffd24a"/></g>`,
    )
    .join('');
  return svg(
    '0 0 200 40',
    `<g fill="#4f9a3e" stroke="#2c5e24" stroke-width="1">${blades}</g>${flowers}`,
  );
})();
