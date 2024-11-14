import type { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import type { components } from '../../types/api';

type AIAnalysisData = components['schemas']['AIAnalysisRequest'];
type AIAnalysisResult = components['schemas']['AIAnalysisResult'];
type SuccessResponse<T> = components['schemas']['SuccessResponse'] & {
    data: T;
};

export const aiAPI = {
    generateAnalysis: (data: AIAnalysisData): Promise<AxiosResponse<SuccessResponse<{ task_id: string }>>> => 
        axiosInstance.post(API_PATHS.AI.GENERATE, data),
    
    getAnalysisResult: (id: number): Promise<AxiosResponse<AIAnalysisResult>> => 
        axiosInstance.get(API_PATHS.AI.ANALYSIS(id)),
    
    aggregateResults: (userId: number): Promise<AxiosResponse<SuccessResponse<{ task_id: string }>>> =>
        axiosInstance.post(API_PATHS.AI.AGGREGATE, { userId }),
    
    getInsights: (userId: number): Promise<AxiosResponse<AIAnalysisResult>> =>
        axiosInstance.get(`${API_PATHS.AI.BASE}/insights`, { 
            params: { userId } 
        })
};