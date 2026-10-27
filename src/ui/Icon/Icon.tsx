import type { SVGProps } from 'react';
import { iconPaths, type IconName } from './icons';

export type { IconName } from './icons';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Accessible label. Omit for decorative icons next to visible text. */
  title?: string;
}

export function Icon({ name, size = 24, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {iconPaths[name]}
    </svg>
  );
}
