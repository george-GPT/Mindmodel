import type { components } from './api.d';

type BaseErrorResponse = components['schemas']['BaseResponse'] & {
  success: false;
};

/**
 * @description Error codes from OpenAPI schema
 * @see backend/mindmodel/core/schema.yaml
 */
export const ErrorCodes = {
    'invalid_credentials': 'invalid_credentials',
    'token_invalid': 'token_invalid',
    'token_expired': 'token_expired',
    'validation_error': 'validation_error',
    'email_not_verified': 'email_not_verified',
    'not_authenticated': 'not_authenticated',
    'permission_denied': 'permission_denied',
    'server_error': 'server_error'
} as const;

// Update type to match usage
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * @description API error interface matching backend schema
 */
export interface ApiError extends BaseErrorResponse {
    message: string;
    error: {
        code: ErrorCode;
        details?: Record<string, unknown>;
        context?: string;
    };
}

export const isApiError = (error: unknown): error is ApiError => {
    if (!error || typeof error !== 'object') return false;
    
    const candidate = error as Partial<ApiError>;
    
    return (
        candidate.success === false &&
        typeof candidate.message === 'string' &&
        candidate.error?.code !== undefined &&
        Object.values(ErrorCodes).includes(candidate.error.code as ErrorCode)
    );
};

export const createApiError = (params: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    context?: string;
}): ApiError => {
    return {
        success: false,
        message: params.message,
        error: {
            code: params.code,
            details: params.details,
            context: params.context
        }
    };
}; 