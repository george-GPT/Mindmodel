import axios from './axios';
import { 
    VerificationResponse,
    ResendVerificationResponse,
    RegisterRequest,
    PasswordChangeRequest,
    EmailChangeRequest
} from 'types/auth';

// Define request/response types from API schema
type LoginRequest = components['schemas']['EmailTokenObtainPairRequest'];
type LoginResponse = operations['api_users_auth_auth_login_create']['responses'][200]['content']['application/json'];

export const authAPI = {
    login: (credentials: LoginRequest) => 
        axios.post<LoginResponse>('/api/users/auth/login/', credentials),
    
    register: (data: RegisterRequest) => 
        axios.post<operations['api_users_auth_auth_register_create']['responses'][201]['content']['application/json']>(
            '/api/users/auth/register/', 
            data
        ),
    
    logout: () => 
        axios.post('/api/users/auth/logout/'),
    
    googleAuth: (credential: string) => 
        axios.post<operations['api_users_auth_auth_google_create']['responses'][200]['content']['application/json']>(
            '/api/users/auth/google/', 
            { credential }
        ),
    
    verifyEmail: (token: string) => 
        axios.post<VerificationResponse>('/api/users/auth/verify-email/', { token }),
    
    resendVerification: (email: string) =>
        axios.post<ResendVerificationResponse>('/api/users/auth/resend-verification/', { email }),

    changePassword: (data: PasswordChangeRequest) => 
        axios.post('/api/users/auth/change-password/', data),

    getProfile: () => 
        axios.get('/api/users/auth/profile/'),
}; 