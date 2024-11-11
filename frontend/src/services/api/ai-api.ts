import axios from './axios';
import { API_PATHS } from '../../constants/api-path-two';
import { AIAnalysisData, AIAnalysisResult } from '../../types/ai-types';

export const aiAPI = {
    generateAnalysis: (data: AIAnalysisData) => 
        axios.post<{ task_id: string }>(API_PATHS.AI.GENERATE, data),
    
    getAnalysisResult: (id: number) => 
        axios.get<AIAnalysisResult>(API_PATHS.AI.ANALYSIS(id)),
    
    aggregateResults: (userId: number) =>
        axios.post<{ task_id: string }>(API_PATHS.AI.AGGREGATE, { userId }),
    
    getInsights: (userId: number) =>
        axios.get<AIAnalysisResult>(`${API_PATHS.AI.BASE}/insights`, { 
            params: { userId } 
        })
};