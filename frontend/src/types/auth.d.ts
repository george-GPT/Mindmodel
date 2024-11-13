import { paths, operations, components } from './api';

// Token expiry constants from backend
export const TOKEN_EXPIRY = {
    readonly VERIFICATION: 86400,
    readonly EMAIL_CHANGE: 3600,
    readonly PASSWORD_RESET: 3600,
    readonly REFRESH: 604800,
    readonly ACCESS: 900
} as const;

// Auth status types
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
export type AuthProvider = 'google';

// Frontend loading states
export type LoadingStateType = 
    | 'login' 
    | 'register'
    | 'passwordChange'
    | 'emailChange'
    | 'twoFactor'
    | 'auth'
    | 'profile'
    | 'verification'
    | 'social';

// Frontend auth state
export interface AuthState {
    isAuthenticated: boolean;
    isMember: boolean;
    isAdmin?: boolean;
    user: components['schemas']['UserProfile'] | null;
    loading: Record<LoadingStateType, boolean>;
    error: components['schemas']['ErrorResponse'] | null;
}

// Request types not in schema
export interface GoogleAuthRequest {
    token: string;
}

// Validation rules matching backend constraints
export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        PATTERN: /^(?=.*[0-9])(?=.*[!@#$%^&*])/
    },
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 150,
        PATTERN: /^[a-zA-Z0-9_-]*$/
    },
    EMAIL: {
        MAX_LENGTH: 255,
        PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }
} as const;

// Auth service interface matching backend endpoints
export interface AuthServiceType {
    loginUser: (data: components['schemas']['EmailTokenObtainPairRequest']) => 
        Promise<operations['api_users_auth_auth_login_create']['responses'][200]['content']['application/json']>;
    
    googleLogin: (data: GoogleAuthRequest) => 
        Promise<operations['api_users_auth_auth_google_create']['responses'][200]['content']['application/json']>;
    
    registerUser: (data: components['schemas']['EmailTokenObtainPairRequest']) => 
        Promise<operations['api_users_auth_auth_register_create']['responses'][201]['content']['application/json']>;
    
    changePassword: (data: { old_password: string; new_password: string; }) => 
        Promise<operations['api_users_auth_change_password_create']['responses'][200]['content']['application/json']>;
    
    changeEmail: (data: { new_email: string; password: string; }) => 
        Promise<operations['api_users_auth_change_email_create']['responses'][200]['content']['application/json']>;
    
    toggle2FA: () => 
        Promise<operations['api_users_auth_2fa_create']['responses'][200]['content']['application/json']>;
    
    enable2FA: () => 
        Promise<operations['api_users_auth_2fa_enable_create']['responses'][200]['content']['application/json']>;
    
    disable2FA: () => 
        Promise<operations['api_users_auth_2fa_disable_create']['responses'][200]['content']['application/json']>;
    
    logout: () => Promise<void>;
    
    validateSession: () => Promise<boolean>;
    
    getProfile: () => 
        Promise<operations['api_users_auth_profile_retrieve']['responses'][200]['content']['application/json']>;
    
    updateProfile: (data: Partial<components['schemas']['UserProfileRequest']>) => 
        Promise<operations['api_users_auth_profile_partial_update']['responses'][200]['content']['application/json']>;
}