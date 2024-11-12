// src/Store/surveySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SurveyResponse {
  surveyId: string;
  responses: any; // Define a more specific type based on survey structure
}

interface SurveysState {
  responses: SurveyResponse[];
}

const initialState: SurveysState = {
  responses: [],
};

const surveySlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    submitSurveyResponse(state, action: PayloadAction<SurveyResponse>) {
      state.responses.push(action.payload);
    },
    resetSurveys(state) {
      state.responses = [];
    },
  },
});

export const { submitSurveyResponse, resetSurveys } = surveySlice.actions;
export default surveySlice.reducer;