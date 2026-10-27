import { useRef, type TouchEvent } from 'react';

const MIN_DISTANCE = 60; // px
const MAX_DURATION = 800; // ms
const DIRECTION_RATIO = 1.5; // horizontal movement must clearly dominate vertical

/**
 * Horizontal swipe → previous/next period. Plain touch events, so taps and clicks are untouched
 * and vertical scrolling stays native.
 */
export function useSwipeNav(onPrev: () => void, onNext: () => void) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  return {
    onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      start.current =
        e.touches.length === 1 && touch
          ? { x: touch.clientX, y: touch.clientY, t: Date.now() }
          : null;
    },
    onTouchEnd(e: TouchEvent) {
      const from = start.current;
      const touch = e.changedTouches[0];
      start.current = null;
      if (!from || !touch || Date.now() - from.t > MAX_DURATION) return;
      const dx = touch.clientX - from.x;
      const dy = touch.clientY - from.y;
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < DIRECTION_RATIO * Math.abs(dy)) return;
      if (dx > 0) onPrev();
      else onNext();
    },
    onTouchCancel() {
      start.current = null;
    },
  };
}
