import { MapFeature, MapFeatureType } from './types';

export const MAP_FEATURES: MapFeature[] = [
    // --- Geological Formations ---
    {
        id: 'formation-1',
        name: 'Morrison Formation (Sedimentary)',
        type: MapFeatureType.FORMATION,
        position: { top: '15%', left: '10%' },
        size: { width: '30%', height: '25%' },
        color: 'rgba(210, 180, 140, 0.3)', // Tan
        shape: 'rect',
    },
    {
        id: 'formation-2',
        name: 'Igneous Intrusion',
        type: MapFeatureType.FORMATION,
        position: { top: '60%', left: '55%' },
        size: { width: '25%', height: '25%' },
        color: 'rgba(128, 128, 128, 0.4)', // Gray
        shape: 'circle',
    },
    // --- Mineral Deposits ---
    {
        id: 'deposit-1',
        name: 'Quartz Veins',
        type: MapFeatureType.DEPOSIT,
        position: { top: '68%', left: '62%' },
        icon: 'crystal',
    },
    {
        id: 'deposit-2',
        name: 'Geode Beds',
        type: MapFeatureType.DEPOSIT,
        position: { top: '25%', left: '30%' },
        icon: 'crystal',
    },
    {
        id: 'deposit-3',
        name: 'Garnet Cluster',
        type: MapFeatureType.DEPOSIT,
        position: { top: '75%', left: '78%' },
        icon: 'crystal',
    },
    // --- Points of Interest ---
    {
        id: 'poi-1',
        name: 'Old Quarry',
        type: MapFeatureType.POI,
        position: { top: '45%', left: '70%' },
        icon: 'quarry',
    },
    {
        id: 'poi-2',
        name: 'Abandoned Copper Mine',
        type: MapFeatureType.POI,
        position: { top: '80%', left: '20%' },
        icon: 'mine',
    },
    {
        id: 'poi-3',
        name: 'Fossil Dig Site',
        type: MapFeatureType.POI,
        position: { top: '20%', left: '15%' },
        icon: 'quarry',
    }
];
