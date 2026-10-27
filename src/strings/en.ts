/** All UI copy lives here so localization is cheap later. */
export const strings = {
  app: {
    name: "Innkeeper's Almanac",
    tagline: 'What is happening in Azeroth today — pull up a chair by the hearth.',
  },
  common: {
    close: 'Close',
    unconfirmed: 'Unconfirmed',
    unconfirmedHint: 'Date not yet confirmed for this version. Check the in-game calendar.',
  },
  actionBar: {
    label: 'Views and actions',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    version: 'Version',
    more: 'More',
    today: 'Today',
  },
  today: {
    title: 'Today',
    quietDay: 'A quiet day at the inn',
    quietDayHint: 'No events are running. Pull up a chair and rest by the hearth.',
    startsIn: (d: string) => `Starts in ${d}`,
    endsIn: (d: string) => `Ends in ${d}`,
    ended: (time: string) => `Ended at ${time}`,
    alsoToday: 'Also on this day',
    comingSoon: 'Coming soon',
    comingSoonEmpty: 'Nothing else in the next 30 days.',
    inDistance: (d: string) => `in ${d}`,
    details: 'Details',
    detailsFor: (name: string) => `Details for ${name}`,
    previousDay: 'Previous day',
    nextDay: 'Next day',
    backToToday: 'Back to today',
  },
  calendar: {
    previousWeek: 'Previous week',
    nextWeek: 'Next week',
    thisWeek: 'This week',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    thisMonth: 'This month',
    weekTitle: (range: string) => `Week of ${range}`,
    moreEvents: (n: number) => `+${n} more`,
    noEvents: 'No events',
    openDay: 'Open day view',
    dayLabel: (day: string, events: string) => (events ? `${day}: ${events}` : day),
    today: 'Today',
  },
  eventSheet: {
    yourTime: (zone: string) => `Your time (${zone})`,
    serverTime: (region: string, zone: string) => `${region} server time (${zone})`,
    location: 'Location',
    highlights: 'Highlights',
    notes: 'Notes',
    links: 'Learn more',
    dateSource: 'Date source',
    notFound: 'This event has no dates in this version.',
    opensInNewTab: '(opens in a new tab)',
  },
  categories: {
    holiday: 'Holiday',
    faire: 'Faire',
    fishing: 'Fishing',
    world: 'World event',
    pvp: 'PvP',
    milestone: 'Milestone',
  },
  topBar: {
    versionChip: (version: string, region: string) => `${version} · ${region}`,
    openSettings: 'Settings',
  },
  more: {
    title: 'Settings & info',
    about: 'About',
    aboutText:
      'A fan-made calendar of in-game events for classic World of Warcraft. Dates come from community sources and official news; unconfirmed dates are marked.',
  },
  notFound: {
    title: 'Lost in the Twisting Nether',
    text: "That page doesn't exist.",
    home: 'Return to the inn',
  },
  settings: {
    region: 'Server region',
    serverTime: (region: string) => `${region} server time`,
  },
  legal: {
    disclaimer:
      'Fan-made. Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.',
  },
} as const;

export type Strings = typeof strings;
