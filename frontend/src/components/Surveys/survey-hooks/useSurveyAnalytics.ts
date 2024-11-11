import { useState, useCallback } from 'react';

interface ResponsePattern {
    categoryDistribution: Record<string, number>;
    responseTypes: {
        multipleChoice: number;
        openEnded: number;
        scale: number;
        yesNo: number;
    };
    sentimentAnalysis: {
        positive: number;
        neutral: number;
        negative: number;
    };
    confidenceLevel: {
        high: number;
        medium: number;
        low: number;
    };
}

interface SurveyAnalytics {
    totalQuestions: number;
    completionRate: number;
    patterns: ResponsePattern;
    insightSummary: string[];
}

export const useSurveyAnalytics = () => {
    const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);

    const generateAnalytics = useCallback((surveyData: any) => {
        const patterns: ResponsePattern = {
            categoryDistribution: {},
            responseTypes: {
                multipleChoice: 0,
                openEnded: 0,
                scale: 0,
                yesNo: 0
            },
            sentimentAnalysis: {
                positive: 0,
                neutral: 0,
                negative: 0
            },
            confidenceLevel: {
                high: 0,
                medium: 0,
                low: 0
            }
        };

        // Process survey data
        const responses = surveyData.responses || {};
        const questions = surveyData.questions || [];
        const totalQuestions = questions.length;
        const answeredQuestions = Object.keys(responses).length;

        // Analyze response patterns
        Object.entries(responses).forEach(([questionId, response]: [string, any]) => {
            const question = questions.find((q: any) => q.id === questionId);
            if (!question) return;

            // Track category distribution
            if (question.category) {
                patterns.categoryDistribution[question.category] = 
                    (patterns.categoryDistribution[question.category] || 0) + 1;
            }

            // Track response types
            switch (question.type) {
                case 'multiple':
                    patterns.responseTypes.multipleChoice++;
                    break;
                case 'text':
                    patterns.responseTypes.openEnded++;
                    break;
                case 'scale':
                    patterns.responseTypes.scale++;
                    break;
                case 'boolean':
                    patterns.responseTypes.yesNo++;
                    break;
            }

            // Simple sentiment analysis for text responses
            if (question.type === 'text' && typeof response === 'string') {
                const sentiment = analyzeSentiment(response);
                patterns.sentimentAnalysis[sentiment]++;
            }

            // Analyze confidence level
            if (question.type === 'scale') {
                const confidence = analyzeConfidence(response);
                patterns.confidenceLevel[confidence]++;
            }
        });

        const analytics: SurveyAnalytics = {
            totalQuestions,
            completionRate: (answeredQuestions / totalQuestions) * 100,
            patterns,
            insightSummary: generateInsights(patterns, totalQuestions)
        };

        setAnalytics(analytics);
        return analytics;
    }, []);

    const getChartData = useCallback(() => {
        if (!analytics) return null;

        return {
            categoryChart: {
                labels: Object.keys(analytics.patterns.categoryDistribution),
                data: Object.values(analytics.patterns.categoryDistribution),
                title: 'Response Distribution by Category'
            },
            responseTypesChart: {
                labels: ['Multiple Choice', 'Open Ended', 'Scale', 'Yes/No'],
                data: Object.values(analytics.patterns.responseTypes),
                title: 'Question Types'
            },
            sentimentChart: {
                labels: ['Positive', 'Neutral', 'Negative'],
                data: Object.values(analytics.patterns.sentimentAnalysis),
                title: 'Response Sentiment'
            },
            confidenceChart: {
                labels: ['High', 'Medium', 'Low'],
                data: Object.values(analytics.patterns.confidenceLevel),
                title: 'Confidence Levels'
            }
        };
    }, [analytics]);

    return {
        generateAnalytics,
        getChartData,
        analytics
    };
};

