import { INK, polar, r1, sparklePath, starPath, svg } from './helpers';

/**
 * A string of pennants hanging along the top edge; seamless 200px tile.
 * `shape` changes the pennant: flags, hearts or little flames.
 */
export function bunting(
  colors: string[],
  shape: 'flag' | 'heart' | 'flame' = 'flag',
  cord = '#d9b46a',
) {
  const sag = (x: number) => 6 + 14 * Math.sin((Math.PI * x) / 200);
  const items = [20, 60, 100, 140, 180].map((x, i) => {
    const y = r1(sag(x));
    const c = colors[i % colors.length];
    if (shape === 'heart') {
      return `<path d="M${x} ${y + 22} C${x - 14} ${y + 12} ${x - 12} ${y} ${x - 6} ${y} C${x - 2} ${y} ${x} ${y + 3} ${x} ${y + 5} C${x} ${y + 3} ${x + 2} ${y} ${x + 6} ${y} C${x + 12} ${y} ${x + 14} ${y + 12} ${x} ${y + 22} Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
    }
    if (shape === 'flame') {
      return `<path d="M${x} ${y + 26} C${x - 11} ${y + 20} ${x - 9} ${y + 8} ${x - 3} ${y + 2} C${x - 3} ${y + 9} ${x + 1} ${y + 9} ${x + 2} ${y + 3} C${x + 9} ${y + 9} ${x + 11} ${y + 20} ${x} ${y + 26} Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/><path d="M${x} ${y + 23} C${x - 4} ${y + 20} ${x - 3} ${y + 15} ${x} ${y + 12} C${x + 3} ${y + 15} ${x + 4} ${y + 20} ${x} ${y + 23} Z" fill="#ffe27a"/>`;
    }
    return `<path d="M${x - 11} ${y - 1} L${x + 11} ${y + 1} L${x} ${y + 26} Z" fill="${c}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><path d="M${x - 6} ${y + 2} L${x - 1} ${y + 3} L${x - 3} ${y + 12} Z" fill="#fff" opacity=".25"/>`;
  });
  return svg(
    '0 0 200 48',
    `<path d="M0 6 Q100 34 200 6" fill="none" stroke="${cord}" stroke-width="2"/>${items.join('')}`,
  );
}

/** Four-point twinkle. */
export function sparkle(fill: string) {
  return svg(
    '0 0 100 100',
    `<path d="${sparklePath(50, 50, 46)}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`,
  );
}

/** Five-point star with a highlight. */
export function star(fill: string) {
  return svg(
    '0 0 100 100',
    `<path d="${starPath(50, 54, 46, 20)}" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="${starPath(44, 46, 14, 6)}" fill="#fff" opacity=".35"/>`,
  );
}

/** Firework burst: alternating long and short rays tipped with dots. */
export function burst(c1: string, c2: string) {
  const rays: string[] = [];
  for (let i = 0; i < 16; i++) {
    const long = i % 2 === 0;
    const deg = i * 22.5;
    const [x1, y1] = polar(60, 60, long ? 12 : 10, deg);
    const [x2, y2] = polar(60, 60, long ? 50 : 36, deg);
    const color = long ? c1 : c2;
    rays.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${long ? 3.5 : 2.5}" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="${long ? 4 : 3}" fill="${color}"/>`,
    );
  }
  return svg('0 0 120 120', `${rays.join('')}<circle cx="60" cy="60" r="6" fill="#fff8d6"/>`);
}

/** Pumpkin; `carved` adds a candle-lit face. */
export function pumpkin(carved: boolean, leaf = true) {
  const face = carved
    ? `<g fill="url(#pk-c)" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
<path d="M33 50 L47 40 L50 58 Z"/><path d="M87 50 L73 40 L70 58 Z"/><path d="M56 64 L60 56 L64 64 Z"/>
<path d="M30 72 L38 78 L44 72 L50 80 L56 72 L64 80 L70 72 L76 80 L82 72 L90 72 Q86 96 60 96 Q34 96 30 72 Z"/></g>`
    : '';
  const vine = leaf
    ? `<path d="M64 20 C76 8 90 14 86 24 C80 20 74 22 64 22 Z" fill="#5e8a2c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M58 18 C50 10 44 14 46 20" fill="none" stroke="#5e8a2c" stroke-width="2.5" stroke-linecap="round"/>`
    : '';
  return svg(
    '0 0 120 112',
    `<defs><radialGradient id="pk-b" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffbb55"/><stop offset=".55" stop-color="#ef7d14"/><stop offset="1" stop-color="#9b3e08"/></radialGradient>
<radialGradient id="pk-c" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff6b0"/><stop offset="1" stop-color="#ffaa00"/></radialGradient></defs>
<path d="M56 24 C54 14 58 6 68 4 L71 10 C65 12 63 17 64 24 Z" fill="#6b5a24" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
<g stroke="${INK}" stroke-width="2.5" fill="url(#pk-b)">
<ellipse cx="32" cy="64" rx="27" ry="38"/><ellipse cx="88" cy="64" rx="27" ry="38"/><ellipse cx="60" cy="64" rx="31" ry="43"/></g>
<path d="M44 34 C38 44 38 58 42 66" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".3"/>
${face}${vine}`,
  );
}
