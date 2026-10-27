import { INK, polar, svg } from './helpers';

/** Crossed logs with a tall, layered flame. */
export const bonfire = svg(
  '0 0 120 136',
  `<path d="M60 8 C84 34 98 58 92 86 C88 104 76 112 60 112 C44 112 32 104 28 86 C22 58 40 40 46 22 C50 38 56 44 60 46 C62 32 60 20 60 8 Z" fill="#ff5a1a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M60 36 C76 54 82 72 78 88 C74 102 66 106 60 106 C52 106 44 100 42 88 C40 72 50 62 52 50 C56 60 60 62 62 62 C64 54 62 44 60 36 Z" fill="#ffa31a"/>
<path d="M60 66 C68 76 70 86 68 94 C66 100 62 102 60 102 C56 102 52 98 52 92 C52 84 56 80 58 74 C60 80 62 78 60 66 Z" fill="#ffe066"/>
<g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
<rect x="10" y="108" width="100" height="16" rx="8" fill="#7a4622" transform="rotate(-10 60 116)"/>
<rect x="10" y="108" width="100" height="16" rx="8" fill="#8f5428" transform="rotate(10 60 116)"/></g>
<g fill="#5a3216"><circle cx="17" cy="127" r="4"/><circle cx="103" cy="127" r="4"/></g>`,
);

/** Radiant sun with wavy rays. */
export const sun = (() => {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30;
    const [x1, y1] = polar(60, 60, 34, deg - 9);
    const [x2, y2] = polar(60, 60, 56, deg);
    const [x3, y3] = polar(60, 60, 34, deg + 9);
    return `<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z"/>`;
  }).join('');
  return svg(
    '0 0 120 120',
    `<defs><radialGradient id="sn-g" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#fff2a0"/><stop offset="1" stop-color="#ffaa1a"/></radialGradient></defs>
<g fill="#ffc040" stroke="${INK}" stroke-width="2" stroke-linejoin="round">${rays}</g>
<circle cx="60" cy="60" r="34" fill="url(#sn-g)" stroke="${INK}" stroke-width="3"/>
<path d="M44 46 Q50 38 60 36" fill="none" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/>`,
  );
})();
