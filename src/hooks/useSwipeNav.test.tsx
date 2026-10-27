import { fireEvent, render } from '@testing-library/react';
import { useSwipeNav } from './useSwipeNav';

function Swipeable({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return <div data-testid="area" {...useSwipeNav(onPrev, onNext)} />;
}

function swipe(el: HTMLElement, from: [number, number], to: [number, number], ms = 200) {
  fireEvent.touchStart(el, { touches: [{ clientX: from[0], clientY: from[1] }] });
  vi.advanceTimersByTime(ms);
  fireEvent.touchEnd(el, { changedTouches: [{ clientX: to[0], clientY: to[1] }] });
}

beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));
afterEach(() => vi.useRealTimers());

describe('useSwipeNav', () => {
  it('maps left/right swipes to next/previous and ignores taps, slow or vertical gestures', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { getByTestId } = render(<Swipeable onPrev={onPrev} onNext={onNext} />);
    const area = getByTestId('area');

    swipe(area, [300, 100], [100, 110]);
    expect(onNext).toHaveBeenCalledTimes(1);
    swipe(area, [100, 100], [300, 90]);
    expect(onPrev).toHaveBeenCalledTimes(1);

    swipe(area, [100, 100], [110, 100]); // tap
    swipe(area, [100, 100], [300, 100], 2000); // too slow
    swipe(area, [100, 100], [180, 400]); // mostly vertical scroll
    fireEvent.touchStart(area, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchCancel(area);
    fireEvent.touchEnd(area, { changedTouches: [{ clientX: 300, clientY: 0 }] });
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrev).toHaveBeenCalledTimes(1);
  });
});
