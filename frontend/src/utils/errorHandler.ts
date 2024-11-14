import { AppDispatch } from '../store/store';
import { setError } from '../store/authSlice';
import { ApiError, ErrorCodes } from 'types/error';

export const handleAuthError = (error: unknown, dispatch: AppDispatch): ApiError => {
    let apiError: ApiError;

    if (!error || !(error instanceof Error)) {
        apiError = {
            success: false,
            message: 'An unknown error occurred',
            error: {
                code: ErrorCodes.SERVER_ERROR,
                details: { originalError: error }
            }
        };
    } else if (!('response' in error)) {
        apiError = {
            success: false,
            message: 'Network error. Please check your connection.',
            error: {
                code: ErrorCodes.NETWORK_ERROR,
                details: { originalError: error }
            }
        };
    } else {
        const { status, data } = (error as any).response;

        switch (status) {
            case 400:
                apiError = {
                    success: false,
                    message: 'Invalid input data',
                    error: {
                        code: ErrorCodes.VALIDATION_ERROR,
                        details: { fieldErrors: data.errors }
                    }
                };
                break;
            case 401:
                apiError = {
                    success: false,
                    message: 'Authentication required. Please log in.',
                    error: {
                        code: ErrorCodes.AUTHENTICATION_ERROR
                    }
                };
                break;
            case 403:
                apiError = {
                    success: false,
                    message: 'You do not have permission to perform this action.',
                    error: {
                        code: ErrorCodes.PERMISSION_DENIED
                    }
                };
                break;
            case 404:
                apiError = {
                    success: false,
                    message: 'The requested resource was not found.',
                    error: {
                        code: ErrorCodes.NOT_FOUND
                    }
                };
                break;
            default:
                apiError = {
                    success: false,
                    message: 'An unexpected error occurred.',
                    error: {
                        code: ErrorCodes.SERVER_ERROR,
                        details: { status, data }
                    }
                };
        }
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', apiError);
    }

    dispatch(setError(apiError.message));
    return apiError;
};

export const handleError = handleAuthError;