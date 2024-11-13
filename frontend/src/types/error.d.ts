import { operations } from './api';

// Base API error type from backend schema
export interface ApiError {
  success: false;
  message: string;
  error: {
    code: ErrorCode;
    details?: Record<string, unknown>;
  };
}

// Error codes matching backend schema
export const ErrorCodes = {
    // Auth errors
    AUTHENTICATION_ERROR: 'authentication_error' as const,
    TOKEN_INVALID: 'token_invalid' as const,
    TOKEN_EXPIRED: 'token_expired' as const,
    
    // Validation errors
    VALIDATION_ERROR: 'validation_error' as const,
    EMAIL_NOT_VERIFIED: 'email_not_verified' as const,
    
    // Permission errors
    PERMISSION_DENIED: 'permission_denied' as const,
    NOT_AUTHENTICATED: 'not_authenticated' as const,
    
    // Resource errors
    NOT_FOUND: 'not_found' as const,
    
    // Server errors
    SERVER_ERROR: 'server_error' as const,
    
    // Rate limiting
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded' as const,
    
    // Frontend errors
    NETWORK_ERROR: 'network_error' as const,
    FORM_VALIDATION: 'form_validation' as const,
    GAME_ERROR: 'game_error' as const
} as const;

// Extract type from const values
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

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
export type FrontendError = ApiError | NetworkError | ValidationError | GameError;

// Type guards
export const isAPIError = (error: unknown): error is ApiError => 
    !!(error as ApiError)?.error?.code;

export const isNetworkError = (error: unknown): error is NetworkError => 
    (error as NetworkError)?.code === ErrorCodes.NETWORK_ERROR;

export const isValidationError = (error: unknown): error is ValidationError => 
    (error as ValidationError)?.code === ErrorCodes.FORM_VALIDATION;

export const isGameError = (error: unknown): error is GameError => 
    (error as GameError)?.code === ErrorCodes.GAME_ERROR;