import type { components } from './api';
import type { ApiError } from './error';

// Import only what we need from OpenAPI schema
export type SurveyAnalytics = components['schemas']['SurveyAnalytics'] & {
  question_stats: Record<string, {
    response_distribution: Record<string, number>;
    average_score?: number;
    completion_time: number;
  }>;
};

// Fix SurveyResponse type to match schema
export interface SurveyResponse {
  id: number;
  survey_id: number;
  responses: Record<string, any>;
  completed: boolean;
  completion_rate: number;
  submitted_at: string;
}

export type Survey = components['schemas']['Survey'] & {
  pages: SurveyPage[];
};
export type SurveyPage = components['schemas']['SurveyPage'];

// Frontend-specific types
export interface SurveysState {
  responses: SurveyResponse[];
  analytics: SurveyAnalytics | null;
  loading: boolean;
  error: ApiError | null;
}

export interface SurveyJSON extends Survey {
  pages: SurveyPage[];
}

// Analytics display props
export interface SurveyAnalyticsDisplayProps {
  survey: Survey;
  response: SurveyAnalytics | null;
  completionRate: number;
}

// Re-export Survey type with alias to avoid conflicts
export type { Survey as SurveyType };
  