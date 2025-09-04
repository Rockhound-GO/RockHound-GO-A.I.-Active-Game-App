import { Achievement, JournalEntry } from './types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-find',
        title: 'First Find',
        description: 'You identified your first specimen!',
        reward: 50,
        check: (journal: JournalEntry[]) => journal.length >= 1,
    },
    {
        id: 'rock-solid',
        title: 'Rock Solid',
        description: 'Identify 5 different specimens.',
        reward: 100,
        check: (journal: JournalEntry[]) => journal.length >= 5,
    },
    {
        id: 'common-collector',
        title: 'Common Collector',
        description: 'Collect 10 Common specimens.',
        reward: 75,
        check: (journal: JournalEntry[]) => journal.filter(e => e.rarity === 'Common').length >= 10,
    },
    {
        id: 'high-roller',
        title: 'High Roller',
        description: 'Amass a total score of 1,000.',
        reward: 250,
        check: (journal: JournalEntry[], score: number) => score >= 1000,
    },
    {
        id: 'rare-find',
        title: 'Rare Find',
        description: 'Discover your first Rare specimen.',
        reward: 150,
        check: (journal: JournalEntry[]) => journal.some(e => e.rarity === 'Rare'),
    },
    {
        id: 'epic-discovery',
        title: 'Epic Discovery',
        description: 'Unearth an Epic specimen.',
        reward: 500,
        check: (journal: JournalEntry[]) => journal.some(e => e.rarity === 'Epic'),
    },
    {
        id: 'journeyman-geologist',
        title: 'Journeyman Geologist',
        description: 'Identify 15 different specimens.',
        reward: 200,
        check: (journal: JournalEntry[]) => journal.length >= 15,
    },
    {
        id: 'legendary-hunter',
        title: 'Legendary Hunter',
        description: 'Find a specimen of Legendary rarity.',
        reward: 1000,
        check: (journal: JournalEntry[]) => journal.some(e => e.rarity === 'Legendary'),
    },
];
