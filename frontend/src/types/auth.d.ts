import type { components } from './api';
import { ApiError } from './error';

// Core types from API schema
export type LoginCredentials = components['schemas']['LoginCredentials'];
export type User = components['schemas']['UserProfile'];
export type SessionStatus = components['schemas']['SessionStatus'];
export type AuthProvider = 'google';

// Token types that match the backend schema exactly
export type TokenResponse = {
    success: boolean;
    message?: string;
    data: {
        access: string;
        refresh: string;
        user: User;
    };
};

export type AuthResponse = components['schemas']['AuthResponse'];

// Request types
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

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';