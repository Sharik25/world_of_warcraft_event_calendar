# Innkeeper's Almanac — WoW Event Calendar (React) · Implementation Plan

> Working name: **Innkeeper's Almanac** (rename freely; avoid Blizzard trademarks in the app name).
> Audience of this file: **Claude Code**. Build phase by phase (§12). After each phase: run tests, run the app, check both mobile and desktop viewports, then stop and summarize.

---

## 0. Instructions for Claude Code

1. Follow phases in §12 in order. Do not start a phase before the previous phase's acceptance criteria pass.
2. **Never invent event dates.** Every explicit date in `src/data/**` carries `verified: boolean` and `source`. If you can't verify a date (Wowhead event pages, Blizzard news, in-game calendar screenshots/community trackers), keep `verified: false`. The UI shows an "unconfirmed" marker for those.
3. **No Blizzard assets.** No ripped textures, icons, logos, music, or the client font. All art is original (CSS, SVG, or self-made images) *inspired by* the classic aesthetic. See §11.
4. Mobile and desktop are **equal priority**. Every component must be checked at 360px and 1280px widths.
5. Keep it simple: no backend in v1. Static site + build-time generated `.ics` feeds.
6. Adding an event, theme, or version must never require touching engine or UI code — only data/theme folders + one registry line (see §13).

---

## 1. Product summary

A cozy, classic-WoW-styled calendar showing what in-game events are running **today**, this **week**, and this **month**, per WoW version, with one-tap export to Apple and Google calendars.

**Core use case:** user opens the app → sees today's dominant event in a themed hero view → bottom "action bar" switches Day / Week / Month and WoW version.

### Versions (scope)

| Version id    | Display name             | Status (Oct 2026)                                   | Priority |
|---------------|--------------------------|-----------------------------------------------------|----------|
| `anniversary` | Anniversary (TBC Classic) | Live — Anniversary realms moved to TBC Classic in Feb 2026 | **v1**   |
| `forever`     | WoW: Forever             | Launches **Nov 4, 2026** (vanilla-era, level 60, realmless) | **v1.1** |

Event set differs per version: Anniversary (TBC rules) includes Brewfest and Midsummer's Ahune; Forever is vanilla-era and its holiday list must be verified after launch. The architecture treats this as data, not code.

### Non-goals (v1)
- User accounts, backend, push notifications, retail WoW, localization (but keep strings centralized so i18n is cheap later).

---

## 2. Tech stack

| Concern            | Choice                                    | Why |
|--------------------|-------------------------------------------|-----|
| Build              | **Vite + React 18 + TypeScript (strict)** | Fast, simple, static output |
| Routing            | **React Router v6** (data router)         | URL = state; shareable links |
| State              | **Zustand** + `persist` (localStorage)    | Tiny; only settings are global |
| Dates/time zones   | **date-fns** + **date-fns-tz**            | Tree-shakable, TZ-safe |
| Validation         | **Zod**                                   | Validate all event data at build/test time |
| Styling            | **CSS Modules + CSS custom properties**   | Themes = token swaps; no runtime CSS-in-JS |
| Animation          | CSS only (+ `prefers-reduced-motion`)     | Light, battery-friendly on mobile |
| Gestures           | `@use-gesture/react` (swipe prev/next)    | Mobile navigation |
| ICS generation     | **`ics`** npm package                     | Correct RFC 5545 output, RRULE support |
| PWA                | `vite-plugin-pwa`                         | "Add to Home Screen" on iOS/Android |
| Fonts              | `@fontsource/cinzel`, `@fontsource/alegreya` | Free, self-hosted, classic fantasy feel |
| Tests              | **Vitest** + Testing Library; **Playwright** (mobile + desktop projects) | Engine is pure → unit-test heavily |
| Lint/format        | ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier | |
| Deploy             | Netlify / Vercel / Cloudflare Pages (static) | Must serve `/calendars/*.ics` with `text/calendar` |

---

## 3. Architecture

Three layers with one-way dependency: **data → engine → UI**.

