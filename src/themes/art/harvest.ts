import { INK, svg } from './helpers';

/** Five-lobed autumn leaf. */
export function leaf(fill: string, vein = '#6b2f0e') {
  return svg(
    '0 0 80 84',
    `<path d="M40 80 L40 66 C30 72 18 70 12 62 L20 56 C8 52 2 42 4 34 L16 36 C12 26 14 14 20 8 L30 20 C32 10 36 4 40 2 C44 4 48 10 50 20 L60 8 C66 14 68 26 64 36 L76 34 C78 42 72 52 60 56 L68 62 C62 70 50 72 40 66" fill="${fill}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M40 78 V12 M40 50 L18 30 M40 50 L62 30 M40 62 L20 60 M40 62 L60 60" fill="none" stroke="${vein}" stroke-width="1.8" stroke-linecap="round"/>`,
  );
}
