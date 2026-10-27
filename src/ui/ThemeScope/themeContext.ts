import { createContext, useContext } from 'react';
import type { ThemeId } from '@/domain/types';

export const ThemeIdContext = createContext<ThemeId>('base');

/** Id of the nearest enclosing theme, so portals (sheets, popovers) can re-apply it. */
export function useScopeThemeId(): ThemeId {
  return useContext(ThemeIdContext);
}
