/** All UI copy lives here so localization is cheap later. */
export const strings = {
  app: {
    name: "Innkeeper's Almanac",
    tagline: 'What is happening in Azeroth today — pull up a chair by the hearth.',
  },
  legal: {
    disclaimer:
      'Fan-made. Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a trademark of Blizzard Entertainment, Inc.',
  },
} as const;

export type Strings = typeof strings;
