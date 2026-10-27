import type { HTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Badge.module.css';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `tag`: small label. `seal`: round wax seal (keep content to 1–2 characters + `label`). */
  variant?: 'tag' | 'seal';
  tone?: 'neutral' | 'accent' | 'unconfirmed';
  /** Accessible text for seals whose visible content is a symbol. */
  label?: string;
}

export function Badge({
  variant = 'tag',
  tone = 'neutral',
  label,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[variant], styles[tone], className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      {...rest}
    >
      {children}
    </span>
  );
}
