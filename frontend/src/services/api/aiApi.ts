import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import { API_PATHS } from './apiPaths';
import type { components } from '../../types/api.d';

export const aiApi = {
    generateAnalysis: (data: components['schemas']['AIAnalysisRequest']) => 
        axiosInstance.post<components['schemas']['AIAnalysisResponse']>(
            API_PATHS.AI.GENERATE,
            data
        ),

    getAnalysis: (id: number) => 
        axiosInstance.get<components['schemas']['AIAnalysisResult']>(
            API_PATHS.AI.ANALYSIS(id)
        ),

    getAggregateAnalysis: () => 
        axiosInstance.get<components['schemas']['SuccessResponse']>(
            API_PATHS.AI.AGGREGATE
        )
};