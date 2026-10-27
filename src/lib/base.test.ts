import { appBaseUrl, BASE_PATH, publicPath, ROUTER_BASENAME } from './base';

describe('base path helpers (tests run at "/")', () => {
  it('resolves public files and app URLs from the base path', () => {
    expect(BASE_PATH).toBe('/');
    expect(ROUTER_BASENAME).toBe('/');
    expect(publicPath('calendars/a.ics')).toBe('/calendars/a.ics');
    expect(publicPath('/icons/x.png')).toBe('/icons/x.png');
    expect(appBaseUrl('https://example.com')).toBe('https://example.com');
  });
});
