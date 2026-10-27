// @vitest-environment node
import { readFileSync } from 'node:fs';
import { theme as baseTheme } from '../src/themes/base/theme';

describe('design tokens', () => {
  it('keeps tokens.css :root defaults identical to the base theme tokens', () => {
    const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
    for (const [token, value] of Object.entries(baseTheme.tokens)) {
      expect(css, token).toContain(`${token}: ${value};`);
    }
  });
});