```
┌──────────────────────────────────────────────────────────────────┐
│ DATA (static, declarative)                                       │
│  events catalog · version configs · schedules · themes           │
└───────────────┬──────────────────────────────────────────────────┘
                │ validated by Zod
┌───────────────▼──────────────────────────────────────────────────┐
│ ENGINE (pure TS, no React)                                       │
│  expandOccurrences(range) · pickDominant(day) · time zone utils  │
│  · ics builders                                                  │
└───────────────┬──────────────────────────────────────────────────┘
                │ hooks: useOccurrences, useDominantTheme
┌───────────────▼──────────────────────────────────────────────────┐
│ UI (React)                                                       │
│  Today · Week · Month · EventSheet · ActionBar · ThemeProvider   │
└──────────────────────────────────────────────────────────────────┘
```

Data access goes through an `EventRepository` interface. v1 implementation reads bundled TS/JSON; later it can fetch JSON from a CDN (update events without redeploy) with zero UI changes.

---

## 4. Folder structure

```
innkeepers-almanac/
├─ public/
│  ├─ calendars/                 # GENERATED at build: <version>-<region>.ics feeds
│  ├─ icons/                     # PWA icons (original art)
│  └─ og/                        # social preview images
├─ scripts/
│  ├─ build-ics.ts               # generates subscription feeds into public/calendars
│  └─ validate-data.ts           # Zod-validates all data; fails CI on error
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ router.tsx
│  │  └─ providers.tsx           # ThemeProvider, settings hydration
│  ├─ domain/
│  │  ├─ types.ts                # all core types (§5)
│  │  └─ schemas.ts              # Zod schemas mirroring types
│  ├─ engine/
│  │  ├─ expand.ts               # rules → occurrences for a date range
│  │  ├─ rules/
│  │  │  ├─ explicit.ts
│  │  │  ├─ weekly.ts
│  │  │  ├─ monthly.ts
│  │  │  └─ index.ts             # rule registry: kind → expander
│  │  ├─ dominance.ts            # pickDominant() (§6)
│  │  ├─ time.ts                 # region TZ ↔ user TZ helpers
│  │  ├─ ics.ts                  # single event / series / feed builders
│  │  └─ __tests__/
│  ├─ data/
│  │  ├─ events/                 # ONE FILE PER EVENT (definition, version-agnostic)
│  │  │  ├─ hallows-end.ts
│  │  │  ├─ winter-veil.ts
│  │  │  ├─ ...
│  │  │  └─ index.ts             # exports catalog
│  │  ├─ versions/
│  │  │  ├─ anniversary/
│  │  │  │  ├─ version.ts        # VersionConfig: regions, enabled events + rules
│  │  │  │  ├─ schedule-2026.json
│  │  │  │  └─ schedule-2027.json
│  │  │  ├─ forever/
│  │  │  │  └─ version.ts
│  │  │  └─ index.ts             # version registry
│  │  └─ repository.ts           # EventRepository (bundled impl)
│  ├─ themes/
│  │  ├─ base/                   # default "Inn at dusk" theme (no event)
│  │  │  ├─ theme.ts
│  │  │  └─ theme.module.css
│  │  ├─ hallows-end/
│  │  ├─ winter-veil/
│  │  ├─ ...
│  │  └─ index.ts                # theme registry (lazy loaders)
│  ├─ features/
│  │  ├─ today/
│  │  ├─ week/
│  │  ├─ month/
│  │  ├─ event-sheet/            # event detail (bottom sheet on mobile, side panel on desktop)
│  │  ├─ calendar-export/
│  │  ├─ version-switcher/
│  │  └─ settings/
│  ├─ ui/                        # design system primitives (§8)
│  │  ├─ Frame/  ParchmentCard/  ActionBar/  ActionButton/
│  │  ├─ Sheet/  Tooltip/  Badge/  Icon/
│  ├─ hooks/
│  │  ├─ useOccurrences.ts
│  │  ├─ useDominantTheme.ts
│  │  ├─ useNow.ts               # ticks each minute (countdowns)
│  │  └─ useSwipeNav.ts
│  ├─ state/settings.ts          # Zustand store
│  ├─ strings/en.ts              # all UI copy
│  └─ styles/
│     ├─ tokens.css              # base design tokens
│     └─ global.css
├─ e2e/                          # Playwright
├─ CLAUDE.md                     # short conventions file (create in Phase 0)
└─ PLAN.md                       # this file
```

