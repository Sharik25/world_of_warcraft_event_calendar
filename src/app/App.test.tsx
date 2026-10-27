import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from './router';
import { strings } from '@/strings/en';

describe('App shell', () => {
  it('renders the app name and the fan-made disclaimer', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { level: 1, name: strings.app.name })).toBeInTheDocument();
    expect(screen.getByText(/Not affiliated with or endorsed by Blizzard/)).toBeInTheDocument();
  });
});
