import { operations } from './api';

// Base API error type from backend schema
export type APIError = operations['api_users_auth_auth_login_create']['responses'][400]['content']['application/json'];

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
    DUPLICATE_EMAIL: 'duplicate_email'
} as const;

export type ErrorCode = keyof typeof ErrorCodes;