// src/types/survey.d.ts

export interface SurveyQuestion {
    type: string;
    name: string;
    title: string;
    [key: string]: any; // Allows additional properties like choices, etc.
  }
  
  export interface SurveyPage {
    name: string;
    elements: SurveyQuestion[];
  }
  
  export interface SurveyJSON {
    title: string;
    pages: SurveyPage[];
    [key: string]: any; // For any additional SurveyJS properties
  }
  