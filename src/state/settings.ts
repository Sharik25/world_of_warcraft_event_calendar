import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { EventCategory, VersionConfig, VersionId } from '@/domain/types';
import { guessRegionId } from '@/engine/time';

export interface Settings {
  versionId: VersionId; // last used
  regionByVersion: Record<VersionId, string>; // only explicit user choices; otherwise guessed
  timeDisplay: 'local' | 'server';
  weekStartsOn: 0 | 1;
  hiddenCategories: EventCategory[];
  reducedMotion: 'system' | 'on' | 'off';
}

interface SettingsActions {
  setVersion(versionId: VersionId): void;
  setRegion(versionId: VersionId, regionId: string): void;
  setTimeDisplay(timeDisplay: Settings['timeDisplay']): void;
  setWeekStartsOn(weekStartsOn: Settings['weekStartsOn']): void;
  setHiddenCategories(hiddenCategories: EventCategory[]): void;
  setReducedMotion(reducedMotion: Settings['reducedMotion']): void;
}

export type SettingsStore = Settings & SettingsActions;

export const SETTINGS_STORAGE_KEY = 'almanac-settings-v1';
const SETTINGS_VERSION = 1;

export function userTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Week start from the browser locale (Intl week info); Monday when unknown. */
export function localeWeekStart(locale = navigator.language): 0 | 1 {
  try {
    const info = (
      new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number } }
    ).getWeekInfo?.();
    return info?.firstDay === 7 ? 0 : 1;
  } catch {
    return 1;
  }
}

export function defaultSettings(): Settings {
  return {
    versionId: 'anniversary',
    regionByVersion: {},
    timeDisplay: 'local',
    weekStartsOn: localeWeekStart(),
    hiddenCategories: ['milestone'],
    reducedMotion: 'system',
  };
}

/** Upgrades persisted settings from older schema versions; unknown fields fall back to defaults. */
export function migrateSettings(persisted: unknown, _fromVersion: number): Settings {
  const base = defaultSettings();
  if (!persisted || typeof persisted !== 'object') return base;
  return { ...base, ...(persisted as Partial<Settings>) };
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings(),
      setVersion: (versionId) => set({ versionId }),
      setRegion: (versionId, regionId) =>
        set((s) => ({ regionByVersion: { ...s.regionByVersion, [versionId]: regionId } })),
      setTimeDisplay: (timeDisplay) => set({ timeDisplay }),
      setWeekStartsOn: (weekStartsOn) => set({ weekStartsOn }),
      setHiddenCategories: (hiddenCategories) => set({ hiddenCategories }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: SETTINGS_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: migrateSettings,
      partialize: ({
        versionId,
        regionByVersion,
        timeDisplay,
        weekStartsOn,
        hiddenCategories,
        reducedMotion,
      }): Settings => ({
        versionId,
        regionByVersion,
        timeDisplay,
        weekStartsOn,
        hiddenCategories,
        reducedMotion,
      }),
    },
  ),
);

/** The region chosen for a version, or a guess from the user's time zone (PLAN.md §7). */
export function resolveRegionId(
  version: VersionConfig,
  regionByVersion: Settings['regionByVersion'],
  timeZone = userTimeZone(),
): string {
  const chosen = regionByVersion[version.id];
  if (chosen && version.regions.some((r) => r.id === chosen)) return chosen;
  return guessRegionId(timeZone, version.regions, version.defaultRegionId);
}

export function useRegionId(version: VersionConfig): string {
  const regionByVersion = useSettings((s) => s.regionByVersion);
  return resolveRegionId(version, regionByVersion);
}
