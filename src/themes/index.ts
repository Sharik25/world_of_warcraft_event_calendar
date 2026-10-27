import type { ThemeId } from '@/domain/types';

/**
 * Theme registry. Phase 1 lists the ids only, so data validation can check every `themeId`.
 * Phase 2 adds the base theme and Phase 5 adds lazy loaders (`() => import('./<id>/theme')`).
 */
export const themeIds: readonly ThemeId[] = [
  'base',
  'lunar-festival',
  'love-is-in-the-air',
  'noblegarden',
  'childrens-week',
  'midsummer',
  'fireworks',
  'harvest-festival',
  'brewfest',
  'hallows-end',
  'winter-veil',
  'darkmoon-faire',
  'fishing',
];
