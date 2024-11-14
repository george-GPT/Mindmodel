// src/store/analysisSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalysisState {
  processingStatus: 'idle' | 'loading' | 'completed' | 'error';
  results: any; // Define this type based on your actual results structure
  error: string | null;
}

const initialState: AnalysisState = {
  processingStatus: 'idle',
  results: null,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    startProcessing: (state) => {
      state.processingStatus = 'loading';
      state.error = null;
    },
    processingSuccess: (state, action: PayloadAction<any>) => {
      state.processingStatus = 'completed';
      state.results = action.payload;
    },
    processingFailure: (state, action: PayloadAction<string>) => {
      state.processingStatus = 'error';
      state.error = action.payload;
    },
    resetAnalysis: (state) => {
      state.processingStatus = 'idle';
      state.results = null;
      state.error = null;
    },
  },
});

export const {
  startProcessing,
  processingSuccess,
  processingFailure,
  resetAnalysis,
} = analysisSlice.actions;

export default analysisSlice.reducer;
