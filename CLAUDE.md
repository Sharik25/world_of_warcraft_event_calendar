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
