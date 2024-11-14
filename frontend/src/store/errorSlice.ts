import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ApiError } from '@/types/error';

interface FieldError {
  field: string;
  message: string;
}

interface ErrorState {
  globalError: ApiError | null;
  fieldErrors: Record<string, FieldError>;
  lastError: {
    timestamp: number;
    error: ApiError | null;
  } | null;
}

const initialState: ErrorState = {
  globalError: null,
  fieldErrors: {},
  lastError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<ApiError | null>) => {
      state.globalError = action.payload;
      if (action.payload) {
        state.lastError = {
          timestamp: Date.now(),
          error: action.payload
        };
      }
    },
    setFieldError: (state, action: PayloadAction<FieldError>) => {
      state.fieldErrors[action.payload.field] = action.payload;
    },
    clearFieldError: (state, action: PayloadAction<string>) => {
      delete state.fieldErrors[action.payload];
    },
    clearAllFieldErrors: (state) => {
      state.fieldErrors = {};
    },
    clearAllErrors: (state) => {
      state.globalError = null;
      state.fieldErrors = {};
    },
    clearLastError: (state) => {
      state.lastError = null;
    }
  },
});

export const {
  setGlobalError,
  setFieldError,
  clearFieldError,
  clearAllFieldErrors,
  clearAllErrors,
  clearLastError
} = errorSlice.actions;

export default errorSlice.reducer; 