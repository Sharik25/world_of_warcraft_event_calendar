import type { EventDefinition } from '@/domain/types';

export const harvestFestival: EventDefinition = {
  id: 'harvest-festival',
  name: 'Harvest Festival',
  category: 'holiday',
  rarity: 'annual',
  themeId: 'harvest-festival',
  summary:
    'Give thanks for the harvest and remember fallen heroes at the shrines outside the capitals.',
  highlights: ['Visit the memorial shrines', 'Share a festive feast', 'A short, quiet holiday'],
  links: [{ label: 'Warcraft Wiki', url: 'https://warcraft.wiki.gg/wiki/Harvest_Festival' }],
};
