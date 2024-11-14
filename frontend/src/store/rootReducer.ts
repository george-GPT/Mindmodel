import { combineReducers } from '@reduxjs/toolkit';
import type { PersistPartial } from 'redux-persist/es/persistReducer';

// Import slices from store directory
import authReducer from '@store/authSlice';
import gamesReducer from '@store/gameSlice';
import surveysReducer from '@store/surveySlice';
import progressReducer from '@store/progressSlice';
import analysisReducer from '@store/analysisSlice';
import errorReducer from '@store/errorSlice';
import sessionReducer from '@store/sessionSlice';

// Define root state type that includes PersistPartial
export interface RootState extends PersistPartial {
    auth: ReturnType<typeof authReducer>;
    games: ReturnType<typeof gamesReducer>;
    surveys: ReturnType<typeof surveysReducer>;
    progress: ReturnType<typeof progressReducer>;
    analysis: ReturnType<typeof analysisReducer>;
    error: ReturnType<typeof errorReducer>;
    session: ReturnType<typeof sessionReducer>;
}

const rootReducer = combineReducers({
    auth: authReducer,
    games: gamesReducer,
    surveys: surveysReducer,
    progress: progressReducer,
    analysis: analysisReducer,
    error: errorReducer,
    session: sessionReducer
});

export default rootReducer; 