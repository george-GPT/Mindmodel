import type { components } from './api';

export interface AIAnalysisData {
    surveyData?: Record<string, unknown>;
    gameData?: Record<string, unknown>;
}

export interface AIAnalysisResult {
    success: boolean;
    message?: string;
    data?: {
        id: number;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        insights: {
            surveys?: {
                summary: string;
                key_findings: string[];
                recommendations: string[];
            };
            games?: {
                summary: string;
                performance_metrics: {
                    accuracy: string;
                    speed: string;
                    consistency: string;
                };
            };
            overall: {
                summary: string;
                strengths: string[];
                areas_for_improvement: string[];
                recommendations: string[];
            };
        };
        charts?: Record<string, unknown>;
        created_at: string;
        updated_at: string;
    };
} 