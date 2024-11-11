import { AppDispatch } from '../store/store';
import { setError } from '../store/auth-slice';
import { StandardError, ValidationError, ErrorCodes } from '../types/error-types';
import { AuthErrorResponse, AuthErrorCode } from '../types/auth-types';

export const createStandardError = (
  code: keyof typeof ErrorCodes,
  message: string,
  status: number,
  details?: Record<string, any>
): StandardError => ({
  code: ErrorCodes[code],
  message,
  status,
  details,
  timestamp: new Date().toISOString()
});

export const handleAuthError = (error: any, dispatch: AppDispatch) => {
  let standardError: StandardError;
  let authError: AuthErrorResponse;

  if (!error.response) {
    standardError = createStandardError(
      'NETWORK_ERROR',
      'Network error. Please check your connection.',
      0
    );
    authError = {
      message: standardError.message,
      code: AuthErrorCode.NETWORK_ERROR
    };
  } else {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        standardError = createStandardError(
          'VALIDATION_ERROR',
          'Invalid input data',
          status,
          { fieldErrors: data.errors }
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.VALIDATION_ERROR,
          field: data.errors ? Object.keys(data.errors)[0] : undefined
        };
        break;
      case 401:
        standardError = createStandardError(
          'UNAUTHORIZED',
          'Authentication required. Please log in.',
          status
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.INVALID_CREDENTIALS
        };
        break;
      case 403:
        standardError = createStandardError(
          'UNAUTHORIZED',
          'You do not have permission to perform this action.',
          status
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.PERMISSION_DENIED
        };
        break;
      case 404:
        standardError = createStandardError(
          'NOT_FOUND',
          'The requested resource was not found.',
          status
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.NOT_FOUND
        };
        break;
      case 500:
        standardError = createStandardError(
          'SERVER_ERROR',
          'An unexpected server error occurred.',
          status
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.SERVER_ERROR
        };
        break;
      default:
        standardError = createStandardError(
          'SERVER_ERROR',
          'An unexpected error occurred.',
          status
        );
        authError = {
          message: standardError.message,
          code: AuthErrorCode.SERVER_ERROR
        };
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', standardError);
  }

  dispatch(setError(authError));
  return standardError;
};

export const handleError = handleAuthError;