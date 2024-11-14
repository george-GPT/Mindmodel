import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import type { Survey, SurveyResponse, FrontendSurveyQuestion } from '../surveyApi/survey';

interface ChartData {
  labels: string[];
  data: number[];
  title: string;
}

interface AnalyticsResult {
  completionRate: number;
  charts: {
    responseTypes: ChartData;
    categoryDistribution: ChartData;
  };
  insights: string[];
}

type ResponseTypes = {
  [K in FrontendSurveyQuestion['type']]: number;
};

export const useSurveyAnalytics = () => {
  const surveyResponses = useSelector((state: RootState) => state.surveys.responses);

  const generateAnalytics = useCallback((survey: Survey, response: SurveyResponse): AnalyticsResult => {
    const questions = survey.pages?.flatMap(page => page.elements) || [];
    const answers = Object.keys(response.responses || {});
    
    const completionRate = (answers.length / questions.length) * 100;

    const responseTypes: ResponseTypes = {
      multipleChoice: 0,
      text: 0,
      scale: 0,
      boolean: 0,
      matrix: 0
    };

    const categories: Record<string, number> = {};

    questions.forEach((question: FrontendSurveyQuestion) => {
      if (question.type in responseTypes) {
        responseTypes[question.type]++;
      }
      
      if (question.category) {
        categories[question.category] = (categories[question.category] || 0) + 1;
      }
    });

    const insights = [
      `Survey completion rate: ${completionRate.toFixed(1)}%`,
      `Most common question type: ${Object.entries(responseTypes)
        .sort(([,a], [,b]) => b - a)[0][0]}`,
      Object.keys(categories).length > 0 
        ? `Primary focus area: ${Object.entries(categories)
            .sort(([,a], [,b]) => b - a)[0][0]}`
        : ''
    ].filter(Boolean);

    return {
      completionRate,
      charts: {
        responseTypes: {
          labels: Object.keys(responseTypes),
          data: Object.values(responseTypes),
          title: 'Question Types Distribution'
        },
        categoryDistribution: {
          labels: Object.keys(categories),
          data: Object.values(categories),
          title: 'Category Distribution'
        }
      },
      insights
    };
  }, []);

  return {
    generateAnalytics
  };
};