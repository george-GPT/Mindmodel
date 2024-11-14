import axios from 'axios';
import { tokenService } from '../security/tokenService';
import { handleError } from '../../utils/errorHandler';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(handleError(error))
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleError(error))
);

export { axiosInstance }; 