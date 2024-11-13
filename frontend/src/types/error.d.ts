import { operations } from './api';

// Base API error type from backend schema
export interface APIError {
  success: false;
  message: string;
  error: {
    code: typeof ErrorCodes[keyof typeof ErrorCodes];
    details?: Record<string, unknown>;
  };
}

// Error codes matching backend schema exactly
export const ErrorCodes = {
    // Auth errors
    AUTHENTICATION_ERROR: 'authentication_error',
    TOKEN_INVALID: 'token_invalid',
    
    // Validation errors
    VALIDATION_ERROR: 'validation_error',
    EMAIL_NOT_VERIFIED: 'email_not_verified',
    
    // Permission errors
    PERMISSION_DENIED: 'permission_denied',
    
    // Resource errors
    NOT_FOUND: 'not_found',
    
    // Server errors
    SERVER_ERROR: 'server_error',
    
    // Rate limiting
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
    
    // User management
    PASSWORD_HISTORY: 'password_history',
    DUPLICATE_EMAIL: 'duplicate_email',
    
    // Frontend errors
    NETWORK_ERROR: 'network_error',
    FORM_VALIDATION: 'form_validation',
    GAME_ERROR: 'game_error'
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

// Frontend error types
export type NetworkError = {
    code: typeof ErrorCodes.NETWORK_ERROR;
    message: string;
};

export type ValidationError = {
    code: typeof ErrorCodes.FORM_VALIDATION;
    fields: Record<string, string[]>;
};

export type GameError = {
    code: typeof ErrorCodes.GAME_ERROR;
    gameId: string | number;
    details?: unknown;
};

// Combined error type
export type FrontendError = APIError | NetworkError | ValidationError | GameError;

// Type guards
export const isAPIError = (error: unknown): error is APIError => 
    !!(error as APIError)?.error?.code;

export const isNetworkError = (error: unknown): error is NetworkError => 
    (error as NetworkError)?.code === ErrorCodes.NETWORK_ERROR;

export const isValidationError = (error: unknown): error is ValidationError => 
    (error as ValidationError)?.code === ErrorCodes.FORM_VALIDATION;

export const isGameError = (error: unknown): error is GameError => 
    (error as GameError)?.code === ErrorCodes.GAME_ERROR;