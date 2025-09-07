export enum MessageAuthor {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export interface GameMessage {
  author: MessageAuthor;
  text: string;
  imageUrls?: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isUser?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Unknown';

export interface JournalEntry {
  id: string;
  name: string;
  description: string;
  score: number;
  date: string;
  imageUrl: string;
  rarity: Rarity;
}

export interface Specimen {
    name: string;
    formula: string;
    hardness: string;
    luster: string;
    crystalSystem: string;
    description: string;
    funFact?: string;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    reward: number;
    check: (journal: JournalEntry[], score: number) => boolean;
}

export interface MapTheme {
    id: string;
    name: string;
    colors: {
        background: string;
        roads: string;
        water: string;
        parks: string;
        buildings: string;
        poiDefault: string;
    };
}

export interface LandListing {
  id: string;
  propertyName: string;
  landOwnerName: string;
  location: string;
  fee: number;
  mineralsKnown: string[];
  accessRules: string;
  additionalNotes: string;
  image: string;
}

// --- New Map Feature Types ---
export enum MapFeatureType {
    FORMATION = 'FORMATION',
    DEPOSIT = 'DEPOSIT',
    POI = 'POI',
    USER_POI = 'USER_POI',
}

export interface MapFeature {
    id: string;
    name: string;
    type: MapFeatureType;
    position: { top: string; left: string };
    description?: string;
    // For formations
    size?: { width: string; height: string };
    color?: string;
    shape?: 'rect' | 'circle';
    // For deposits/POIs
    icon?: 'crystal' | 'quarry' | 'mine';
}

export interface User {
    name: string;
    avatarId: string;
    cloverTraits?: {
        friendliness: number;
        curiosity: number;
    };
}

export interface ChatMessage {
    author: 'USER' | 'CLOVER';
    text: string;
}

// --- New Weather Types ---
export type WeatherIconType = 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';

export interface CurrentWeather {
    temperature: number;
    description: string;
    precipitationChance: number;
    icon: WeatherIconType;
}

export interface ForecastDay {
    day: string;
    temperature: number;
    description: string;
    icon: WeatherIconType;
}

export interface WeatherData {
    current: CurrentWeather;
    forecast: ForecastDay[];
}

// --- New Investigation Types ---
export interface InvestigationFind {
    name: string;
    description: string;
    rarity: Rarity;
    score: number;
}

export interface InvestigationResult {
    story: string;
    specimen: InvestigationFind | null;
}