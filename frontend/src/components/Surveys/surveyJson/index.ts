import AttentionSurvey from './attention-survey.json';
import BaselineSurvey from './baseline-survey.json';
import ExecutiveFunctionSurvey from './executive-function-survey.json';
import MemorySurvey from './memory-survey.json';
import PersonalitySurvey from './personality-survey.json';
import ProcessingSurvey from './processing-survey.json';

export type SurveyType = 
  | 'AttentionSurvey'
  | 'BaselineSurvey'
  | 'ExecutiveFunctionSurvey'
  | 'MemorySurvey'
  | 'PersonalitySurvey'
  | 'ProcessingSurvey';

export const surveys = {
  AttentionSurvey,
  BaselineSurvey,
  ExecutiveFunctionSurvey,
  MemorySurvey,
  PersonalitySurvey,
  ProcessingSurvey,
} as const;

// Helper function to get survey by ID
export const getSurveyById = (surveyId: SurveyType) => {
  return surveys[surveyId] || null;
};

export default surveys;