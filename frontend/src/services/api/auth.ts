import axios from 'axios';
import { 
    AuthResponse, 
    LoginCredentials, 
    RegisterData, 
    PasswordChangeData,
    EmailChangeData,
    GoogleAuthResponse,
    BaseAuthResponse,
    TokenResponse,
    TokenVerificationResponse,
    ProfileResponse,
    TwoFactorAuthResponse,
    AuthApiPaths,
    PasswordResetRequest,
    PasswordResetConfirm,
    AuthProvider,
    User,
    SocialAuthRequest
} from '../../types/auth.types';

export const API_PATHS: AuthApiPaths = {
    BASE: '/api/users/auth',
    LOGIN: '/api/users/auth/login/',
    REGISTER: '/api/users/member/register/',
    LOGOUT: '/api/users/auth/logout/',
    REFRESH: '/api/users/auth/token/refresh/',
    VERIFY_TOKEN: '/api/users/auth/token/verify/',
    VERIFY_EMAIL: '/api/users/auth/verify-email/',
    PROFILE: '/api/users/member/me/',
    SOCIAL_AUTH: '/api/users/auth/social-auth/',
    CHANGE_PASSWORD: '/api/users/member/change-password/',
    CHANGE_EMAIL: '/api/users/member/change-email/',
    TWO_FACTOR: {
        ENABLE: '/api/users/auth/2fa/enable/',
        DISABLE: '/api/users/auth/2fa/disable/'
    },
    PASSWORD_RESET: '/api/users/auth/password/reset/',
    PASSWORD_RESET_CONFIRM: '/api/users/auth/password/reset/confirm/'
};

// Create axios instance with interceptors
const axiosInstance = axios.create();

// Add CSRF token to requests
axiosInstance.interceptors.request.use(config => {
  const csrfToken = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\\s*([^;]+)')?.pop() || '';
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export const authAPI = {
    login: (credentials: LoginCredentials) =>
        axiosInstance.post<AuthResponse>(API_PATHS.LOGIN, credentials),
    
    register: (data: RegisterData) =>
        axiosInstance.post<AuthResponse>(API_PATHS.REGISTER, data),
    
    logout: () => 
        axiosInstance.post(API_PATHS.LOGOUT),
    
    refresh: (refreshToken: string) =>
        axiosInstance.post<TokenResponse>(API_PATHS.REFRESH, { refresh: refreshToken }),
    
    verifyToken: (token: string) =>
        axiosInstance.post<TokenVerificationResponse>(API_PATHS.VERIFY_TOKEN, { token }),
    
    verifyEmail: (token: string) =>
        axiosInstance.post<BaseAuthResponse>(API_PATHS.VERIFY_EMAIL, { token }),
    
    getProfile: () =>
        axiosInstance.get<ProfileResponse>(API_PATHS.PROFILE),
    
    updateProfile: (data: Partial<User>) =>
        axiosInstance.put<ProfileResponse>(API_PATHS.PROFILE, data),
    
    socialAuth: (provider: AuthProvider, accessToken: string) =>
        axiosInstance.post<AuthResponse>(API_PATHS.SOCIAL_AUTH, { 
            provider, 
            access_token: accessToken 
        } as SocialAuthRequest),
    
    googleAuth: (credential: string) =>
        axiosInstance.post<GoogleAuthResponse>(API_PATHS.SOCIAL_AUTH, { 
            provider: 'google', 
            credential 
        }),
    
    changePassword: (data: PasswordChangeData) =>
        axiosInstance.post<BaseAuthResponse>(API_PATHS.CHANGE_PASSWORD, data),
    
    changeEmail: (data: EmailChangeData) =>
        axiosInstance.post<BaseAuthResponse>(API_PATHS.CHANGE_EMAIL, data),
    
    twoFactor: {
        enable: () => 
            axiosInstance.post<TwoFactorAuthResponse>(API_PATHS.TWO_FACTOR.ENABLE),
        disable: () => 
            axiosInstance.post<BaseAuthResponse>(API_PATHS.TWO_FACTOR.DISABLE)
    },

    requestPasswordReset: (email: string) =>
        axiosInstance.post<BaseAuthResponse>(API_PATHS.PASSWORD_RESET, { email }),

    confirmPasswordReset: (data: PasswordResetConfirm) =>
        axiosInstance.post<BaseAuthResponse>(API_PATHS.PASSWORD_RESET_CONFIRM, data)
};