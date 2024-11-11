import axios from 'axios';
import TokenService from '../tokens/tokenService';
import { TokenResponse } from '../../types/api-types';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = TokenService.getRefreshToken();

            if (refreshToken) {
                try {
                    const response = await axios.post<TokenResponse>('/api/users/auth/refresh/', {
                        refresh: refreshToken
                    });
                    
                    TokenService.setTokens({
                        access: response.data.access,
                        refresh: response.data.refresh
                    });

                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    TokenService.clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api; 