export enum MessageAuthor {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export interface GameMessage {
  author: MessageAuthor;
  text: string;
  imageUrl?: string;
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
