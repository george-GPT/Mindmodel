// src/Store/gameSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameScore } from '../types/game.d';

interface GamesState {
  scores: GameScore[];
}

const initialState: GamesState = {
  scores: [],
};

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    submitGameScore(state, action: PayloadAction<GameScore>) {
      state.scores.push(action.payload);
    },
    resetGames(state) {
      state.scores = [];
    },
  },
});

export const { submitGameScore, resetGames } = gameSlice.actions;
export default gameSlice.reducer;
