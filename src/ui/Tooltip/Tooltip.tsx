import {
  cloneElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import styles from './Tooltip.module.css';

type TriggerProps = {
  'aria-describedby'?: string;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
};

interface TooltipProps {
  content: string;
  /** A single focusable element (button, link). Touch users see the tip when it gets focus. */
  children: ReactElement<TriggerProps>;
  placement?: 'top' | 'bottom';
}

/** Short supplementary text on hover/focus. Never put essential information only here. */
export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);
  const props = children.props;

  // Keep the open tip inside the viewport (triggers near the screen edge on phones).
  useLayoutEffect(() => {
    const tip = tipRef.current;
    const viewport = document.documentElement.clientWidth;
    if (!open || !tip || !viewport) return;
    const margin = 8;
    tip.style.setProperty('--shift', '0px');
    const { left, right } = tip.getBoundingClientRect();
    const shift =
      right > viewport - margin ? viewport - margin - right : left < margin ? margin - left : 0;
    tip.style.setProperty('--shift', `${shift}px`);
  }, [open]);

  const trigger = cloneElement(children, {
    'aria-describedby': [props['aria-describedby'], id].filter(Boolean).join(' '),
    onMouseEnter: (e: MouseEvent) => {
      setOpen(true);
      props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent) => {
      setOpen(false);
      props.onMouseLeave?.(e);
    },
    onFocus: (e: FocusEvent) => {
      setOpen(true);
      props.onFocus?.(e);
    },
    onBlur: (e: FocusEvent) => {
      setOpen(false);
      props.onBlur?.(e);
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      props.onKeyDown?.(e);
    },
  });

  return (
    <span className={styles.anchor}>
      {trigger}
      <span
        ref={tipRef}
        id={id}
        role="tooltip"
        className={styles.tip}
        data-placement={placement}
        data-open={open || undefined}
      >
        {content}
      </span>
    </span>
  );
}
