// src/Store/Store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import gameReducer from './game-slice';
import surveyReducer from './survey-slice';
import progressReducer from './progress-slice';
import analysisReducer from './analysis-slice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  auth: authReducer,
  games: gameReducer,
  surveys: surveyReducer,
  progress: progressReducer,
  analysis: analysisReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'games', 'surveys', 'progress', 'analysis'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
