import { components } from './api';

export type Survey = components['schemas']['Survey'];
export type SurveyResponse = components['schemas']['SurveyResponse'];

// Frontend-specific survey types
export interface SurveyQuestion {
    type: 'text' | 'choice' | 'scale' | 'matrix';
    title: string;
    description?: string;
    required: boolean;
    options?: string[];
    scale?: {
        min: number;
        max: number;
        labels?: string[];
    };
}

// Add SurveyJS specific types
export interface SurveyPage {
    name: string;
    elements: SurveyQuestion[];
}

export interface SurveyJSON {
    title: string;
    pages: SurveyPage[];
    [key: string]: any; // For any additional SurveyJS properties
} 