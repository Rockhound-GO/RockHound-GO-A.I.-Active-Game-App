import { MapTheme } from './types';

export const MAP_THEMES: MapTheme[] = [
    {
        id: 'classic',
        name: 'Classic',
        colors: {
            background: '#2c3e50', // Slate blue
            roads: '#7f8c8d',      // Gray
            water: '#3498db',      // Blue
            parks: '#27ae60',      // Green
            buildings: '#bdc3c7',  // Light gray
            poiDefault: '#e67e22', // Orange
        },
    },
    {
        id: 'dusk',
        name: 'Dusk',
        colors: {
            background: '#1a1a2e', // Deep navy
            roads: '#4a4e69',      // Dark gray-purple
            water: '#6a8d92',      // Muted teal
            parks: '#3e5c76',      // Dark desaturated blue
            buildings: '#2c3e50',  // Dark slate
            poiDefault: '#e94560', // Bright pink/red
        },
    },
    {
        id: 'desert',
        name: 'Desert',
        colors: {
            background: '#f0e68c', // Khaki
            roads: '#d2b48c',      // Tan
            water: '#87ceeb',      // Sky blue
            parks: '#90ee90',      // Light green
            buildings: '#cd853f',  // Peru
            poiDefault: '#d2691e', // Chocolate
        },
    },
];
