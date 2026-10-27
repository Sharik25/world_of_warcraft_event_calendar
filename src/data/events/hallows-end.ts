import type { EventDefinition } from '@/domain/types';

export const hallowsEnd: EventDefinition = {
  id: 'hallows-end',
  name: "Hallow's End",
  category: 'holiday',
  rarity: 'annual',
  themeId: 'hallows-end',
  summary: 'Trick-or-treat at the inns, wear costumes and help fight the Headless Horseman.',
  highlights: [
    'Trick-or-treat at innkeepers',
    'Defeat the Headless Horseman',
    'Wands, masks and costumes',
  ],
  links: [{ label: 'Warcraft Wiki', url: "https://warcraft.wiki.gg/wiki/Hallow's_End" }],
};
