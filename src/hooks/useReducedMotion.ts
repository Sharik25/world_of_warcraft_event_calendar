import { useSettings } from '@/state/settings';
import { useMediaQuery } from './useMediaQuery';

/** True when animations should be avoided: the user's setting, else the OS preference. */
export function useReducedMotion(): boolean {
  const setting = useSettings((s) => s.reducedMotion);
  const system = useMediaQuery('(prefers-reduced-motion: reduce)');
  return setting === 'on' || (setting === 'system' && system);
}
