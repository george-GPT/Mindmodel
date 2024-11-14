// src/Store/surveySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SurveysState, SurveyResponse, SurveyAnalytics } from '@/types/survey';

const initialState: SurveysState = {
  responses: [],
  analytics: null,
  loading: false,
  error: null
};

export const surveySlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    setAnalytics: (state, action: PayloadAction<SurveyAnalytics | null>) => {
      state.analytics = action.payload;
    },
    submitSurveyResponse(state, action: PayloadAction<SurveyResponse>) {
      state.responses.push(action.payload);
    },
    resetSurveys(state) {
      state.responses = [];
    },
  },
});

export const { setAnalytics, submitSurveyResponse, resetSurveys } = surveySlice.actions;
export default surveySlice.reducer;