---

## 5. Domain model (`src/domain/types.ts`)

```ts
export type VersionId = string;          // 'anniversary' | 'forever' | future
export type EventId = string;            // 'hallows-end'
export type ThemeId = string;            // 'hallows-end' | 'base'

export type Rarity = 'weekly' | 'monthly' | 'seasonal' | 'annual' | 'once';

export type EventCategory =
  | 'holiday' | 'faire' | 'fishing' | 'world' | 'pvp' | 'milestone';

/** Version-agnostic description of an event. */
export interface EventDefinition {
  id: EventId;
  name: string;                 // "Hallow's End"
  shortName?: string;           // "Hallow's End" → for small cells
  category: EventCategory;
  rarity: Rarity;
  priority?: number;            // tie-breaker for dominance, default 0
  themeId: ThemeId;             // which theme styles the day when dominant
  summary: string;              // one sentence
  highlights?: string[];        // rewards / things to do (short bullets)
  links?: { label: string; url: string }[]; // e.g. Wowhead guide
}

/** How an event is scheduled in a specific version. */
export type ScheduleRule =
  | {
      kind: 'explicit';                         // holidays: dates shift yearly
      occurrences: {
        start: string;                          // ISO local, e.g. "2026-10-18T10:00"
        end: string;
        verified: boolean;
        source?: string;                        // URL
      }[];
    }
  | {
      kind: 'weekly';                           // e.g. fishing contest
      weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;       // 0 = Sunday
      startTime: string;                        // "14:00" (server time)
      durationMinutes: number;
      verified: boolean;
      source?: string;
    }
  | {
      kind: 'monthly';                          // e.g. Darkmoon Faire
      anchor: { weekday: 0|1|2|3|4|5|6; nth: 1|2|3|4|'last' }; // "1st Sunday"
      offsetDays?: number;                      // shift from anchor
      startTime: string;
      durationDays: number;
      rotation?: string[];                      // locations cycling per month
      verified: boolean;
      source?: string;
    };

export interface Region {
  id: string;                   // 'us' | 'eu' | 'oce' ...
  label: string;
  timeZone: string;             // IANA, e.g. 'Europe/Paris' (server time)
}

export interface VersionEventBinding {
  eventId: EventId;
  rule: ScheduleRule;
  /** Per-region overrides when regions differ (optional). */
  regionRules?: Record<string, ScheduleRule>;
  notes?: string;               // version-specific nuance, e.g. "includes Ahune"
}

export interface VersionConfig {
  id: VersionId;
  name: string;                 // "Anniversary (TBC Classic)"
  shortName: string;            // "Anniversary"
  status: 'live' | 'upcoming' | 'retired';
  launchDate?: string;          // ISO
  regions: Region[];
  defaultRegionId: string;
  events: VersionEventBinding[];
  baseThemeId: ThemeId;         // theme when no event is dominant
}

/** Engine output. Dates are absolute instants (UTC-backed Date). */
export interface Occurrence {
  key: string;                  // `${versionId}:${eventId}:${startISO}`
  eventId: EventId;
  versionId: VersionId;
  start: Date;
  end: Date;
  verified: boolean;
  location?: string;            // from rotation
}
```

All of the above have mirrored **Zod schemas** in `schemas.ts`. `scripts/validate-data.ts` runs in CI and as a Vitest test: unique ids, every `eventId` exists in catalog, every `themeId` exists in theme registry, `end > start`, no overlapping duplicate occurrences.

---

## 6. Dominant event ("style of the main and rarest event")

When several events overlap on a day, one **dominant** event styles the day (hero, date numeral, month cell).

