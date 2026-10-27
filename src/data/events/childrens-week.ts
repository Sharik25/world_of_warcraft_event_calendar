import type { EventDefinition } from '@/domain/types';

export const childrensWeek: EventDefinition = {
  id: 'childrens-week',
  name: "Children's Week",
  category: 'holiday',
  rarity: 'annual',
  themeId: 'childrens-week',
  summary: "Take an orphan on a tour of the world's landmarks and earn a companion pet.",
  highlights: [
    'Adopt an orphan from a matron',
    'Visit famous sights together',
    'Choose a companion pet reward',
  ],
  links: [{ label: 'Warcraft Wiki', url: "https://warcraft.wiki.gg/wiki/Children's_Week" }],
};
