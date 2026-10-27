import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppShell } from './AppShell';
import { HomePlaceholder } from './HomePlaceholder';

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [{ path: '*', element: <HomePlaceholder /> }],
  },
];

export const router = createBrowserRouter(routes);
