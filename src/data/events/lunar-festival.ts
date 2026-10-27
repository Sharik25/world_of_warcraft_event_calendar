import type { EventDefinition } from '@/domain/types';

export const lunarFestival: EventDefinition = {
  id: 'lunar-festival',
  name: 'Lunar Festival',
  category: 'holiday',
  rarity: 'annual',
  themeId: 'lunar-festival',
  summary: 'Honor the Elders scattered across Azeroth and celebrate the new year in Moonglade.',
  highlights: [
    'Seek out the Elders for Coins of Ancestry',
    'Fireworks and lanterns in Moonglade',
    'Festive clothing and recipes',
  ],
  links: [{ label: 'Warcraft Wiki', url: 'https://warcraft.wiki.gg/wiki/Lunar_Festival' }],
};
