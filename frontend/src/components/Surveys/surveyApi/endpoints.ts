import type { AxiosResponse } from 'axios';
import { axiosInstance } from '../../../services/api/axiosInstance';
import { API_PATHS } from '../../../services/api/apiPaths';
import type { components } from '../../../types/api';

type Survey = components['schemas']['Survey'];
type SurveyResponse = components['schemas']['SurveyResponse'];
type SuccessResponse<T> = components['schemas']['SuccessResponse'] & {
    data: T;
};

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

// ... rest of your code ... 