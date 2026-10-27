import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLoaderData, useMatches, useNavigate, useParams } from 'react-router';
import { startOfWeek } from '@/engine/calendar';
import { findRegion } from '@/engine/expand';
import { addDays, addMonths, localDateOf, monthOf, type LocalDate } from '@/engine/time';
import { MoreSheet } from '@/features/settings/MoreSheet';
import { dominantThemeId } from '@/hooks/useDominantTheme';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNow } from '@/hooks/useNow';
import { useOccurrences } from '@/hooks/useOccurrences';
import { useSwipeNav } from '@/hooks/useSwipeNav';
import { useRegionId, userTimeZone, useSettings } from '@/state/settings';
import { strings } from '@/strings/en';
import { ActionBar, ActionBarDivider, ActionButton, Icon, ThemeScope } from '@/ui';
import { paths, type ViewMode } from '../paths';
import type { VersionView } from '../versionView';
import type { VersionLoaderData } from './loaders';
import styles from './VersionLayout.module.css';

/** Shell for /:versionId/*: themed by the viewed date's dominant event, with top bar + action bar. */
export function VersionLayout() {
  const { version, catalog } = useLoaderData() as VersionLoaderData;
  const params = useParams();
  const matches = useMatches();
  const navigate = useNavigate();
  const now = useNow();
  const [moreOpen, setMoreOpen] = useState(false);

  const setVersion = useSettings((s) => s.setVersion);
  const hiddenCategories = useSettings((s) => s.hiddenCategories);
  const timeDisplay = useSettings((s) => s.timeDisplay);
  const weekStartsOn = useSettings((s) => s.weekStartsOn);
  const region = findRegion(version, useRegionId(version));

  useEffect(() => setVersion(version.id), [setVersion, version.id]);

  const userTz = userTimeZone();
  const today = localDateOf(now, userTz);
  const mode =
    (matches[matches.length - 1]?.handle as { view?: ViewMode } | undefined)?.view ?? 'day';

  // The date the view is about. A week or month that contains today is "about" today (so Day/Month
  // links and keys land on today); otherwise its first day.
  const viewDate: LocalDate =
    mode === 'month' && params.month
      ? monthOf(today) === params.month
        ? today
        : `${params.month}-01`
      : mode === 'week' && params.date
        ? startOfWeek(today, weekStartsOn) === params.date
          ? today
          : params.date
        : (params.date ?? today);

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

  const view: VersionView = useMemo(() => {
    const hrefFor = (target: ViewMode, date: LocalDate) => {
      if (target === 'week') return paths.week(version.id, startOfWeek(date, weekStartsOn));
      if (target === 'month') return paths.month(version.id, monthOf(date));
      return date === today ? paths.today(version.id) : paths.day(version.id, date);
    };
    const step = (dir: 1 | -1) =>
      mode === 'month'
        ? `${addMonths(monthOf(viewDate), dir)}-01`
        : addDays(viewDate, dir * (mode === 'week' ? 7 : 1));
    const isCurrent =
      mode === 'month'
        ? monthOf(viewDate) === monthOf(today)
        : mode === 'week'
          ? startOfWeek(viewDate, weekStartsOn) === startOfWeek(today, weekStartsOn)
          : viewDate === today;

    return {
      version,
      catalog,
      region,
      userTimeZone: userTz,
      displayTimeZone: timeDisplay === 'server' ? region.timeZone : userTz,
      now,
      today,
      mode,
      viewDate,
      isToday: viewDate === today,
      weekStartsOn,
      hiddenCategories,
      nav: {
        prev: hrefFor(mode, step(-1)),
        next: hrefFor(mode, step(1)),
        current: hrefFor(mode, today),
        isCurrent,
      },
      hrefFor,
    };
  }, [
    version,
    catalog,
    region,
    userTz,
    timeDisplay,
    now,
    today,
    mode,
    viewDate,
    weekStartsOn,
    hiddenCategories,
  ]);

  useKeyboardShortcuts({
    '1': () => navigate(view.hrefFor('day', viewDate)),
    '2': () => navigate(view.hrefFor('week', viewDate)),
    '3': () => navigate(view.hrefFor('month', viewDate)),
    t: () => navigate(view.nav.current),
    v: () => setMoreOpen(true),
    ArrowLeft: () => navigate(view.nav.prev),
    ArrowRight: () => navigate(view.nav.next),
  });

  const swipe = useSwipeNav(
    () => navigate(view.nav.prev),
    () => navigate(view.nav.next),
  );

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

      <main className={styles.main} {...swipe}>
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
          to={view.hrefFor('day', viewDate)}
          active={mode === 'day'}
        />
        <ActionButton
          icon="week"
          label={strings.actionBar.week}
          keybind="2"
          to={view.hrefFor('week', viewDate)}
          active={mode === 'week'}
        />
        <ActionButton
          icon="month"
          label={strings.actionBar.month}
          keybind="3"
          to={view.hrefFor('month', viewDate)}
          active={mode === 'month'}
        />
        <ActionBarDivider />
        <ActionButton
          icon="version"
          label={strings.actionBar.version}
          keybind="V"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
        />
      </ActionBar>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} version={version} />
    </ThemeScope>
  );
}
