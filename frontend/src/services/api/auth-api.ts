import axios from './axios';
import { 
    AuthResponse, 
    LoginCredentials, 
    RegisterData, 
    TokenResponse, 
    UserProfile, 
    PasswordChangeData, 
    EmailChangeData 
} from '../../types/auth-types';

// Define all API endpoints in one place
const AUTH_ENDPOINTS = {
    LOGIN: '/api/users/auth/login/',
    REGISTER: '/api/users/member/register/',
    LOGOUT: '/api/users/auth/logout/',
    REFRESH_TOKEN: '/api/users/auth/token/refresh/',
    VERIFY_TOKEN: '/api/users/auth/token/verify/',
    PROFILE: '/api/users/member/me/',
    SOCIAL_AUTH: '/api/users/auth/social-auth/',
    CHANGE_PASSWORD: '/api/users/member/change-password/',
    CHANGE_EMAIL: '/api/users/member/change-email/',
    TWO_FACTOR: {
        ENABLE: '/api/users/auth/2fa/enable/',
        DISABLE: '/api/users/auth/2fa/disable/',
    }
};

export const authAPI = {
    login: (credentials: LoginCredentials) => 
        axios.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials),
    
    register: (userData: RegisterData) => 
        axios.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData),
    
    logout: () => 
        axios.post(AUTH_ENDPOINTS.LOGOUT),
    
    socialAuth: (provider: 'google' | 'apple', accessToken: string) => 
        axios.post<AuthResponse>(AUTH_ENDPOINTS.SOCIAL_AUTH, {
            provider,
            access_token: accessToken
        }),
    
    refreshToken: (refreshToken: string) => 
        axios.post<TokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, { refresh: refreshToken }),
    
    verifyToken: (token: string) =>
        axios.post(AUTH_ENDPOINTS.VERIFY_TOKEN, { token }),
    
    getProfile: () => 
        axios.get<UserProfile>(AUTH_ENDPOINTS.PROFILE),
    
    changePassword: (passwordData: PasswordChangeData) => 
        axios.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData),
    
    changeEmail: (emailData: EmailChangeData) => 
        axios.post(AUTH_ENDPOINTS.CHANGE_EMAIL, emailData),
    
    twoFactor: {
        enable: () => axios.post(AUTH_ENDPOINTS.TWO_FACTOR.ENABLE),
        disable: () => axios.post(AUTH_ENDPOINTS.TWO_FACTOR.DISABLE)
    },
    verifyEmail: (token: string) => {
        return axios.post('/auth/verify-email', { token });
    }
}; 