import type { components } from './api.d';

// Game-specific types that extend API types
export interface GameData extends components['schemas']['Game'] {
    // Additional frontend-specific properties
    scene?: string;
    config?: Record<string, any>;
}

// Export game-specific types
export type GameConfig = components['schemas']['GameConfig'];
export type GameProgress = components['schemas']['GameProgress'];
export type GameScore = components['schemas']['GameScore'];

// Note: DifficultyEnum is not in the API schema, so we shouldn't export it 