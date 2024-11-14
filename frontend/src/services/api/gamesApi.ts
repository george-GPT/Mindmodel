import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import { API_PATHS } from './apiPaths';
import type { components } from '../../types/api.d';

export const gamesApi = {
    getConfig: () => 
        axiosInstance.get<components['schemas']['SuccessResponse']>(
            API_PATHS.GAMES.CONFIG
        ),

    getGameById: (id: string) => 
        axiosInstance.get<components['schemas']['SuccessResponse']>(
            API_PATHS.GAMES.DETAIL(id)
        ),

    recordScore: (id: string, data: components['schemas']['GameScoreRequest']) => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.GAMES.RECORD_SCORE(id),
            data
        ),

    getProgress: () => 
        axiosInstance.get<components['schemas']['SuccessResponse']>(
            API_PATHS.GAMES.PROGRESS
        )
}; 