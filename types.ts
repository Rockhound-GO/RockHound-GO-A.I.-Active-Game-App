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

export interface JournalEntry {
  id: string;
  name: string;
  description: string;
  score: number;
  date: string;
  imageUrl: string;
}
