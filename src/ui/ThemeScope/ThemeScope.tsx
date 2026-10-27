import type { HTMLAttributes } from 'react';
import type { ThemeId } from '@/domain/types';
import { themeStyle, useTheme } from '@/hooks/useTheme';
import { ThemeIdContext } from './themeContext';

interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  themeId: ThemeId;
  /** Paint the theme background on this element (view roots). */
  withBackground?: boolean;
}

/** Applies a theme's tokens (and optionally its background) to everything inside. */
export function ThemeScope({ themeId, withBackground = false, style, ...rest }: ThemeScopeProps) {
  const theme = useTheme(themeId);
  return (
    <ThemeIdContext.Provider value={themeId}>
      <div
        data-theme={theme.id}
        data-particles={theme.particles ?? undefined}
        style={{ ...themeStyle(theme, withBackground), ...style }}
        {...rest}
      />
    </ThemeIdContext.Provider>
  );
}
