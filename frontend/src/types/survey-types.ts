export interface SurveyResponse {
    id: number;
    userId: number;
    surveyId: string;
    responses: Record<string, any>;
    completedAt: string;
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    questions: SurveyQuestion[];
    required: boolean;
    category: string;
}

export interface SurveyQuestion {
    id: string;
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