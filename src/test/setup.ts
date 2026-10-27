import '@testing-library/jest-dom/vitest';

// jsdom has no matchMedia. Tests default to the mobile layout; set `window.__desktop = true`
// before rendering to get the desktop layout.
declare global {
  interface Window {
    __desktop?: boolean;
  }
}
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('min-width') ? Boolean(window.__desktop) : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
