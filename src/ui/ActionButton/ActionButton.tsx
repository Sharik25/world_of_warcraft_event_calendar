import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icons';
import { cx } from '../cx';
import styles from './ActionButton.module.css';

interface CommonProps {
  icon: IconName;
  label: string;
  /** Keyboard shortcut hint shown in the slot corner on desktop, e.g. "1". */
  keybind?: string;
  /** Current view / selected state (gold glow + aria-current). */
  active?: boolean;
  className?: string;
}

type LinkProps = CommonProps & { to: string };
type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { to?: undefined };

/** Square action slot with icon + always-visible label. Renders a Link when `to` is given. */
export function ActionButton(props: LinkProps | ButtonProps) {
  const { icon, label, keybind, active = false, className } = props;
  const content: ReactNode = (
    <>
      {keybind && (
        <kbd className={styles.keybind} aria-hidden="true">
          {keybind}
        </kbd>
      )}
      <Icon name={icon} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </>
  );
  const classes = cx(styles.slot, active && styles.active, className);
  const shortcut = keybind ? { 'aria-keyshortcuts': keybind } : {};

  if (props.to !== undefined) {
    return (
      <Link
        to={props.to}
        className={classes}
        aria-current={active ? 'page' : undefined}
        {...shortcut}
      >
        {content}
      </Link>
    );
  }

  const {
    icon: _icon,
    label: _label,
    keybind: _keybind,
    active: _active,
    className: _className,
    to: _to,
    type = 'button',
    ...buttonProps
  } = props;
  return (
    <button
      type={type}
      className={classes}
      aria-current={active ? 'true' : undefined}
      {...shortcut}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
