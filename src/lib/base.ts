/**
 * Where the app is served from: "/" locally and on a root domain, "/<repo>/" on GitHub Pages
 * (set at build time with BASE_PATH). Router paths are relative to it; files in public/ are not.
 */
export const BASE_PATH: string = import.meta.env.BASE_URL;

/** Router basename: the base path without its trailing slash ("/" stays "/"). */
export const ROUTER_BASENAME = BASE_PATH === '/' ? '/' : BASE_PATH.replace(/\/$/, '');

/** URL path of a file in public/, e.g. publicPath('calendars/x.ics') → "/repo/calendars/x.ics". */
export function publicPath(path: string): string {
  return `${BASE_PATH}${path.replace(/^\//, '')}`;
}

/** Absolute app URL without trailing slash, e.g. "https://user.github.io/repo". */
export function appBaseUrl(origin = window.location.origin): string {
  return `${origin}${ROUTER_BASENAME === '/' ? '' : ROUTER_BASENAME}`;
}
