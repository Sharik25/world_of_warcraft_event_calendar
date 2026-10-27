import { INK, starPath, svg } from './helpers';

/** Diamond kite with a bow-tied tail. */
export const kite = svg(
  '0 0 110 170',
  `<g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
<path d="M50 4 L50 52 L10 52 Z" fill="#ffcd3c"/><path d="M50 4 L90 52 L50 52 Z" fill="#e8463c"/>
<path d="M10 52 L50 52 L50 112 Z" fill="#3a8fd9"/><path d="M90 52 L50 52 L50 112 Z" fill="#3fb26a"/></g>
<path d="M50 4 V112 M10 52 H90" stroke="#6b3f1d" stroke-width="2"/>
<path d="M50 112 C40 126 64 132 54 146 C46 156 66 160 60 168" fill="none" stroke="${INK}" stroke-width="2"/>
<g stroke="${INK}" stroke-width="1.5"><path d="M44 126 L54 130 L44 134 Z" fill="#e8463c"/><path d="M64 142 L54 146 L64 150 Z" fill="#ffcd3c"/></g>`,
);

/** Paper star. */
export const paperStar = svg(
  '0 0 100 100',
  `<path d="${starPath(50, 54, 46, 20)}" fill="#fff1a8" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M50 8 L50 54 L94 40 M50 54 L78 92 M50 54 L22 92 M50 54 L6 40" stroke="#e0c25a" stroke-width="1.5" fill="none"/>`,
);
