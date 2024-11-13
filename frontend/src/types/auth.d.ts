import { paths, operations, components } from './api';
import { ApiError } from './error';

// Core types from API schema
export type LoginCredentials = components['schemas']['EmailTokenObtainPairRequest'];
export type User = components['schemas']['UserProfile'];

// More flexible response types
export type AuthResponse = {
    success: boolean;
    message?: string;
    data?: {
        access: string;
        refresh: string;
        user?: User;  // Optional in AuthResponse
    };
};

export type TokenResponse = {
    success: boolean;
    message?: string;
    data?: {
        access: string;
        refresh: string;
        user: User;  // Required in TokenResponse
    };
};

// Simple request types
export interface GoogleAuthRequest {
    token: string;
}

// Loading states
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

// Auth state
export interface AuthState {
    isAuthenticated: boolean;
    isMember: boolean;
    isAdmin?: boolean;
    user: User | null;
    loading: Record<LoadingStateType, boolean>;
    error: ApiError | null;
}

// Auth service interface
export interface AuthServiceType {
    loginUser: (credentials: LoginCredentials) => Promise<AuthResponse>;
    googleLogin: (data: GoogleAuthRequest) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    validateSession: () => Promise<boolean>;
}

// Constants
export const TOKEN_EXPIRY = {
    VERIFICATION: 86400,
    EMAIL_CHANGE: 3600,
    PASSWORD_RESET: 3600,
    REFRESH: 604800,
    ACCESS: 900
} as const;

export type AuthProvider = 'google';
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';