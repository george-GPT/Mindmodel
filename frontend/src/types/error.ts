import type { components } from './api';

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
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded' as const
} as const;

// Extract type from const values
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Base API error type from backend schema
export interface ApiError {
    success: false;
    message: string;
    error: {
        code: ErrorCode;
        details?: Record<string, unknown>;
    };
}

// Type guard implementation
export const isApiError = (error: unknown): error is ApiError => {
    if (!error || typeof error !== 'object') {
        return false;
    }
    
    const candidate = error as { success?: boolean; message?: string; error?: { code?: string } };
    
    return (
        candidate.success === false &&
        typeof candidate.message === 'string' &&
        !!candidate.error &&
        typeof candidate.error === 'object' &&
        typeof candidate.error.code === 'string' &&
        Object.values(ErrorCodes).includes(candidate.error.code as ErrorCode)
    );
}; 