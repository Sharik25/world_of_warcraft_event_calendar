import type { EventDefinition } from '@/domain/types';

export const winterVeil: EventDefinition = {
  id: 'winter-veil',
  name: 'Feast of Winter Veil',
  shortName: 'Winter Veil',
  category: 'holiday',
  rarity: 'annual',
  themeId: 'winter-veil',
  summary: 'Greatfather Winter brings gifts, snowballs and seasonal cheer to the capitals.',
  highlights: [
    'Gifts under the tree on Winter Veil morning',
    'Snowball fights and festive outfits',
    'Seasonal quests and recipes',
  ],
  links: [{ label: 'Warcraft Wiki', url: 'https://warcraft.wiki.gg/wiki/Feast_of_Winter_Veil' }],
};
