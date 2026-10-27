/**
 * Generates subscription feeds into public/calendars/<version>-<region>.ics (PLAN.md §10),
 * covering one month back to 18 months ahead of the build date.
 * Links in event descriptions use SITE_URL, or Netlify's URL, when set.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadData } from './lib/load-data';

const OUT_DIR = fileURLToPath(new URL('../public/calendars/', import.meta.url));

async function main(): Promise<void> {
  const { buildFeeds, versions, eventCatalog, strings } = await loadData();
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 18, 1));
  const appUrl = process.env.SITE_URL ?? process.env.URL;

  const feeds = buildFeeds(
    versions,
    eventCatalog,
    { start, end },
    {
      appName: strings.app.name,
      appUrl,
      tentativeLabel: strings.calendarExport.tentative,
      locationLabel: strings.eventSheet.location,
      stamp: now,
    },
  );

  mkdirSync(OUT_DIR, { recursive: true });
  for (const file of readdirSync(OUT_DIR)) {
    if (file.endsWith('.ics')) rmSync(`${OUT_DIR}${file}`);
  }
  for (const feed of feeds) writeFileSync(`${OUT_DIR}${feed.fileName}`, feed.content);

  console.log(
    `[build-ics] ${feeds.length} feed(s): ${feeds.map((f) => `${f.fileName} (${f.eventCount})`).join(', ')}` +
      (appUrl ? '' : ' (no SITE_URL: event links omitted)'),
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
