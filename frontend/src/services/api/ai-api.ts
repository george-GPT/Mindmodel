import axios from './axios';
import { API_PATHS } from '../../constants/api-path-two';
import type { AIAnalysisData, AIAnalysisResult } from 'types/ai.types';
import type { components } from 'types/api';

export const aiAPI = {
    generateAnalysis: (data: AIAnalysisData) => 
        axios.post<components['schemas']['SuccessResponse'] & {
            data: { task_id: string }
        }>(API_PATHS.AI.GENERATE, data),
    
    getAnalysisResult: (id: number) => 
        axios.get<AIAnalysisResult>(API_PATHS.AI.ANALYSIS(id)),
    
    aggregateResults: (userId: number) =>
        axios.post<components['schemas']['SuccessResponse'] & {
            data: { task_id: string }
        }>(API_PATHS.AI.AGGREGATE, { userId }),
    
    getInsights: (userId: number) =>
        axios.get<AIAnalysisResult>(`${API_PATHS.AI.BASE}/insights`, { 
            params: { userId } 
        })
};