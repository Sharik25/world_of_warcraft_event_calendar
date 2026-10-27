import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../cx';
import styles from './ParchmentCard.module.css';

interface ParchmentCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: ElementType;
  title?: ReactNode;
  /** Heading level for `title`. */
  level?: 2 | 3 | 4;
  /** Tighter padding for list items and small cards. */
  compact?: boolean;
}

/** Parchment surface for readable content: event details, cards, lists. */
export function ParchmentCard({
  as: Tag = 'section',
  title,
  level = 2,
  compact = false,
  className,
  children,
  ...rest
}: ParchmentCardProps) {
  const Heading = `h${level}` as const;
  return (
    <Tag className={cx(styles.card, compact && styles.compact, className)} {...rest}>
      {title && <Heading className={styles.title}>{title}</Heading>}
      {children}
    </Tag>
  );
}
