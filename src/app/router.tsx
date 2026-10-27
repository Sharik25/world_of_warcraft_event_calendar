import { createBrowserRouter, type RouteObject } from 'react-router';
import { TodayView } from '@/features/today/TodayView';
import { dayLoader, rootLoader, versionIndexLoader, versionLoader } from './routes/loaders';
import { NotFound } from './routes/NotFound';
import { VersionLayout } from './routes/VersionLayout';

const hydrateFallback = () => null;

export const routes: RouteObject[] = [
  { path: '/', loader: rootLoader, HydrateFallback: hydrateFallback },
  {
    // Hidden design-system gallery (PLAN.md Phase 2). Lazy so it never weighs on the main bundle.
    path: '/dev/ui',
    lazy: async () => ({ Component: (await import('./dev/UiGallery')).UiGallery }),
    HydrateFallback: hydrateFallback,
  },
  {
    id: 'version',
    path: '/:versionId',
    loader: versionLoader,
    Component: VersionLayout,
    ErrorBoundary: NotFound,
    HydrateFallback: hydrateFallback,
    children: [
      { index: true, loader: versionIndexLoader },
      { path: 'today', Component: TodayView },
      { path: 'day/:date', loader: dayLoader, Component: TodayView },
    ],
  },
  { path: '*', Component: NotFound },
];

export const router = createBrowserRouter(routes);
