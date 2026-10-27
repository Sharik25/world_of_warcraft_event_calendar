import type { EventDefinition } from '@/domain/types';

export const stvFishing: EventDefinition = {
  id: 'stv-fishing',
  name: 'Stranglethorn Fishing Extravaganza',
  shortName: 'Fishing',
  category: 'fishing',
  rarity: 'weekly',
  themeId: 'fishing',
  summary:
    'A weekly contest in Stranglethorn Vale: be the first to bring back the rare fish and win.',
  highlights: [
    'First to turn in 40 Speckled Tastyfish wins',
    'Fish the pools along the Stranglethorn coast',
    'Prizes include rare fishing gear',
  ],
  links: [
    {
      label: 'Warcraft Wiki',
      url: 'https://warcraft.wiki.gg/wiki/Stranglethorn_Fishing_Extravaganza',
    },
  ],
};
