import { RockhoundingSite } from './types';

export const ROCKHOUNDING_SITES: RockhoundingSite[] = [
    {
        id: 'site-1',
        name: 'Herkimer Diamond Mines',
        latitude: 43.0378,
        longitude: -74.9632,
        minerals: ['Herkimer Diamond (Quartz)'],
        description: 'Famous for its doubly-terminated quartz crystals. Visitors can pay a fee to collect their own specimens.'
    },
    {
        id: 'site-2',
        name: 'Emerald Hollow Mine',
        latitude: 35.8893,
        longitude: -81.9974,
        minerals: ['Emerald', 'Aquamarine', 'Garnet', 'Topaz'],
        description: 'The only emerald mine in the United States open to the public for prospecting. Sluicing and creek prospecting are available.'
    },
    {
        id: 'site-3',
        name: 'Topaz Mountain',
        latitude: 39.7128,
        longitude: -113.1039,
        minerals: ['Topaz', 'Bixbyite', 'Pseudobrookite', 'Red Beryl'],
        description: 'A world-renowned location for collecting sherry-colored topaz crystals. Requires careful searching in the rhyolite rock.'
    },
    {
        id: 'site-4',
        name: 'Crater of Diamonds State Park',
        latitude: 34.0322,
        longitude: -93.6713,
        minerals: ['Diamond', 'Amethyst', 'Garnet', 'Peridot'],
        description: 'One of the only places in the world where the public can search for real diamonds in their original volcanic source.'
    },
    {
        id: 'site-5',
        name: 'Glass Buttes',
        latitude: 43.6882,
        longitude: -119.6480,
        minerals: ['Obsidian (Rainbow, Gold Sheen, Fire)'],
        description: 'A massive area known for high-quality obsidian. Collectors can find many varieties, including rainbow, sheen, and fire obsidian.'
    }
];