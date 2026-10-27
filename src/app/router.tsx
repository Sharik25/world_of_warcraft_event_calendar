import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppShell } from './AppShell';
import { HomePlaceholder } from './HomePlaceholder';

export const routes: RouteObject[] = [
  {
    // Hidden design-system gallery (PLAN.md Phase 2). Lazy so it never weighs on the main bundle.
    path: '/dev/ui',
    lazy: async () => ({ Component: (await import('./dev/UiGallery')).UiGallery }),
  },
  {
    element: <AppShell />,
    children: [{ path: '*', element: <HomePlaceholder /> }],
  },
];

export const router = createBrowserRouter(routes);
