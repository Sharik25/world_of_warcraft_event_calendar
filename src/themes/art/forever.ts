import { INK, svg } from './helpers';

/** Hourglass with gold caps and glowing arcane sand. */
export const hourglass = svg(
  '0 0 80 110',
  `<defs><linearGradient id="hg-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bff6ff"/><stop offset="1" stop-color="#3fb6c9"/></linearGradient></defs>
<path d="M18 14 H62 C62 40 46 46 44 55 C46 64 62 70 62 96 H18 C18 70 34 64 36 55 C34 46 18 40 18 14 Z" fill="#dff4f7" fill-opacity=".35" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M26 26 H54 C52 38 44 44 40 50 C36 44 28 38 26 26 Z" fill="url(#hg-s)"/>
<path d="M40 56 V84" stroke="#7fe3f0" stroke-width="2" stroke-dasharray="2 3"/>
<path d="M24 92 C28 80 36 78 40 78 C44 78 52 80 56 92 Z" fill="url(#hg-s)"/>
<g stroke="${INK}" stroke-width="3" stroke-linejoin="round" fill="#e6c06a">
<rect x="8" y="4" width="64" height="11" rx="3"/><rect x="8" y="95" width="64" height="11" rx="3"/></g>
<path d="M14 7 H66 M14 98 H66" stroke="#fff4c8" stroke-width="2" opacity=".6"/>
<path d="M24 20 C24 30 30 36 34 40" fill="none" stroke="#fff" stroke-width="2.5" opacity=".5" stroke-linecap="round"/>`,
);
