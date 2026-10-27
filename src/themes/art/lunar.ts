import { INK, svg } from './helpers';

/** Paper lantern with gold caps and a tassel. */
export function lantern(body = '#d8322a', light = '#ff7a4a') {
  return svg(
    '0 0 70 124',
    `<defs><radialGradient id="ln-${body.slice(1)}" cx="45%" cy="45%" r="60%"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${body}"/></radialGradient></defs>
<line x1="35" y1="0" x2="35" y2="14" stroke="${INK}" stroke-width="2"/>
<rect x="23" y="13" width="24" height="9" rx="2" fill="#e8b54a" stroke="${INK}" stroke-width="2"/>
<ellipse cx="35" cy="58" rx="29" ry="37" fill="url(#ln-${body.slice(1)})" stroke="${INK}" stroke-width="2.5"/>
<g fill="none" stroke="${INK}" stroke-width="1.4" opacity=".55"><path d="M35 22 V95"/><path d="M22 25 Q12 58 22 92"/><path d="M48 25 Q58 58 48 92"/></g>
<rect x="23" y="93" width="24" height="9" rx="2" fill="#e8b54a" stroke="${INK}" stroke-width="2"/>
<g stroke="#e8b54a" stroke-width="2" stroke-linecap="round"><path d="M31 103 V120"/><path d="M35 103 V122"/><path d="M39 103 V120"/></g>
<path d="M18 46 Q16 58 20 70" stroke="#fff" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>`,
  );
}

/** Coin of ancestry: gold with a square hole. */
export const elderCoin = svg(
  '0 0 80 80',
  `<defs><radialGradient id="ec-g" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#fff0b0"/><stop offset="1" stop-color="#c8902a"/></radialGradient></defs>
<circle cx="40" cy="40" r="36" fill="url(#ec-g)" stroke="${INK}" stroke-width="3"/>
<circle cx="40" cy="40" r="28" fill="none" stroke="#8a5f14" stroke-width="2"/>
<rect x="31" y="31" width="18" height="18" fill="#1b2148" stroke="${INK}" stroke-width="2.5"/>
<g fill="#8a5f14"><path d="M40 14 L43 19 L40 24 L37 19 Z"/><path d="M40 56 L43 61 L40 66 L37 61 Z"/><path d="M14 40 L19 37 L24 40 L19 43 Z"/><path d="M56 40 L61 37 L66 40 L61 43 Z"/></g>`,
);
