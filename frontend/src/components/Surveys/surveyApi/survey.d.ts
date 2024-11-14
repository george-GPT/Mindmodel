import { components } from '../../../types/api';

export type Survey = components['schemas']['Survey'] & {
  id: number;
  title: string;
  pages: SurveyPage[];
  metadata?: {
    type?: string;
    version?: string;
  };
  created_at: string;
  updated_at: string;
};

export type SurveyResponse = components['schemas']['SurveyResponse'] & {
  id: number;
  survey_id: number;
  responses: Record<string, any>;
  completed: boolean;
  completion_rate: number;
  submitted_at: string;
};

export type SurveyAnalytics = {
  completionRate: number;
  charts: {
    responseTypes: ChartData;
    categoryDistribution: ChartData;
  };
  insights: string[];
};

export interface ChartData {
  labels: string[];
  data: number[];
  title: string;
}

export interface FrontendSurveyQuestion {
  type: 'multipleChoice' | 'text' | 'scale' | 'boolean' | 'matrix';
  title: string;
  description?: string;
  required: boolean;
  category?: string;
  options?: string[];
  scale?: {
    min: number;
    max: number;
    labels?: string[];
  };
}

export interface SurveyPage {
  name: string;
  elements: FrontendSurveyQuestion[];
}

export interface SurveyJSON {
  title: string;
  pages: SurveyPage[];
  [key: string]: any;
} 