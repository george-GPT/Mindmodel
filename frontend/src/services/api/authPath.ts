import type { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { API_PATHS } from './apiPaths';
import type { components } from '../../types/api';
import type { TokenResponse } from '../../types/auth';

export const authAPI = {
    login: (credentials: components['schemas']['EmailTokenObtainPairRequest']): Promise<AxiosResponse<TokenResponse>> => 
        axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials),

    register: (data: {
        email: string;
        username: string;
        password: string;
    }) => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.REGISTER, 
            data
        ),

    logout: () => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.LOGOUT
        ),

    googleAuth: (token: string): Promise<AxiosResponse<TokenResponse>> => 
        axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, { token }),

    verifyEmail: (token: string) => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.VERIFY_EMAIL, 
            { token }
        ),

    resendVerification: (email: string) =>
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.RESEND_VERIFICATION, 
            { email }
        ),

    changePassword: (data: {
        old_password: string;
        new_password: string;
    }) => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.CHANGE_PASSWORD, 
            data
        ),

    changeEmail: (data: {
        new_email: string;
        password: string;
    }) => 
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.AUTH.CHANGE_EMAIL, 
            data
        ),

    getProfile: () => 
        axiosInstance.get<components['schemas']['SuccessResponse'] & {
            data: components['schemas']['UserProfile']
        }>(API_PATHS.AUTH.PROFILE),

    updateProfile: (data: components['schemas']['UserProfileRequest']) => 
        axiosInstance.patch<components['schemas']['SuccessResponse'] & {
            data: components['schemas']['UserProfile']
        }>(API_PATHS.AUTH.PROFILE, data),

    refresh: (refreshToken: string): Promise<AxiosResponse<TokenResponse>> =>
        axiosInstance.post('/api/users/auth/refresh/', { refresh: refreshToken }),
} as const;