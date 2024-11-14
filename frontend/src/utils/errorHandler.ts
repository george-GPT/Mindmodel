import type { components } from '../types/api.d';
import { ApiError, createApiError, ErrorCodes } from '../types/error';

// Use the BaseResponse type from our OpenAPI schema with error specifics
type ErrorResponseData = components['schemas']['BaseResponse'] & {
  success: false;
  error: {
    code: keyof typeof ErrorCodes;
    details?: Record<string, unknown>;
  };
};

export function handleError(error: unknown, context: string = 'API'): ApiError {
  // If it's already an ApiError, return it
  if (error && typeof error === 'object' && 'error' in error && 'success' in error) {
    const apiError = error as ApiError;
    return apiError;
  }

  // Handle axios error response containing our API error format
  if (error && typeof error === 'object' && 'response' in error && 'data' in (error as any).response) {
    const responseData = (error as any).response.data as ErrorResponseData;
    return createApiError({
      code: responseData?.error?.code || ErrorCodes['server_error'],
      message: responseData?.message || 'An unknown error occurred',
      details: responseData?.error?.details,
      context
    });
  }

  // Default error when we can't determine the type
  return createApiError({
    code: ErrorCodes['server_error'],
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    context
  });
}
