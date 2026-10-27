# Innkeeper's Almanac — conventions

Fan-made calendar of in-game events for classic WoW versions. Full spec: `PLAN.md` (build phase by phase, §12).

## Commands

Node 22 is required (`nvm use`; see `.nvmrc`). The system default Node 18 is too old for Vite 8 / Playwright.

| Command                                                 | What it does                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                                           | Vite dev server                                                    |
| `npm run build`                                         | `validate-data` → `build-ics` → `tsc -b` → `vite build`            |
| `npm test`                                              | Vitest unit tests (jsdom)                                          |
| `npm run coverage`                                      | Unit tests + coverage (≥ 90% enforced on `src/engine/`)            |
| `npm run e2e`                                           | Playwright, projects `mobile` (iPhone 13) and `desktop` (1280×800) |
| `npm run lint` / `npm run typecheck` / `npm run format` | ESLint / tsc / Prettier                                            |

## Hard rules

1. **Never invent event dates.** Every explicit date in `src/data/**` has `verified: boolean` and `source`. If a date can't be verified against Wowhead, Blizzard news, or the in-game calendar, keep `verified: false`; the UI marks it "unconfirmed".
2. **No Blizzard assets.** No ripped textures, icons, logos, music or client font. All art is original CSS/SVG. Use event names only descriptively. Keep the disclaimer in the footer and About.
3. **Mobile = desktop priority.** Check every component at 360px and 1280px. No horizontal scroll at 360px. Tap targets ≥ 48×48px.
4. **No backend in v1.** Static site + build-time `.ics` feeds.
5. **Data, not code.** Adding an event, theme, version or year must only touch `src/data/**` / `src/themes/**` plus one registry line (PLAN.md §13).

## Folder rules (PLAN.md §4)

- Dependency direction is one-way: **data → engine → UI**.
- `src/domain/`: types + Zod schemas only.
- `src/engine/`: pure TS, **no React, no DOM**. Unit-test heavily (`__tests__/`).
- `src/data/events/`: one file per event (version-agnostic). `src/data/versions/<id>/`: `version.ts` + `schedule-<year>.json`.
- `src/themes/<id>/`: one folder per theme; registry in `src/themes/index.ts` (lazy loaders, `base` bundled).
- `src/features/<feature>/`: views and feature components. `src/ui/`: design-system primitives.
- `src/strings/en.ts`: **all UI copy**. Don't hardcode user-facing strings in components.
- Styling: CSS Modules + CSS custom properties (tokens in `src/styles/tokens.css`). No CSS-in-JS. CSS-only animation, always respect `prefers-reduced-motion`.
- Imports: use the `@/` alias for `src/`. Use `import type` for type-only imports.

## Stack notes

- React 18, TypeScript strict (`noUncheckedIndexedAccess` on).
- Routing uses **React Router v7** (`react-router` package) in data-router mode, instead of v6 as written in PLAN.md. The API is the same as v6, and v6 has unpatched security advisories.
- Build scripts (`scripts/*.ts`, run with `tsx`) load app data through `scripts/lib/load-data.ts`, which uses Vite's module runner. That keeps `import.meta.glob` and the `@/` alias working outside Vite.

## Data notes

- Explicit dates live in `src/data/versions/<id>/schedule-<year>.json`. `version.ts` globs them, so adding a year only means adding a file.
- Set `verified: true` only with a source specific to that version. Every unverified date needs a `note` saying what's unconfirmed (a test enforces this).
- Anniversary assumptions to re-check in-game: US event clock = Pacific time; holiday start/end time = 10:00 server; Darkmoon Faire opens 00:00 Monday after the first Friday, location rotation unknown.
- Swipe navigation uses a small touch-event hook (`src/hooks/useSwipeNav.ts`) instead of `@use-gesture/react` from PLAN.md. The library's click handling blocked link taps inside the swipe area.
- Mobile vs desktop markup differs in Week/Month (`useMediaQuery(DESKTOP_QUERY)`). Unit tests render the mobile layout unless `window.__desktop = true`.

## Themes & art (Phase 5)

- A theme is data: `src/themes/<id>/theme.ts` (tokens, background, particles, `numeral.ornament`, `decorations`) + one line in `src/themes/index.ts`. `ThemeDecorations` / `AmbientParticles` render it; no UI code per theme.
- Keep decorations minimal (PLAN.md rev. 2): garlands/edge strips, background, particles and small animated accents only, never large corner objects. A theme's `emblem` is small art for card medallions.
- Art lives in `src/themes/art/*.ts` as original SVG strings (chunky outlines, painted gradients). Never copy or trace game art.
- Several copies of the same art can be on a page: always render through `uniqueSvgIds()`, or gradients break when the first copy is hidden.
- Mobile: bottom-corner art moves from the fixed layer into the end-of-page scene so it never sits behind text.
- `src/themes/__tests__/contrast.test.ts` enforces WCAG AA per theme and the 150 KB budget. Fix a failing theme by adjusting its tokens, not the test.