// Helper functions
const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    // Assessment-specific word lists
    const assessmentWords = {
        // Pre-Assessment & Baseline
        baseline: {
            positive: ['comfortable', 'ready', 'prepared', 'confident', 'capable', 'willing'],
            negative: ['uncomfortable', 'unprepared', 'hesitant', 'unsure', 'reluctant'],
            neutral: ['okay', 'average', 'typical', 'normal']
        },
        // Personality & Preferences
        personality: {
            positive: ['outgoing', 'adaptable', 'organized', 'creative', 'analytical', 'methodical'],
            negative: ['rigid', 'disorganized', 'inflexible', 'scattered', 'chaotic'],
            neutral: ['balanced', 'moderate', 'mixed', 'varied']
        },
        // Memory Assessment
        memory: {
            positive: ['remember', 'recall', 'recognize', 'retain', 'clear', 'vivid'],
            negative: ['forget', 'blur', 'confuse', 'mix-up', 'struggle'],
            neutral: ['sometimes', 'occasionally', 'partial', 'depends']
        },
        // Executive Function
        executive: {
            positive: ['plan', 'organize', 'focus', 'control', 'manage', 'coordinate'],
            negative: ['impulsive', 'distracted', 'overwhelmed', 'disorganized', 'procrastinate'],
            neutral: ['variable', 'situational', 'depends', 'sometimes']
        },
        // Attention
        attention: {
            positive: ['focused', 'alert', 'attentive', 'concentrated', 'engaged', 'mindful'],
            negative: ['distracted', 'scattered', 'unfocused', 'wandering', 'restless'],
            neutral: ['varies', 'fluctuates', 'moderate', 'average']
        },
        // Processing
        processing: {
            positive: ['quick', 'efficient', 'fast', 'adaptive', 'flexible', 'responsive'],
            negative: ['slow', 'delayed', 'confused', 'overwhelmed', 'stuck'],
            neutral: ['steady', 'consistent', 'regular', 'moderate']
        }
    };

    const lowerText = text.toLowerCase();
    let scores = {
        positive: 0,
        negative: 0,
        neutral: 0
    };

    // Calculate scores across all assessment types
    Object.values(assessmentWords).forEach(category => {
        // Weight positive words more heavily in relevant contexts
        category.positive.forEach(word => {
            if (lowerText.includes(word)) {
                scores.positive += lowerText.split(word).length - 1;
            }
        });

        // Weight negative words based on context
        category.negative.forEach(word => {
            if (lowerText.includes(word)) {
                scores.negative += lowerText.split(word).length - 1;
            }
        });

        // Count neutral words
        category.neutral.forEach(word => {
            if (lowerText.includes(word)) {
                scores.neutral += lowerText.split(word).length - 1;
            }
        });
    });

    // Apply assessment-specific analysis
    if (lowerText.includes('memory') || lowerText.includes('recall')) {
        // Weight memory-related responses
        scores.positive *= 1.2;
    } else if (lowerText.includes('attention') || lowerText.includes('focus')) {
        // Weight attention-related responses
        scores.positive *= 1.1;
    } else if (lowerText.includes('process') || lowerText.includes('speed')) {
        // Weight processing-related responses
        scores.positive *= 1.15;
    }

    // Determine overall sentiment with weighted scores
    const totalScore = scores.positive + scores.negative + scores.neutral;
    const positiveThreshold = totalScore * 0.4; // 40% threshold for positive
    const negativeThreshold = totalScore * 0.35; // 35% threshold for negative

    if (scores.positive > positiveThreshold && scores.positive > scores.negative) {
        return 'positive';
    } else if (scores.negative > negativeThreshold && scores.negative > scores.positive) {
        return 'negative';
    }
    return 'neutral';
};

const analyzeConfidence = (value: any): 'high' | 'medium' | 'low' => {
    // Enhanced confidence analysis based on response patterns
    if (typeof value === 'number') {
        // For numeric scale responses (1-10)
        if (value >= 8) return 'high';
        if (value >= 5) return 'medium';
        return 'low';
    }
    
    // For multiple choice or boolean responses
    if (typeof value === 'boolean') {
        return value ? 'high' : 'low';
    }
    
    // For string responses, analyze length and detail
    if (typeof value === 'string' && value.trim()) {  // Add null check and trim
        const words = value.trim().split(' ').length;
        if (words > 30) return 'high';  // Detailed response
        if (words > 10) return 'medium'; // Moderate response
        return 'low';                    // Brief response
    }

    return 'medium'; // Default case
};

const generateInsights = (patterns: ResponsePattern, totalQuestions: number): string[] => {
    const insights: string[] = [];
    
    // Category Distribution Insights
    const mostCommonCategory = Object.entries(patterns.categoryDistribution)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommonCategory) {
        insights.push(`You focused most on ${mostCommonCategory[0]} topics`);
    }

    // Response Type Analysis
    const openEndedPercentage = (patterns.responseTypes.openEnded / totalQuestions) * 100;
    if (openEndedPercentage > 30) {
        insights.push('You provided detailed responses to open-ended questions');
    }

    // Sentiment Analysis Insights
    const { positive, neutral, negative } = patterns.sentimentAnalysis;
    const totalResponses = positive + neutral + negative;
    const positivePercentage = (positive / totalResponses) * 100;
    const negativePercentage = (negative / totalResponses) * 100;

    if (positivePercentage > 60) {
        insights.push('Your responses show a consistently positive outlook');
    } else if (negativePercentage > 60) {
        insights.push('Your responses indicate some areas of concern');
    } else {
        insights.push('Your responses show a balanced perspective');
    }

    // Confidence Level Analysis
    const { high, medium, low } = patterns.confidenceLevel;
    const totalConfidence = high + medium + low;
    const highConfidencePercentage = (high / totalConfidence) * 100;
    const lowConfidencePercentage = (low / totalConfidence) * 100;

    if (highConfidencePercentage > 60) {
        insights.push('You show high confidence in most of your responses');
    } else if (lowConfidencePercentage > 60) {
        insights.push('You might benefit from additional support in some areas');
    } else {
        insights.push('Your confidence levels vary across different topics');
    }

    return insights;
};
