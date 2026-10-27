import { INK, svg } from './helpers';

/** Glossy heart. */
export function heart(light = '#ff8fb2', dark = '#d22e65') {
  return svg(
    '0 0 100 92',
    `<defs><radialGradient id="ht-${dark.slice(1)}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs>
<path d="M50 86 C20 64 4 46 4 28 C4 14 16 4 29 4 C39 4 46 10 50 18 C54 10 61 4 71 4 C84 4 96 14 96 28 C96 46 80 64 50 86 Z" fill="url(#ht-${dark.slice(1)})" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
<path d="M20 22 C22 14 30 12 36 16" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>`,
  );
}
