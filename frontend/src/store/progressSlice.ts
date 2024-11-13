// src/Store/progressSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressState {
  completedSurveys: string[];
  completedGames: string[];
}

const initialState: ProgressState = {
  completedSurveys: [],
  completedGames: [],
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    completeSurvey(state, action: PayloadAction<string>) {
      if (!state.completedSurveys.includes(action.payload)) {
        state.completedSurveys.push(action.payload);
      }
    },
    completeGame(state, action: PayloadAction<string>) {
      if (!state.completedGames.includes(action.payload)) {
        state.completedGames.push(action.payload);
      }
    },
    resetProgress(state) {
      state.completedSurveys = [];
      state.completedGames = [];
    },
  },
});

export const { completeSurvey, completeGame, resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
