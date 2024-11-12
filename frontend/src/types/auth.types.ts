import { paths, operations, components } from './api';

// Token configuration constants
export const TOKEN_EXPIRY = {
    VERIFICATION: 86400,    // 24 hours
    EMAIL_CHANGE: 3600,     // 1 hour
    PASSWORD_RESET: 3600,   // 1 hour
    REFRESH: 604800,        // 7 days
    ACCESS: 900,            // 15 minutes
} as const;

// Frontend-specific state types
export interface AuthState {
    isAuthenticated: boolean;
    isMember: boolean;
    isAdmin?: boolean;
    user: {
        id: number;
        username: string;
        email: string;
        is_verified: boolean;
        is_member: boolean;
        profile_complete: boolean;
        created_at: string;
        updated_at: string;
    } | null;
    loading: Record<LoadingStateType, boolean>;
    error: ErrorResponse | null;
}

// Type aliases from api.d.ts
type ErrorResponse = {
    success: boolean;
    message: string;
    error?: {
        code: string;
        details: Record<string, any>;
    };
};

// Utility types
export type AuthProvider = 'google' | 'apple';
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
export type LoadingStateType = 
    | 'login' 
    | 'register' 
    | 'passwordChange' 
    | 'emailChange' 
    | 'twoFactor' 
    | 'auth' 
    | 'profile'
    | 'passwordReset'
    | 'verification'
    | 'social';

// Service Types
export interface AuthServiceType {
    loginUser: (data: components['schemas']['EmailTokenObtainPairRequest']) => 
        Promise<operations['api_users_auth_auth_login_create']['responses'][200]['content']['application/json']>;
    googleLogin: (data: { credential: string }) => 
        Promise<operations['api_users_auth_auth_google_create']['responses'][200]['content']['application/json']>;
    registerUser: (data: RegisterRequest) => 
        Promise<operations['api_users_auth_auth_register_create']['responses'][201]['content']['application/json']>;
    changePassword: (data: { old_password: string; new_password: string }) => 
        Promise<operations['api_users_auth_change_password_create']['responses'][200]['content']['application/json']>;
    changeEmail: (data: { new_email: string; password: string }) => 
        Promise<operations['api_users_auth_change_email_create']['responses'][200]['content']['application/json']>;
    logout: () => Promise<void>;
    validateSession: () => Promise<boolean>;
    getProfile: () => Promise<operations['api_users_auth_profile_retrieve']['responses'][200]['content']['application/json']>;
    updateProfile: (data: Partial<AuthState['user']>) => 
        Promise<operations['api_users_auth_profile_partial_update']['responses'][200]['content']['application/json']>;
}

// UI-specific enums
export enum UserTheme {
    LIGHT = 'light',
    DARK = 'dark'
}

export enum SupportedLanguage {
    EN = 'en',
    ES = 'es'
}

// Validation constants matching backend
export const VALIDATION_RULES = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        PATTERN: /^(?=.*[0-9])(?=.*[!@#$%^&*])/
    },
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 30,
        PATTERN: /^[a-zA-Z0-9_-]*$/
    },
    EMAIL: {
        MAX_LENGTH: 255,
        PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }
} as const;

// Request/Response Type Aliases
export type RegisterRequest = {
    email: string;
    username: string;
    password: string;
};

export type LoginRequest = components['schemas']['EmailTokenObtainPairRequest'];
export type LoginResponse = operations['api_users_auth_auth_login_create']['responses'][200]['content']['application/json'];