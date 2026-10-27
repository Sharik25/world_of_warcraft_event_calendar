/** Validates all bundled event data (PLAN.md §5). Fails the build on any issue. */
import { loadData } from './lib/load-data';

async function main(): Promise<void> {
  const { validateData, eventDefinitions, versions, themeIds } = await loadData();
  const issues = validateData({ events: eventDefinitions, versions, themeIds });

  if (issues.length) {
    console.error(`[validate-data] ${issues.length} issue(s):`);
    for (const issue of issues) console.error(`  - ${issue}`);
    process.exit(1);
  }
  const bindings = versions.reduce((n, v) => n + v.events.length, 0);
  console.log(
    `[validate-data] OK: ${eventDefinitions.length} events, ${versions.length} versions, ${bindings} event bindings.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
