import type { ErrorCodes } from './error';

// Extract type from const values
export type ErrorCodes = typeof ErrorCodes[keyof typeof ErrorCodes];

// Base API error type from backend schema
export interface ApiError {
    success: false;
    message: string;
    error: {
        code: ErrorCodes;
        details?: Record<string, unknown>;
    };
}