```ts
const RARITY_WEIGHT: Record<Rarity, number> = {
  once: 5, annual: 4, seasonal: 3, monthly: 2, weekly: 1,
};

// Higher wins. Tie-breakers in order:
// 1. rarity weight
// 2. definition.priority (default 0)
// 3. shorter occurrence duration (a 1-day event on top of a 2-week holiday is "rarer")
// 4. earlier start
// 5. eventId alphabetical (deterministic)
export function pickDominant(occurrencesOnDay: Occurrence[], catalog): Occurrence | null
```

Examples:
- Midsummer (annual, 2 weeks) + Fireworks Spectacular (annual, 1 day) on Jul 4 → **Fireworks** (shorter).
- Darkmoon Faire (monthly) + Fishing Extravaganza (weekly) → **Darkmoon Faire**.
- Nothing active → version's `baseThemeId`.

Non-dominant active events are still listed (secondary cards / small markers). Unit-test every tie-breaker.

---

## 7. Time & regions

- Events are defined in **server time** of a region (`Region.timeZone`). Engine converts to absolute instants.
- Display defaults to the **user's local time**; setting toggles "Show server time".
- "Today" = the user's local calendar day; an occurrence is "on a day" if it intersects that local day.
- Region setting (US / EU / …) per version, stored in settings. Default: guess from `Intl.DateTimeFormat().resolvedOptions().timeZone` (Europe/Asia/Africa → EU, Americas → US, Australia → OCE if available).
- WoW: Forever is realmless — its config may use a single region set; handled purely in `version.ts`.
- Week start: setting (Sunday / Monday), default from locale.

---

## 8. UI/UX

### 8.1 Visual language (original, classic-inspired)
- **Materials:** parchment (cards), dark carved wood / stone (frames, action bar), gold trim (borders, active states), wax-seal badges, candlelight glow.
- **Typography:** Cinzel (display: dates, titles), Alegreya (body). Big serif numerals for the date.
- **Base theme "Inn at dusk":** warm browns, ember orange accents, soft vignette.
- **Event themes** override tokens + background + optional ambient particles:
  - Hallow's End: dusk purple/orange, pumpkin-amber glow, floating embers.
  - Feast of Winter Veil: snowy blues/reds, gentle snowfall.
  - Lunar Festival: deep indigo, silver-green lantern glow.
  - Love is in the Air: rose/pink, drifting petals.
  - Noblegarden: spring pastels, grass.
  - Children's Week: soft yellow, playful paper texture.
  - Midsummer Fire Festival: gold/red bonfire glow.
  - Fireworks Spectacular / New Year: night sky + sparkle bursts.
  - Brewfest: amber/brown, foam bubbles.
  - Harvest Festival: autumn ochre, wheat.
  - Darkmoon Faire: purple/teal carnival stripes.
  - Fishing Extravaganza: teal water, ripples.

### 8.2 Layout

**Today view (default route)**: a single centered column on every viewport (rev. 1).
```
┌───────────────────────────────┐
│  [version chip]   [⚙]         │  top bar (slim)
│                               │
│     ‹  ╔═══════════╗  ›       │
│        ║    27     ║          │  themed date numeral, centered on the page
│        ║ OCTOBER   ║          │
│        ╚═══════════╝          │
│      HALLOW'S END             │  dominant event title
│   Ends in 4d 21h  · ⓘ         │  live countdown, unverified marker if needed
│ ┌───────────────────────────┐ │
│ │ summary, ▸ highlights     │ │  details card
│ │ [Details] [Add to cal ▾]  │ │
│ └───────────────────────────┘ │
│  Also on this day: [Fishing]  │  secondary active events
│  Coming soon: [Winter Veil in 49d] [DMF in 6d]   (next 30 days)
│                               │  ← "Coming soon" sits between details and the action bar
│ ┌───────────────────────────┐ │
│ │ [Day][Week][Month] [Ver]  │ │  ActionBar (fixed bottom, no ⋯ slot)
│ └───────────────────────────┘ │
└───────────────────────────────┘
```

**Week view**
- Desktop (≥ 768px): 7 columns; multi-day events as horizontal gold-trimmed ribbons across columns; timed events (fishing) as small blocks with time.
- Mobile: vertical list of 7 day rows; each row = date numeral styled by that day's dominant event + event chips.

