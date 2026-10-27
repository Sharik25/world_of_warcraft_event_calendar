import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from 'react-router';
import { findRegion } from '@/engine/expand';
import { addDays, localDateOf } from '@/engine/time';
import { MoreSheet } from '@/features/settings/MoreSheet';
import { dominantThemeId } from '@/hooks/useDominantTheme';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNow } from '@/hooks/useNow';
import { useOccurrences } from '@/hooks/useOccurrences';
import { useRegionId, userTimeZone, useSettings } from '@/state/settings';
import { strings } from '@/strings/en';
import { ActionBar, ActionBarDivider, ActionButton, Icon, ThemeScope } from '@/ui';
import { paths } from '../paths';
import type { VersionView } from '../versionView';
import type { VersionLoaderData } from './loaders';
import styles from './VersionLayout.module.css';

/** Shell for /:versionId/*: themed by the viewed day's dominant event, with top bar + action bar. */
export function VersionLayout() {
  const { version, catalog } = useLoaderData() as VersionLoaderData;
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const now = useNow();
  const [moreOpen, setMoreOpen] = useState(false);

  const setVersion = useSettings((s) => s.setVersion);
  const hiddenCategories = useSettings((s) => s.hiddenCategories);
  const timeDisplay = useSettings((s) => s.timeDisplay);
  const region = findRegion(version, useRegionId(version));

  useEffect(() => setVersion(version.id), [setVersion, version.id]);

  const userTz = userTimeZone();
  const today = localDateOf(now, userTz);
  const viewDate = params.date ?? today;
  const isDayView = location.pathname.endsWith('/today') || params.date !== undefined;

  const dayOccurrences = useOccurrences(
    version,
    region.id,
    viewDate,
    viewDate,
    userTz,
    catalog,
    hiddenCategories,
  );
  const themeId = dominantThemeId(dayOccurrences, viewDate, userTz, catalog, version);

  const view: VersionView = useMemo(
    () => ({
      version,
      catalog,
      region,
      userTimeZone: userTz,
      displayTimeZone: timeDisplay === 'server' ? region.timeZone : userTz,
      now,
      today,
      viewDate,
      isToday: viewDate === today,
      hiddenCategories,
    }),
    [version, catalog, region, userTz, timeDisplay, now, today, viewDate, hiddenCategories],
  );

  const goToDay = (date: string) =>
    navigate(date === today ? paths.today(version.id) : paths.day(version.id, date));

  useKeyboardShortcuts({
    '1': () => goToDay(viewDate),
    t: () => navigate(paths.today(version.id)),
    v: () => setMoreOpen(true),
    ArrowLeft: isDayView ? () => goToDay(addDays(viewDate, -1)) : undefined,
    ArrowRight: isDayView ? () => goToDay(addDays(viewDate, 1)) : undefined,
  });

  return (
    <ThemeScope themeId={themeId} withBackground className={styles.shell}>
      <header className={styles.topBar}>
        <button type="button" className={styles.versionChip} onClick={() => setMoreOpen(true)}>
          {strings.topBar.versionChip(version.shortName, region.label)}
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setMoreOpen(true)}
          aria-label={strings.topBar.openSettings}
        >
          <Icon name="settings" />
        </button>
      </header>

      <main className={styles.main}>
        <Outlet context={view} />
      </main>

      <footer className={styles.footer}>
        <small>{strings.legal.disclaimer}</small>
      </footer>

      <ActionBar>
        <ActionButton
          icon="day"
          label={strings.actionBar.day}
          keybind="1"
          to={viewDate === today ? paths.today(version.id) : paths.day(version.id, viewDate)}
          active={isDayView}
        />
        {/* Week and Month views arrive in Phase 4. */}
        <ActionButton icon="week" label={strings.actionBar.week} keybind="2" disabled />
        <ActionButton icon="month" label={strings.actionBar.month} keybind="3" disabled />
        <ActionBarDivider />
        <ActionButton
          icon="version"
          label={strings.actionBar.version}
          keybind="V"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
        />
        <ActionButton
          icon="more"
          label={strings.actionBar.more}
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
        />
      </ActionBar>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} version={version} />
    </ThemeScope>
  );
}
