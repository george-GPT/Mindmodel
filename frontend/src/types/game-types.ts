// src/types/GameTypes.ts

export interface GameTrial {
  stimulusId: string;
  response: boolean;
  correct: boolean;
  reactionTime: number;
}

export interface GameScore {
  gameId: string;
  score: number;
  trials?: GameTrial[];
}

export interface ColorShapesConfig {
  scene: string;
  // Add other configuration options that ColorShapes expects
}

// Specific game data interfaces
export interface ColorShapesData {
  gameId: string;
  score: number;
  trials: GameTrial[];  // Using the common GameTrial interface
}

export interface GameData {
  score: number;
  // Add any other common game data properties here
}

export interface GameScore {
  id: number;
  userId: number;
  gameId: string;
  score: number;
  completedAt: string;
}

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  instructions: string;
  minScore: number;
  maxScore: number;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  requiredForCompletion: boolean;
}

export interface GameProgress {
  gameId: string;
  userId: number;
  currentLevel: number;
  currentScore: number;
  timeSpent: number;
  lastPlayed: string;
  completed: boolean;
} 