**Month view**
- Grid of days; each cell subtly tinted by its dominant event theme (`--cell-tint` token), numeral in that theme's color.
- Desktop: event ribbons across cells (max 3, then "+N").
- Mobile: colored dots under numerals (max 3), tap a day → Day sheet listing its events.
- Today has a glowing gold border.

**Event sheet**: bottom sheet on mobile (drag to close), right side panel on desktop. Contents (rev. 3): name, category, unconfirmed marker, countdown, location (e.g., DMF rotation), summary, highlights, notes, links.

### 8.3 Action bar (classic action-bar feel)
- Fixed bottom; carved frame; square slot buttons with icon + label; active slot has gold glow.
- Slots: **Day · Week · Month** | **Version** (opens version picker popover). No "⋯ More" slot (rev. 1): Settings & About live behind the top-bar ⚙ button; Add-to-calendar lives in the event sheet / hero card; Subscribe lives in Settings.
- Desktop: centered, max-width 640px, shows keybind hints in slot corners like the game: `1` Day, `2` Week, `3` Month, `V` Version, `T` Today, `←/→` prev/next.
- Mobile: full width, `padding-bottom: env(safe-area-inset-bottom)`, slot tap targets ≥ 48×48px, labels always visible.
- Navigation in Week/Month: arrows in the header + swipe left/right on mobile + "Today" button.

### 8.4 Responsiveness
Breakpoints: `sm 360`, `md 768`, `lg 1024`, `xl 1440`. Test at 360, 390, 430, 768, 1280, 1920. Mobile-first CSS. No horizontal scroll at 360px. Landscape phones: action bar stays usable.

### 8.5 Accessibility
- WCAG AA contrast on parchment (verify themes with a contrast check test on tokens).
- Never color-only: dots/ribbons have labels/aria; event chips include text.
- Full keyboard nav, visible focus ring (gold), `aria-current` on active view, sheets trap focus.
- `prefers-reduced-motion`: disable particles and transitions.
- Dates in `<time datetime>`.

---

## 9. Theming system (`src/themes`)

```ts
export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  tokens: Partial<Record<ThemeToken, string>>; // CSS custom properties
  background?: { css: string };                 // gradients / SVG patterns
  particles?: 'embers' | 'snow' | 'petals' | 'sparkles' | 'bubbles' | null;
  numeral?: { ornamentSvg?: string };           // ornament around date numeral
}

type ThemeToken =
  | '--color-bg' | '--color-surface' | '--color-ink' | '--color-ink-muted'
  | '--color-accent' | '--color-gold' | '--color-frame'
  | '--glow' | '--cell-tint' | '--font-display';
```

- Registry maps `ThemeId → () => import('./hallows-end/theme')` (lazy; base theme bundled).
- `ThemeProvider` sets `data-theme` + inline CSS vars on the view root. Month/week cells use `useThemeTokens(themeId)` to tint individually.
- Particles: one shared `<AmbientParticles kind>` component (CSS/canvas, capped at ~40 particles, paused when tab hidden).
- Asset budget per theme ≤ 150 KB (prefer SVG/CSS; images WebP/AVIF).

---

## 10. Calendar export (Apple & Google)

