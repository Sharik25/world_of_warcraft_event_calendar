import { INK, svg } from './helpers';

/** Tankard of amber ale with foam spilling over. */
export const mug = svg(
  '0 0 110 116',
  `<path d="M74 44 C100 44 100 88 74 88" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
<path d="M74 44 C100 44 100 88 74 88" fill="none" stroke="#c49a5a" stroke-width="6" stroke-linecap="round"/>
<rect x="14" y="30" width="62" height="80" rx="6" fill="#f0a830" stroke="${INK}" stroke-width="3"/>
<g stroke="#c9822a" stroke-width="2"><path d="M30 40 V102"/><path d="M60 40 V102"/></g>
<path d="M22 46 V96" stroke="#ffe6a8" stroke-width="5" stroke-linecap="round" opacity=".6"/>
<g fill="#fff7e0" stroke="${INK}" stroke-width="2.5"><circle cx="22" cy="28" r="12"/><circle cx="40" cy="22" r="14"/><circle cx="60" cy="24" r="13"/><circle cx="74" cy="30" r="9"/><path d="M70 34 Q74 50 70 54 Q66 50 68 36 Z"/></g>
<g fill="#fff7e0"><rect x="20" y="28" width="52" height="10"/></g>`,
);
