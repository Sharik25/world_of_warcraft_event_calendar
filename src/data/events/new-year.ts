import type { EventDefinition } from '@/domain/types';

export const newYear: EventDefinition = {
  id: 'new-year',
  name: "New Year's Eve",
  shortName: 'New Year',
  category: 'holiday',
  rarity: 'annual',
  themeId: 'fireworks',
  summary: 'Ring in the new year with fireworks over the cities at midnight.',
  highlights: ['Fireworks at midnight server time', 'Celebrate with your guild'],
  links: [{ label: 'Warcraft Wiki', url: "https://warcraft.wiki.gg/wiki/New_Year's_Eve" }],
};