| Need | Implementation |
|------|----------------|
| **Single occurrence** ("short-term": this Sunday's fishing, this year's Hallow's End) | Google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=YYYYMMDDTHHmmssZ/…&details=…` · Apple/Outlook: download `.ics` generated client-side |
| **Recurring series** (weekly fishing, monthly DMF) | `.ics` with `RRULE` (weekly) / expanded VEVENTs for next 12 months (monthly rules with offsets are awkward in RRULE — expand instead) |
| **Subscribe to everything** ("long-term", auto-updating) | Build-time feeds `public/calendars/<version>-<region>.ics` covering −1 month … +18 months. Apple: `webcal://<host>/calendars/anniversary-eu.ics`. Google: `https://calendar.google.com/calendar/r?cid=webcal://<host>/calendars/anniversary-eu.ics` |
| Per-category feeds (optional v1.1) | `anniversary-eu-holidays.ics`, `…-faire.ics` |

Rules:
- Stable `UID` per occurrence = `Occurrence.key@innkeepers-almanac` so re-imports/updates don't duplicate.
- All times written in UTC (`Z`); multi-day holidays as timed events (they start at a server time, not midnight).
- Description includes summary + link back to the app (`/anniversary/day/2026-10-27?event=hallows-end`).
- Unverified dates: prefix summary with "(tentative)".
- iOS Safari: `.ics` download must use `Content-Type: text/calendar` → serve feeds statically; for client-generated files use a `Blob` + `<a download>`; test on iOS (opens Calendar import sheet).
- Feeds only work on a deployed HTTPS host; in dev, show "download .ics" only.

---

## 11. Content & legal

- Use event names descriptively; **no Blizzard logos, textures, icons, music, or extracted fonts**.
- Footer + About: "Fan-made. Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc."
- Link out to Wowhead/official pages for details instead of copying guide text.

---

## 12. Phases & acceptance criteria

### Phase 0 — Scaffold
- Vite React TS strict, ESLint/Prettier, Vitest, Playwright (projects: `mobile` = iPhone 13, `desktop` = 1280×800), React Router, Zustand, fonts.
- Create `CLAUDE.md` with: commands, folder rules (§4), "never invent dates", "no Blizzard assets", "mobile = desktop priority".
- Scripts: `dev`, `build` (runs `validate-data` + `build-ics` + vite build), `test`, `e2e`, `lint`, `typecheck`.
- ✅ `npm run build && npm test` pass; empty app renders.

### Phase 1 — Domain, engine, Anniversary data
- Types + Zod schemas; rule expanders (explicit/weekly/monthly); `expandOccurrences(version, region, range)`; `pickDominant`; TZ helpers.
- Event catalog + `anniversary/version.ts` + `schedule-2026.json`, `schedule-2027.json` (see §14 seed list). Research and verify dates; leave `verified:false` where unconfirmed.
- ✅ ≥ 90% coverage on `engine/`; tests for DST boundaries (US & EU switch dates), month boundaries, dominance tie-breakers, multi-day intersecting a local day.

### Phase 2 — Design system + base theme
- Tokens, `Frame`, `ParchmentCard`, `ActionBar`, `ActionButton`, `Sheet`, `Badge`, `Tooltip`; base "Inn at dusk" theme; `ThemeProvider`.
- ✅ Storybook-free: a hidden `/dev/ui` route showing all primitives in base + one event theme; looks right at 360 and 1280.

### Phase 3 — Today view
- Routes: `/` → `/:version/today`; `/:version/day/:date`. Hero with themed numeral, countdown (`useNow`), highlights, secondary events, "coming soon" (30 days), event sheet via `?event=`.
- ✅ Playwright: Today shows correct dominant event for a mocked date (inject clock); sheet opens/closes on both viewports.

### Phase 4 — Week & Month views (+ rev. 1 layout fixes)
- Rev. 1: Today view becomes one centered column on desktop too (date numeral centered on the page); order: numeral → title → countdown → details card → also on this day → coming soon → action bar. Remove the "More" action-bar slot.
- `/:version/week/:date`, `/:version/month/:yyyy-mm`; ribbons (desktop), list/dots (mobile); swipe + keyboard nav; Today button.
- ✅ Month for Oct 2026 renders tinted cells correctly; no horizontal scroll at 360px; keyboard shortcuts work.

### Phase 5 — Event themes & decorations (rev. 1)
- Implement themes in order: Hallow's End (live now), Winter Veil + New Year, Darkmoon Faire, Fishing, then the rest. Shared particles component.
- Rev. 1: each event gets a full visual identity, not just a palette: its own colors, frame/card styling and **original SVG decorations** placed around the page (corners, edges, hero), in a classic-WoW-inspired hand-painted style. Never ripped game art (§11).
  - Hallow's End: carved jack-o'-lanterns, hanging spiders on threads, bats, a skeleton peeking from a corner, harvest moon, candle glow.
  - Feast of Winter Veil: decorated pine trees, wrapped gifts, candy canes, snow-capped frame edges, gentle snowfall.
  - New Year / Fireworks Spectacular: firework bursts, sparkles, night sky, festive banners.
  - Darkmoon Faire: striped carnival tent, bunting flags, tickets and cards, purple/teal palette.
  - Fishing Extravaganza: fishing pole and bobber, jumping fish, water ripples, rope-and-wood frame.
  - Lunar Festival: paper lanterns, elder coins, crescent moon. Love is in the Air: hearts, ribbons, petals. Noblegarden: painted eggs, bunnies, flowers. Children's Week: kites, toys, paper texture. Midsummer: bonfire, flame garlands, sun. Brewfest: kegs, mugs with foam, rams. Harvest Festival: wheat sheaves, pumpkins, autumn leaves.
  - Decorations are part of the theme definition (data), rendered by one shared `<ThemeDecorations>` component; adding a theme still needs no UI code.
  - Mobile: fewer/smaller decorations, never covering content or tap targets; `aria-hidden`, `pointer-events: none`.
- ✅ Contrast test on each theme's tokens; reduced-motion disables particles and animated decorations; per-theme asset budget respected; decorations never cause horizontal scroll at 360px.

### Phase 6 — Calendar export
- Google link builder, client `.ics` (single + series), build-time feeds, Subscribe dialog with copyable URLs and platform instructions (Apple / Google / Outlook).
- ✅ Generated `.ics` validates (unit test parses output); stable UIDs; manual test import on iOS Calendar + Google Calendar.

### Phase 7 — Version switcher + WoW: Forever
- Version picker popover in action bar; version in URL; per-version region setting.
- `forever/version.ts` with `status: 'upcoming'` until Nov 4, 2026, then the event list as verified post-launch. Upcoming version shows a themed "Launches in Xd" screen.
- ✅ Switching versions keeps current view + date; data validation passes for both versions.

### Phase 8 — PWA, polish, deploy
- `vite-plugin-pwa` (offline shell, cached data), icons, manifest, OG image; settings page (region, local/server time, week start, category filters); About + disclaimer.
- Deploy; confirm feed URLs served as `text/calendar`.
- ✅ Lighthouse mobile ≥ 90 (Perf, A11y, Best Practices); installable on iOS & Android.

---

## 13. Extension playbooks (the scalability contract)

**Add a new event**
1. `src/data/events/<event-id>.ts` — `EventDefinition`.
2. Export it in `src/data/events/index.ts`.
3. Add a `VersionEventBinding` in each relevant `versions/<v>/version.ts` (or dates in `schedule-<year>.json`).
4. Point `themeId` to an existing theme or create one (below).
5. `npm test` (validation catches missing references).

**Add a new theme**
1. `src/themes/<theme-id>/theme.ts` (+ optional `theme.module.css`, SVG ornament).
2. Register lazy loader in `src/themes/index.ts`.
3. Contrast test runs automatically.

**Add a new WoW version**
1. `src/data/versions/<version-id>/version.ts` (+ schedules).
2. Register in `src/data/versions/index.ts`.
3. Version appears in the switcher and feeds are generated automatically.

**Add a new year of dates**: add `schedule-<year>.json`; nothing else.

---

## 14. Seed data — Anniversary (TBC Classic)

All entries start as `verified: false`. Verify each against Wowhead event pages / Blizzard news / in-game calendar and fill `source`. Typical windows are given only as hints for searching — **do not ship them as verified**.

| Event id | Name | Category | Rarity | Rule | Typical window (hint only) |
|---|---|---|---|---|---|
| `lunar-festival` | Lunar Festival | holiday | annual | explicit | late Jan – mid Feb (follows Lunar New Year) |
| `love-is-in-the-air` | Love is in the Air | holiday | annual | explicit | ~Feb 7–20 |
| `noblegarden` | Noblegarden | holiday | annual | explicit | ~1 week around Easter |
| `childrens-week` | Children's Week | holiday | annual | explicit | ~1 week, early May |
| `midsummer` | Midsummer Fire Festival (incl. Ahune) | holiday | annual | explicit | ~Jun 21 – Jul 5 |
| `fireworks-spectacular` | Fireworks Spectacular | holiday | annual | explicit | Jul 4 (1 day) |
| `harvest-festival` | Harvest Festival | holiday | annual | explicit | ~1 week, late Sep/early Oct |
| `brewfest` | Brewfest (TBC) | holiday | annual | explicit | ~Sep 20 – Oct 6 |
| `hallows-end` | Hallow's End | holiday | annual | explicit | ~Oct 18 – Nov 1 |
| `winter-veil` | Feast of Winter Veil | holiday | annual | explicit | ~Dec 15 – Jan 2 |
| `new-year` | New Year's Eve | holiday | annual | explicit | Dec 31 (1 day) |
| `darkmoon-faire` | Darkmoon Faire | faire | monthly | monthly + rotation | ~1 week each month; rotation (TBC: Elwynn / Mulgore / Terokkar) — verify anchor rule |
| `stv-fishing` | Stranglethorn Fishing Extravaganza | fishing | weekly | weekly | Sundays ~2h in afternoon server time — verify |

Optional `milestone` category (off by default in filters): phase launches (e.g., TBC Anniversary Phase 4 "Sunwell" when announced), weekly reset. Add only with an official source.

**WoW: Forever:** create `forever/version.ts` with `status: 'upcoming'`, `launchDate: '2026-11-04'` (3:00 pm PT launch), and an empty `events` list until the post-launch event calendar is verified.

---

## 15. Settings store (`src/state/settings.ts`)

```ts
interface Settings {
  versionId: VersionId;                     // last used, default 'anniversary'
  regionByVersion: Record<VersionId, string>;
  timeDisplay: 'local' | 'server';
  weekStartsOn: 0 | 1;
  hiddenCategories: EventCategory[];        // default ['milestone']
  reducedMotion: 'system' | 'on' | 'off';
}
```
Persist with versioned key `almanac-settings-v1` and a migration function.

---

## 16. Quality gates (CI)

- `typecheck`, `lint`, `validate-data`, `test` (unit), `e2e` (mobile + desktop), `build`.
- Bundle budget: initial JS ≤ 150 KB gzip (themes lazy-loaded).
- A visual snapshot per view × {mobile, desktop} × {base, hallows-end} via Playwright `toHaveScreenshot` (fixed clock).

---

## 16b. Revision log

**Rev. 1 (2026-10-27, after reviewing Phase 3):**
1. Day view: date numeral centered on the page (single centered column on desktop too).
2. "Coming soon" moves below the details card, just above the action bar.
3. Remove the "More" (⋯) action-bar slot.
4. Rich per-event decorations and styling (pumpkins/spiders for Hallow's End, trees/candy for Winter Veil & New Year, Darkmoon Faire, Fishing, etc.), original art in classic-WoW style.

Items 1–3 → Phase 4. Item 4 → Phase 5.

**Rev. 2 (2026-10-27, after reviewing Phase 5):**
1. "Also on this day" cards are styled in their own event's theme (accent stripe and tint, emblem medallion, countdown pill, chevron).
2. Minimalist decorations: keep garlands/edge strips, backgrounds, particles (stars, snow, embers…) and small animated accents; remove large corner objects (moons, tents, tickets, pumpkins, trees, bonfires, kegs…). Each theme gets a small `emblem` for medallions.

**Rev. 3 (2026-10-27, after reviewing Phase 6):**
1. Event sheet (side panel) is compact: no "Your time" / server-time rows and no Add-to-calendar section; keeps badges, countdown, location, summary, highlights, notes and links. Add to calendar lives on the hero card.
2. No "all dates" series download; single-event export (Google / .ics) and the subscription feeds remain.

## 17. Open decisions (defaults chosen — change if needed)

| Decision | Default |
|---|---|
| App name | Innkeeper's Almanac |
| Default region | Auto by time zone (Israel → EU) |
| Hosting | Netlify (static, custom headers for `.ics`) |
| Language | English only, strings centralized |
| "Coming soon" horizon | 30 days |
