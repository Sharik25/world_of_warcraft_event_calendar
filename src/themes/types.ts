import type { ThemeId } from '@/domain/types';

export type ThemeToken =
  | '--color-bg'
  | '--color-surface'
  | '--color-ink'
  | '--color-ink-muted'
  | '--color-ink-on-dark'
  | '--color-ink-on-dark-muted'
  | '--color-accent'
  | '--color-gold'
  | '--color-frame'
  | '--glow'
  | '--cell-tint'
  | '--font-display';

export type ParticleKind = 'embers' | 'snow' | 'petals' | 'sparkles' | 'bubbles';

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  tokens: Partial<Record<ThemeToken, string>>; // CSS custom properties
  background?: { css: string }; // gradients / SVG patterns
  particles?: ParticleKind | null;
  numeral?: { ornamentSvg?: string }; // ornament around the date numeral
}
