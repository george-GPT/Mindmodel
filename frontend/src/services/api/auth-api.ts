import type { AxiosResponse } from 'axios';
import type { 
    LoginCredentials, 
    TokenResponse,
    User
} from '../../types/auth';
import axiosInstance from './axios-instance';

class AuthAPI {
    async login(credentials: LoginCredentials): Promise<AxiosResponse<TokenResponse>> {
        return axiosInstance.post<TokenResponse>('/users/auth/login', credentials);
    }

    async googleAuth(token: string): Promise<AxiosResponse<TokenResponse>> {
        return axiosInstance.post<TokenResponse>('/users/auth/google', { token });
    }

    async refresh(refreshToken: string): Promise<AxiosResponse<TokenResponse>> {
        return axiosInstance.post<TokenResponse>('/users/auth/refresh', {
            refresh: refreshToken
        });
    }

    async logout(): Promise<AxiosResponse<{ success: boolean; message?: string }>> {
        return axiosInstance.post('/users/auth/logout');
    }

    async getProfile(): Promise<AxiosResponse<{ data: User }>> {
        return axiosInstance.get('/users/auth/me');
    }
}

export const authAPI = new AuthAPI(); 