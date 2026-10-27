import { INK, svg } from './helpers';

/** Fish leaping out of the water. */
export const leapingFish = svg(
  '0 0 130 72',
  `<defs><linearGradient id="fs-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fc1c9"/><stop offset=".6" stop-color="#1e7f93"/><stop offset="1" stop-color="#e2b85a"/></linearGradient></defs>
<path d="M92 36 L124 12 L118 36 L124 60 Z" fill="#1e7f93" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M6 36 C24 8 70 6 96 36 C70 66 24 64 6 36 Z" fill="url(#fs-g)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M46 16 L60 4 L68 18 Z" fill="#1e7f93" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
<g fill="none" stroke="#bff3f7" stroke-width="1.5" opacity=".6"><path d="M44 28 Q48 34 44 40"/><path d="M54 26 Q58 34 54 42"/><path d="M64 28 Q68 34 64 40"/></g>
<circle cx="22" cy="31" r="5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><circle cx="21" cy="31" r="2.5" fill="${INK}"/>
<path d="M8 40 Q14 42 18 40" stroke="${INK}" stroke-width="1.5" fill="none"/>`,
);

/** Water ripples along the bottom edge; seamless 200px tile. */
export const ripples = svg(
  '0 0 200 40',
  `<path d="M0 14 Q25 4 50 14 T100 14 T150 14 T200 14 V40 H0 Z" fill="#0f5664" opacity=".85"/>
<path d="M0 22 Q25 12 50 22 T100 22 T150 22 T200 22" fill="none" stroke="#5fd3dd" stroke-width="2" opacity=".7"/>
<path d="M0 14 Q25 4 50 14 T100 14 T150 14 T200 14" fill="none" stroke="#bff3f7" stroke-width="2.5"/>
<path d="M20 32 Q35 28 50 32 M120 30 Q135 26 150 30" fill="none" stroke="#bff3f7" stroke-width="1.5" opacity=".5"/>`,
);
