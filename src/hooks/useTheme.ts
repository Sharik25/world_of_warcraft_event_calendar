import { useEffect, useReducer, type CSSProperties } from 'react';
import type { ThemeId } from '@/domain/types';
import { baseTheme, getCachedTheme, loadTheme, type ThemeDefinition } from '@/themes';

/** The theme for `id`. Renders with the base theme until a lazy theme has loaded. */
export function useTheme(id: ThemeId): ThemeDefinition {
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const cached = getCachedTheme(id);

  useEffect(() => {
    if (getCachedTheme(id)) return;
    let alive = true;
    void loadTheme(id).then(() => alive && rerender());
    return () => {
      alive = false;
    };
  }, [id]);

  return cached ?? baseTheme;
}

/** Theme tokens as an inline style, e.g. to tint a single calendar cell. */
export function themeStyle(theme: ThemeDefinition, withBackground = false): CSSProperties {
  return {
    ...theme.tokens,
    ...(withBackground && theme.background && { background: theme.background.css }),
  } as CSSProperties;
}

export function useThemeTokens(id: ThemeId): CSSProperties {
  return themeStyle(useTheme(id));
}
