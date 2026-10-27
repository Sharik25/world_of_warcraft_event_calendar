import type { ElementType, HTMLAttributes } from 'react';
import { cx } from '../cx';
import styles from './Frame.module.css';

interface FrameProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  material?: 'wood' | 'stone';
}

/** Carved wood / stone container with gold trim and corner studs. */
export function Frame({ as: Tag = 'div', material = 'wood', className, ...rest }: FrameProps) {
  return <Tag className={cx(styles.frame, styles[material], className)} {...rest} />;
}
