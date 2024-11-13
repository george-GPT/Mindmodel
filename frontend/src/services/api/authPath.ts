import axios from 'axios';
import type { operations, components } from 'types/api';
import type { AuthProvider } from 'types/auth';

export const API_PATHS = {
    LOGIN: '/api/users/auth/login/',
    REGISTER: '/api/users/auth/register/',
    LOGOUT: '/api/users/auth/logout/',
    GOOGLE_AUTH: '/api/users/auth/google/',
    VERIFY_EMAIL: '/api/users/auth/verify-email/',
    RESEND_VERIFICATION: '/api/users/auth/resend-verification/',
    CHANGE_PASSWORD: '/api/users/auth/change-password/',
    CHANGE_EMAIL: '/api/users/auth/change-email/',
    PROFILE: '/api/users/auth/profile/',
} as const;

// Type-safe API client
export const authAPI = {
    login: (credentials: components['schemas']['EmailTokenObtainPairRequest']) => 
        axios.post<components['schemas']['AuthResponse']>(
            API_PATHS.LOGIN, 
            credentials
        ),

    register: (data: {
        email: string;
        username: string;
        password: string;
    }) => 
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.REGISTER, 
            data
        ),

    logout: () => 
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.LOGOUT
        ),

    googleAuth: (token: string) => 
        axios.post<components['schemas']['AuthResponse']>(
            API_PATHS.GOOGLE_AUTH, 
            { token }
        ),

    verifyEmail: (token: string) => 
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.VERIFY_EMAIL, 
            { token }
        ),

    resendVerification: (email: string) =>
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.RESEND_VERIFICATION, 
            { email }
        ),

    changePassword: (data: {
        old_password: string;
        new_password: string;
    }) => 
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.CHANGE_PASSWORD, 
            data
        ),

    changeEmail: (data: {
        new_email: string;
        password: string;
    }) => 
        axios.post<components['schemas']['SuccessResponse']>(
            API_PATHS.CHANGE_EMAIL, 
            data
        ),

    getProfile: () => 
        axios.get<components['schemas']['SuccessResponse'] & {
            data: components['schemas']['UserProfile']
        }>(API_PATHS.PROFILE),

    updateProfile: (data: components['schemas']['UserProfileRequest']) => 
        axios.patch<components['schemas']['SuccessResponse'] & {
            data: components['schemas']['UserProfile']
        }>(API_PATHS.PROFILE, data),
} as const;