export type Category = 'Technology' | 'Health' | 'Finance' | 'Education' | 'Entertainment' | 'Social' | 'Commerce' | 'Other';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type MarketPotential = 'Low' | 'Medium' | 'High' | 'Massive';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Idea {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  description?: string; // Frontend uses description, backend uses problemStatement for validation but we'll map them
  problemStatement: string;
  category: Category;
  difficulty?: Difficulty; // Frontend uses difficulty
  difficultyScore: number; // Backend uses difficultyScore
  marketPotential: string; // Backend uses number for logic, but returns string or we map it
  marketPotentialValue: number;
  votes?: number; // Frontend
  upvotes: number; // Backend
  views: number;
  visibilityStatus: 'active' | 'hidden';
  isArchived: boolean;
  userId: string;
  expiryTime?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Statistics {
  totalIdeas: number;
  avgDifficulty: number;
  avgVotes: number;
  mostPopularCategory: Category | null;
  highestMarketPotentialCount: number;
}

export interface FilterState {
  category: Category | 'All';
  difficulty: Difficulty | null;
  marketPotential: MarketPotential | 'All';
  visibility: 'All' | 'active' | 'hidden';
}

export interface SearchState {
  query: string;
}
