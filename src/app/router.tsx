import { createBrowserRouter, type RouteObject } from 'react-router';
import { MonthView } from '@/features/month/MonthView';
import { TodayView } from '@/features/today/TodayView';
import { WeekView } from '@/features/week/WeekView';
import type { ViewMode } from './paths';
import {
  dayLoader,
  monthLoader,
  rootLoader,
  versionIndexLoader,
  versionLoader,
  weekLoader,
} from './routes/loaders';
import { NotFound } from './routes/NotFound';
import { VersionLayout } from './routes/VersionLayout';

const hydrateFallback = () => null;
const view = (mode: ViewMode) => ({ view: mode });

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
      { path: 'today', Component: TodayView, handle: view('day') },
      { path: 'day/:date', loader: dayLoader, Component: TodayView, handle: view('day') },
      { path: 'week', loader: weekLoader },
      { path: 'week/:date', loader: weekLoader, Component: WeekView, handle: view('week') },
      { path: 'month', loader: monthLoader },
      { path: 'month/:month', loader: monthLoader, Component: MonthView, handle: view('month') },
    ],
  },
  { path: '*', Component: NotFound },
];

export const router = createBrowserRouter(routes);
