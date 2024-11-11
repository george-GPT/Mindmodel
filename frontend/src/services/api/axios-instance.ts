import axios from 'axios';
import TokenService from './token-service';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = TokenService.getAccessToken();
    
    if (accessToken && config.headers) {
      if (TokenService.isTokenExpired(accessToken)) {
        try {
          const { access } = await TokenService.refreshAccessToken();
          config.headers.Authorization = `Bearer ${access}`;
        } catch (error) {
          TokenService.clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { access } = await TokenService.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        TokenService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 