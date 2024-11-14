// services/api/gamesApi.ts

import type { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import { API_PATHS } from '../api/apiPaths';
import type { components } from '../../types/api';

type Game = components['schemas']['Game'];
type GameScore = components['schemas']['GameScore'];
type GameProgress = components['schemas']['GameProgress'];
type SuccessResponse<T> = components['schemas']['SuccessResponse'] & {
    data: T;
};

export const gamesAPI = {
    /**
     * Fetches a list of games.
     * @returns Promise resolving to an AxiosResponse containing an array of Game objects.
     */
    getGames: (): Promise<AxiosResponse<SuccessResponse<Game[]>>> => 
        axiosInstance.get(API_PATHS.GAMES.BASE),

    /**
     * Fetches details of a specific game by ID.
     * @param id - The ID of the game.
     * @returns Promise resolving to an AxiosResponse containing a single Game object.
     */
    getGameDetails: (id: number): Promise<AxiosResponse<SuccessResponse<Game>>> => 
        axiosInstance.get(API_PATHS.GAMES.DETAIL(id.toString())),

    /**
     * Fetches the configuration of a specific game by ID.
     * @param id - The ID of the game.
     * @returns Promise resolving to an AxiosResponse containing the Game configuration.
     */
    getGameConfig: (id: number): Promise<AxiosResponse<SuccessResponse<Game>>> => 
        axiosInstance.get(`${API_PATHS.GAMES.CONFIG}/${id}`),

    /**
     * Records a score for a specific game.
     * @param gameId - The ID of the game.
     * @param data - The score data excluding 'id' and 'user'.
     * @returns Promise resolving to an AxiosResponse containing the recorded GameScore.
     */
    recordScore: (gameId: number, data: Omit<GameScore, 'id' | 'user'>): Promise<AxiosResponse<SuccessResponse<GameScore>>> => 
        axiosInstance.post(`${API_PATHS.GAMES.RECORD_SCORE(gameId)}`, data),

    /**
     * Fetches the progress of games.
     * @returns Promise resolving to an AxiosResponse containing an array of GameProgress objects.
     */
    getProgress: (): Promise<AxiosResponse<SuccessResponse<GameProgress[]>>> => 
        axiosInstance.get(API_PATHS.GAMES.PROGRESS),

    /**
     * Updates the progress of a specific game.
     * @param progressId - The ID of the progress record.
     * @param data - Partial data to update the GameProgress.
     * @returns Promise resolving to an AxiosResponse containing the updated GameProgress.
     */
    updateProgress: (progressId: string, data: Partial<GameProgress>): Promise<AxiosResponse<SuccessResponse<GameProgress>>> => 
        axiosInstance.patch(`${API_PATHS.GAMES.PROGRESS}/${progressId}`, data)
};
