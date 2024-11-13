import axios from 'axios';
import TokenService from './token-service';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = TokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await TokenService.refreshAccessToken();
                if (refreshResponse.data?.access) {
                    originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Handle refresh token failure
                TokenService.clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 