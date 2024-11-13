import type { components } from 'types/api';
import type { 
    AuthResponse,
    TokenResponse,
    LoginCredentials
} from 'types/auth';

// Axios Instance
import axios from './axios';

// Request Types
interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

interface PasswordChangeRequest {
    old_password: string;
    new_password: string;
}

interface EmailChangeRequest {
    new_email: string;
    password: string;
}

// Response Types with proper type composition
type VerificationResponse = components['schemas']['SuccessResponse'] & {
    data?: {
        verified: boolean;
    };
};

type ResendVerificationResponse = components['schemas']['SuccessResponse'] & {
    data?: {
        sent: boolean;
        email: string;
    };
};

export const authAPI = {
    login: (credentials: LoginCredentials) => 
        axios.post<AuthResponse>('/api/users/auth/login/', credentials),
    
    register: (data: RegisterRequest) => 
        axios.post<components['schemas']['SuccessResponse']>('/api/users/auth/register/', data),
    
    logout: () => 
        axios.post<components['schemas']['SuccessResponse']>('/api/users/auth/logout/'),
    
    googleAuth: (credential: string) => 
        axios.post<AuthResponse>('/api/users/auth/google/', { credential }),
    
    verifyEmail: (token: string) => 
        axios.post<VerificationResponse>('/api/users/auth/verify-email/', { token }),
    
    resendVerification: (email: string) =>
        axios.post<ResendVerificationResponse>('/api/users/auth/resend-verification/', { email }),

    changePassword: (data: PasswordChangeRequest) => 
        axios.post<components['schemas']['SuccessResponse']>('/api/users/auth/change-password/', data),

    getProfile: () => 
        axios.get<components['schemas']['SuccessResponse'] & {
            data: components['schemas']['UserProfile']
        }>('/api/users/auth/profile/'),

    refresh: (refresh: string) => 
        axios.post<TokenResponse>('/api/users/auth/refresh/', { refresh })
}; 