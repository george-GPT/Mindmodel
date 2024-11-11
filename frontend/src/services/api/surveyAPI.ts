import axios from './axios';
import { API_PATHS } from '../../constants/api-path-two';
import { SurveyResponse, Survey } from '../../types/survey-types';

type TokenResponse = {
  access: string;
  refresh?: string;
} | null;

export const surveyAPI = {
    getSurveys: () => 
        axios.get<Survey[]>(API_PATHS.SURVEYS.BASE),

    getSurveyDetails: (id: number) => 
        axios.get<Survey>(API_PATHS.SURVEYS.DETAIL(id)),

    submitSurveyResponse: (responseData: SurveyResponse) => 
        axios.post(API_PATHS.SURVEYS.RESPONSES, responseData),

    getSurveyResponse: (id: number) => 
        axios.get<SurveyResponse>(API_PATHS.SURVEYS.DETAIL(id))
};

// ... rest of your code ... 