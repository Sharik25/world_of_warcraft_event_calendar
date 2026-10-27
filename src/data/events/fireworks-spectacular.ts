import type { EventDefinition } from '@/domain/types';

export const fireworksSpectacular: EventDefinition = {
  id: 'fireworks-spectacular',
  name: 'Fireworks Spectacular',
  shortName: 'Fireworks',
  category: 'holiday',
  rarity: 'annual',
  themeId: 'fireworks',
  summary: 'A night of fireworks lights up the skies above the major cities.',
  highlights: [
    'Watch the fireworks shows over the capitals',
    'Buy fireworks from vendors',
    'A one-day celebration during Midsummer',
  ],
  links: [{ label: 'Warcraft Wiki', url: 'https://warcraft.wiki.gg/wiki/Fireworks_Spectacular' }],
};
