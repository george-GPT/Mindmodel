import type { AxiosResponse } from 'axios';
import axiosInstance from './axios-instance';
import { API_PATHS } from '../../constants/api-paths';
import type { components } from '../../types/api';

type Game = components['schemas']['Game'];
type GameScore = components['schemas']['GameScore'];
type GameProgress = components['schemas']['GameProgress'];
type SuccessResponse<T> = components['schemas']['SuccessResponse'] & {
    data: T;
};

export const gamesAPI = {
    getGames: (): Promise<AxiosResponse<SuccessResponse<Game[]>>> => 
        axiosInstance.get(API_PATHS.GAMES.BASE),

    getGameDetails: (id: number): Promise<AxiosResponse<SuccessResponse<Game>>> => 
        axiosInstance.get(API_PATHS.GAMES.DETAIL(id.toString())),

    getGameConfig: (id: number): Promise<AxiosResponse<SuccessResponse<Game>>> => 
        axiosInstance.get(`${API_PATHS.GAMES.CONFIG}/${id}`),

    recordScore: (gameId: number, data: Omit<GameScore, 'id' | 'user'>): Promise<AxiosResponse<SuccessResponse<GameScore>>> => 
        axiosInstance.post(`${API_PATHS.GAMES.BASE}/${gameId}/record_score`, data),

    getProgress: (): Promise<AxiosResponse<SuccessResponse<GameProgress[]>>> => 
        axiosInstance.get(API_PATHS.GAMES.PROGRESS),

    updateProgress: (progressId: string, data: Partial<GameProgress>): Promise<AxiosResponse<SuccessResponse<GameProgress>>> => 
        axiosInstance.patch(`${API_PATHS.GAMES.PROGRESS}/${progressId}`, data)
}; 