import { useEffect, useRef } from 'react';

/**
 * Global single-key shortcuts (e.g. "1", "t", "ArrowLeft"). Ignored while typing in a field,
 * with modifier keys held, or while a modal sheet is open.
 */
export function useKeyboardShortcuts(shortcuts: Record<string, (() => void) | undefined>) {
  const ref = useRef(shortcuts);
  useEffect(() => {
    ref.current = shortcuts;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const action = ref.current[key];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}
