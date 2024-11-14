import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSessionData {
  // Add specific user session data fields based on your needs
  lastActive?: number;
  // Add other fields as needed
}

interface SessionState {
  sessionId: string | null;
  userSessionData: UserSessionData | null;
  isActive: boolean;
}

const initialState: SessionState = {
  sessionId: null,
  userSessionData: null,
  isActive: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{ sessionId: string; data: UserSessionData }>
    ) => {
      state.sessionId = action.payload.sessionId;
      state.userSessionData = action.payload.data;
      state.isActive = true;
    },
    endSession: (state) => {
      state.sessionId = null;
      state.userSessionData = null;
      state.isActive = false;
    },
    updateSessionData: (state, action: PayloadAction<UserSessionData>) => {
      state.userSessionData = action.payload;
    },
    resetSession: (state) => {
      state.sessionId = null;
      state.userSessionData = null;
      state.isActive = false;
    },
  },
});

export const { startSession, endSession, updateSessionData, resetSession } =
  sessionSlice.actions;

export default sessionSlice.reducer; 