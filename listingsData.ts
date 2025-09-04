import { LandListing } from './types';

export const LISTINGS_DATA: LandListing[] = [
    {
        id: '1',
        propertyName: 'The Crystal Gorge',
        landOwnerName: 'Jane Doe',
        location: 'A private creek bed 10 miles from Ouray, Colorado',
        fee: 50,
        mineralsKnown: ['Smoky Quartz', 'Amethyst Geodes'],
        accessRules: 'No heavy machinery. Digging tools are welcome. Respect the land.',
        additionalNotes: 'The creek is seasonal, so visit during the spring for the best finds.',
        image: 'https://images.unsplash.com/photo-1589394183539-7223499429d2?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '2',
        propertyName: 'Geode Hill Quarry',
        landOwnerName: 'John Smith',
        location: 'Near Warsaw, Illinois',
        fee: 25,
        mineralsKnown: ['Geodes', 'Calcite', 'Chalcedony'],
        accessRules: 'Daylight hours only. Hard hats recommended. Keep what you find.',
        additionalNotes: 'This is a working quarry, but a specific section is open to the public on weekends.',
        image: 'https://images.unsplash.com/photo-1525199340114-153644b41324?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '3',
        propertyName: "Old Miller's Farm",
        landOwnerName: 'Sam Miller',
        location: 'Rural area outside Nashville, Tennessee',
        fee: 10,
        mineralsKnown: ['Agate', 'Jasper', 'Fossils'],
        accessRules: 'Please check in at the farmhouse before entering the fields. No digging near livestock.',
        additionalNotes: 'Mainly surface collecting in plowed fields. Best after a fresh rain.',
        image: 'https://images.unsplash.com/photo-1444930694458-04f47828c848?q=80&w=800&auto=format&fit=crop',
    }
];
