import { renderHook, render, screen, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { useTheme, useThemeTokens } from '@/hooks/useTheme';
import { ThemeScope } from '@/ui';
import { baseTheme, getCachedTheme, loadTheme, themeIds } from '..';

describe('theme registry', () => {
  it('loads every registered theme, falling back to base for unknown ids', async () => {
    for (const id of themeIds) {
      expect((await loadTheme(id)).id, id).toBe(id);
    }
    expect((await loadTheme('hallows-end')).id).toBe('hallows-end');
    expect(await loadTheme('does-not-exist')).toBe(baseTheme);
  });
});

describe('useTheme / ThemeScope', () => {
  it('renders with base first, then switches once a lazy theme loads', async () => {
    const id = 'hallows-end';
    const { result } = renderHook(() => useTheme(id));
    if (!getCachedTheme(id)) expect(result.current).toBe(baseTheme);
    await waitFor(() => expect(result.current.id).toBe(id));
  });

  it('exposes tokens as inline custom properties', async () => {
    await loadTheme('hallows-end');
    const { result } = renderHook(() => useThemeTokens('hallows-end'));
    expect(result.current).toMatchObject({ '--color-accent': '#ff8a1f' });
  });

  it('ThemeScope sets data-theme, particles and CSS variables', async () => {
    await loadTheme('hallows-end');
    render(createElement(ThemeScope, { themeId: 'hallows-end', withBackground: true }, 'x'));
    const el = screen.getByText('x');
    expect(el).toHaveAttribute('data-theme', 'hallows-end');
    expect(el).toHaveAttribute('data-particles', 'embers');
    expect(el.style.getPropertyValue('--color-bg')).toBe('#170d22');
  });
});
