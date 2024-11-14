import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoadingStateType, UserProfile } from '@/types/auth';
import type { ApiError } from '@/types/error';
import { ErrorCodes } from '@/types/error';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isMember: false,
  isAdmin: false,
  error: null,
  loading: {
    login: false,
    register: false,
    passwordChange: false,
    emailChange: false,
    twoFactor: false,
    auth: false,
    profile: false,
    verification: false,
    social: false
  },
  session: {
    expiresAt: 0,
    refreshExpiresAt: 0,
    lastActivity: 0
  },
  verification: {
    isVerified: false,
    verificationSent: false,
    verificationExpiry: 0
  }
};

interface LoginPayload {
    user: UserProfile;
    isMember: boolean;
    isAdmin?: boolean;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isMember = action.payload.isMember;
      state.isAdmin = action.payload.isAdmin ?? false;
      state.error = null;
    },
    logout: () => initialState,
    setLoading: (state, action: PayloadAction<{ 
      type: LoadingStateType; 
      isLoading: boolean 
    }>) => {
      state.loading[action.payload.type] = action.payload.isLoading;
    },
    setError: (state, action: PayloadAction<ApiError | string | null>) => {
      if (action.payload === null) {
        state.error = null;
      } else if (typeof action.payload === 'string') {
        state.error = {
          success: false,
          message: action.payload,
          error: {
            code: ErrorCodes.validation_error
          }
        };
      } else {
        state.error = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { 
  login, 
  logout, 
  setLoading, 
  setError, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;