import { Outlet } from 'react-router';
import { strings } from '@/strings/en';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <small>{strings.legal.disclaimer}</small>
      </footer>
    </div>
  );
}
