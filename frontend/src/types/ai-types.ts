export interface AIAnalysisData {
    userId: number;
    surveyResponses: Record<string, any>;
    gameScores: Record<string, number>;
}

export interface AIAnalysisResult {
    id: number;
    userId: number;
    status: 'pending' | 'completed' | 'failed';
    results: {
        insights: string[];
        recommendations: string[];
        charts: {
            type: string;
            data: any;
            options: any;
        }[];
    };
    createdAt: string;
    updatedAt: string;
} 