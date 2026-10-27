import type { EventDefinition } from '@/domain/types';

export const darkmoonFaire: EventDefinition = {
  id: 'darkmoon-faire',
  name: 'Darkmoon Faire',
  category: 'faire',
  rarity: 'monthly',
  themeId: 'darkmoon-faire',
  summary:
    "Silas Darkmoon's travelling carnival brings games, prizes and fortunes for a week each month.",
  highlights: [
    'Turn in Darkmoon cards and decks',
    'Play games for prize tickets',
    'Get your fortune told',
  ],
  links: [
    { label: 'Warcraft Wiki', url: 'https://warcraft.wiki.gg/wiki/Darkmoon_Faire_(Classic)' },
  ],
};
