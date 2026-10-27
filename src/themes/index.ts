import type { ThemeId } from '@/domain/types';
import { theme as baseTheme } from './base/theme';
import type { ThemeDefinition } from './types';

export type { ParticleKind, ThemeDefinition, ThemeToken } from './types';
export { baseTheme };

type ThemeLoader = () => Promise<{ theme: ThemeDefinition }>;

/**
 * Theme registry. The base theme is bundled; event themes are lazy-loaded.
 * `null` = id reserved by event data but not designed yet (renders with the base theme).
 * Add a theme: create `./<id>/theme.ts`, then point its entry at `() => import('./<id>/theme')`.
 */
const themeLoaders: Record<ThemeId, ThemeLoader | null> = {
  base: async () => ({ theme: baseTheme }),
  'hallows-end': () => import('./hallows-end/theme'),
  'lunar-festival': null,
  'love-is-in-the-air': null,
  noblegarden: null,
  'childrens-week': null,
  midsummer: null,
  fireworks: null,
  'harvest-festival': null,
  brewfest: null,
  'winter-veil': null,
  'darkmoon-faire': null,
  fishing: null,
};

export const themeIds: readonly ThemeId[] = Object.keys(themeLoaders);

const cache = new Map<ThemeId, ThemeDefinition>([['base', baseTheme]]);

/** Already-loaded theme, if any (synchronous). */
export function getCachedTheme(id: ThemeId): ThemeDefinition | undefined {
  return cache.get(id);
}

/** Loads a theme, falling back to the base theme for unknown or not-yet-designed ids. */
export async function loadTheme(id: ThemeId): Promise<ThemeDefinition> {
  const cached = cache.get(id);
  if (cached) return cached;
  const loader = themeLoaders[id];
  const theme = loader ? (await loader()).theme : baseTheme;
  cache.set(id, theme);
  return theme;
}
