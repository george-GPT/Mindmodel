import type { LoginCredentials, TokenResponse, GoogleAuthRequest } from '@/types/auth';
import type { components } from '@/types/api';
import type { AxiosResponse } from 'axios';
import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

export const authAPI = {
    login: (credentials: LoginCredentials): Promise<AxiosResponse<TokenResponse>> => 
        axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials),

    register: (data: {
        email: string;
        username: string;
        password: string;
    }) => 
        axiosInstance.post(API_PATHS.AUTH.REGISTER, data),

    logout: () => 
        axiosInstance.post(API_PATHS.AUTH.LOGOUT),

    googleAuth: (data: GoogleAuthRequest): Promise<AxiosResponse<TokenResponse>> => 
        axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, data),

    verifyEmail: (token: string) => 
        axiosInstance.post(API_PATHS.AUTH.VERIFY_EMAIL, { token }),

    resendVerification: (email: string) =>
        axiosInstance.post(API_PATHS.AUTH.RESEND_VERIFICATION, { email }),

    changePassword: (data: {
        old_password: string;
        new_password: string;
    }) => 
        axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, data),

    changeEmail: (data: {
        new_email: string;
        password: string;
    }) => 
        axiosInstance.post(API_PATHS.AUTH.CHANGE_EMAIL, data),

    getProfile: () => 
        axiosInstance.get(API_PATHS.AUTH.PROFILE),

    updateProfile: (data: components['schemas']['UserProfileRequest']) => 
        axiosInstance.patch(API_PATHS.AUTH.PROFILE, data),

    refreshToken: (refreshToken: string): Promise<AxiosResponse<TokenResponse>> =>
        axiosInstance.post(API_PATHS.AUTH.REFRESH, { refresh: refreshToken }),
};

export type { TokenResponse }; 