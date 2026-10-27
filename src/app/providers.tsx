import type { ReactNode } from 'react';

/** App-wide providers. ThemeProvider and settings hydration land here in later phases. */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
