import { polar, sparklePath, starPath, svgDataUrl, uniqueSvgIds } from './helpers';

describe('art helpers', () => {
  it('makes SVG ids and their references unique per copy', () => {
    const art =
      '<svg><defs><linearGradient id="g"/></defs><rect fill="url(#g)"/><use href="#g"/></svg>';
    expect(uniqueSvgIds(art, 'a1')).toBe(
      '<svg><defs><linearGradient id="g-a1"/></defs><rect fill="url(#g-a1)"/><use href="#g-a1"/></svg>',
    );
    expect(uniqueSvgIds('<svg><rect/></svg>', 'x')).toBe('<svg><rect/></svg>');
  });

  it('builds geometry and data URLs', () => {
    expect(polar(0, 0, 10, 90)).toEqual([10, 0]);
    expect(starPath(50, 50, 10, 4, 5).startsWith('M50 40')).toBe(true);
    expect(sparklePath(50, 50, 10)).toContain('M50 40');
    expect(svgDataUrl('<svg/>')).toBe('url("data:image/svg+xml,%3Csvg%2F%3E")');
  });
});
