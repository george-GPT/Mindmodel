// src/Store/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, LoadingStateType, AuthErrorResponse } from '../types/auth-types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isMember: boolean;
  isAdmin: boolean;
  error: AuthErrorResponse | null;
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
    passwordReset: false,
    verification: false,
    social: false
  },
};

// First, define the login payload type
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
    setError: (state, action: PayloadAction<AuthErrorResponse | null>) => {
      state.error = action.payload;
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
