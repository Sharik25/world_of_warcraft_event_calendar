import { Outlet } from 'react-router';
import { strings } from '@/strings/en';
import { ThemeScope } from '@/ui';
import styles from './AppShell.module.css';

export function AppShell() {
  // Phase 3 swaps this for the dominant event's theme of the viewed day.
  return (
    <ThemeScope themeId="base" withBackground className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <small>{strings.legal.disclaimer}</small>
      </footer>
    </ThemeScope>
  );
}
