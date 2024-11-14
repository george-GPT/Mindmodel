import type { AxiosResponse } from 'axios';
import type { components } from '@/types/api';
import { createApiError, ApiError, ErrorCodes } from '@/types/error';

/**
 * @description Base service class providing common functionality for all services
 */
export abstract class BaseService {
    /**
     * Validates and extracts data from API response
     */
    protected validateResponse<T>(response: AxiosResponse<components['schemas']['SuccessResponse']>): T {
        if (!response?.data?.success || !response?.data?.data) {
            throw createApiError('Invalid response format');
        }
        return response.data.data as T;
    }

    /**
     * Creates a rate limit error
     */
    protected createRateLimitError(): ApiError {
        return {
            success: false,
            message: 'Rate limit exceeded',
            error: {
                code: ErrorCodes.RATE_LIMIT_EXCEEDED
            }
        };
    }

    /**
     * Creates a validation error
     */
    protected createValidationError(message: string, details?: Record<string, unknown>): ApiError {
        return {
            success: false,
            message,
            error: {
                code: ErrorCodes.VALIDATION_ERROR,
                details
            }
        };
    }

    /**
     * Handles token-related operations
     */
    protected async handleTokens<T extends { data: { access?: string; refresh?: string } }>(
        response: T
    ): Promise<void> {
        this.validateRequiredData(response.data, 'Invalid token data');
        this.validateRequiredData(response.data.access, 'Missing access token');
        this.validateRequiredData(response.data.refresh, 'Missing refresh token');
    }

    /**
     * Standardized error handler for service methods
     */
    protected handleError(error: unknown, message: string): never {
        throw createApiError(error, message);
    }

    /**
     * Type guard for checking successful responses
     */
    protected isSuccessResponse<T>(response: unknown): response is { 
        success: true; 
        data: T 
    } {
        const candidate = response as { success?: boolean; data?: T };
        return candidate?.success === true && !!candidate?.data;
    }

    /**
     * Validates required data in response
     */
    protected validateRequiredData<T>(data: T | null | undefined, message: string): asserts data is T {
        if (!data) {
            throw this.createValidationError(message);
        }
    }
} 