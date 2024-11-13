// src/Store/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, LoadingStateType } from '../types/auth';
import type { ApiError } from '../types/error';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isMember: boolean;
  isAdmin: boolean;
  error: ApiError | null;
  loading: Record<LoadingStateType, boolean>;
}

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
};

interface LoginPayload {
    user: User;
    isMember: boolean;
    isAdmin?: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isMember = action.payload.isMember;
      state.isAdmin = action.payload.isAdmin || false;
      state.error = null;
    },
    logout: (state) => {
      return initialState;
    },
    setLoading: (state, action: PayloadAction<{ 
      type: LoadingStateType; 
      isLoading: boolean 
    }>) => {
      state.loading[action.payload.type] = action.payload.isLoading;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.error = {
          success: false,
          message: action.payload,
          error: {
            code: 'validation_error',
            details: {}
          }
        };
      } else {
        state.error = null;
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
