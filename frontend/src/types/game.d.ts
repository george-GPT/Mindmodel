import { components } from './api';

// Game-specific types that extend API types
export interface GameData extends components['schemas']['Game'] {
    // Additional frontend-specific properties
    scene?: string;
    config?: Record<string, any>;
}

// Export game-specific enums and types
export { DifficultyEnum } from './api';
export type GameConfig = components['schemas']['GameConfig'];
export type GameProgress = components['schemas']['GameProgress'];
export type GameScore = components['schemas']['GameScore']; 