import type { components } from './api.d';

// API types
export type Game = components['schemas']['Game'];
export type GameProgress = components['schemas']['GameProgress'];
export type GameScore = components['schemas']['GameScore'];
export type GameScoreRequest = components['schemas']['GameScoreRequest'];

// Frontend-specific types should be clearly marked
export interface FrontendGameConfig {
    scene?: string;
    customConfig?: Record<string, any>;
}

export interface FrontendGameData {
    game: Game;
    frontendConfig: FrontendGameConfig;
} 