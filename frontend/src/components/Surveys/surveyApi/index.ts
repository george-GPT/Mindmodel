import type { AxiosResponse } from 'axios';
import { axiosInstance } from '../../../services/api/axiosInstance';
import { API_PATHS } from '../../../services/api/apiPaths';
import type { 
  Survey, 
  SurveyJSON, 
  SurveyResponse, 
  SurveyAnalytics,
  SurveyPage,
  FrontendSurveyQuestion,
  ChartData 
} from './survey.d';

// Re-export all types
export type {
  Survey,
  SurveyJSON,
  SurveyResponse,
  SurveyAnalytics,
  SurveyPage,
  FrontendSurveyQuestion,
  ChartData
};

type SuccessResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

// Define and export the API methods
export const surveyAPI = {
  getSurveys: (): Promise<AxiosResponse<SuccessResponse<Survey[]>>> => 
    axiosInstance.get(API_PATHS.SURVEYS.BASE),

  getSurveyDetails: (id: number): Promise<AxiosResponse<SuccessResponse<Survey>>> => 
    axiosInstance.get(API_PATHS.SURVEYS.DETAIL(id)),

  submitSurveyResponse: (responseData: SurveyResponse): Promise<AxiosResponse<SuccessResponse<SurveyResponse>>> => 
    axiosInstance.post(API_PATHS.SURVEYS.RESPONSES, responseData),

  getSurveyResponse: (id: number): Promise<AxiosResponse<SuccessResponse<SurveyResponse>>> => 
    axiosInstance.get(API_PATHS.SURVEYS.DETAIL(id))
};

// Helper functions
export const isSurveyCompleted = (response: SurveyResponse): boolean => {
  return response.completed && response.completion_rate === 100;
};

export const getSurveyType = (survey: Survey): string | undefined => {
  return survey.metadata?.type;
};

export default surveyAPI;