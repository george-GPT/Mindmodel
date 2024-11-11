// DO NOT UPDATE THIS FILE UNDER ANY CIRCUMSTANCE.

import { AppDispatch } from '../store/store';

// Token configuration constants
export const TOKEN_EXPIRY = {
    VERIFICATION: 86400,    // 24 hours
    EMAIL_CHANGE: 3600,     // 1 hour
    PASSWORD_RESET: 3600,   // 1 hour
    REFRESH: 604800,        // 7 days
    ACCESS: 900,            // 15 minutes
} as const;

// Core User Type (matching Django User model)
export interface User {
    id: number;
    email: string;
    username: string;
    is_member: boolean;
    is_verified: boolean;
    profile_complete: boolean;
    created_at: string;     // ISO 8601 format
    updated_at: string;     // ISO 8601 format
    meta?: {               
        theme: UserTheme;   // Updated to use enum
        notifications: boolean;
        language: SupportedLanguage;  // Updated to use enum
        custom: Record<string, unknown>;
    };
    profile?: {           
        bio: string;
        profile_picture: string | null;
    };
}

// Auth State
export interface AuthState {
    isAuthenticated: boolean;
    isMember: boolean;
    isAdmin?: boolean;
    user: User | null;
    loading: Record<LoadingStateType, boolean>;
    error: AuthErrorResponse | null;
}

// Error Type
export interface AuthError {
    message: string;
    code?: string;        
    field?: string;
}

// Response Types (matching DRF serializers)
export interface BaseAuthResponse {
    success: boolean;
    message?: string;
    error?: {
        message: string;
        code: AuthErrorCode;
        field?: string;
    };
}

export interface AuthResponse extends BaseAuthResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface TokenResponse extends BaseAuthResponse {  // Updated to extend BaseAuthResponse
    access: string;
    refresh: string;
}

export interface TokenVerificationResponse extends BaseAuthResponse {  // Added from documentation
    is_valid: boolean;
}

export interface ProfileResponse extends BaseAuthResponse {  // Added from documentation
    user: User;
}

export interface TwoFactorAuthResponse extends BaseAuthResponse {
    qr_code: string;
}

// Request Types (matching DRF serializers)
export interface BaseCredentials {
    email: string;
    password: string;
}

export interface LoginCredentials extends BaseCredentials {
    remember_me?: boolean;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
}

export interface PasswordChangeData {
    old_password: string;
    new_password: string;
}

export interface EmailChangeData {
    new_email: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    new_password: string;
}

// OAuth Types (matching backend social auth)
export interface GoogleAuthResponse extends AuthResponse {
    provider: 'google';
    provider_id: string;
}

// Utility Types
export type AuthProvider = 'google';
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

export enum PermissionLevel {
    Public = 'public',
    Authenticated = 'authenticated',
    Member = 'member',
    Admin = 'admin'
}

// Service Types
export interface AuthServiceType {
    loginUser: (credentials: LoginCredentials) => Promise<AuthResponse>;
    googleLogin: (credential: string) => Promise<GoogleAuthResponse>;
    registerUser: (data: RegisterData) => Promise<AuthResponse>;
    socialAuth: (provider: AuthProvider, token: string) => Promise<AuthResponse>;
    changePassword: (data: PasswordChangeData) => Promise<BaseAuthResponse>;
    changeEmail: (data: EmailChangeData) => Promise<BaseAuthResponse>;
    enableTwoFactor: () => Promise<TwoFactorAuthResponse>;
    disableTwoFactor: () => Promise<BaseAuthResponse>;
    logout: () => Promise<void>;
    validateSession: () => Promise<boolean>;
    getSessionStatus: () => SessionStatus;
    cleanup: () => void;
    requestPasswordReset: (email: string) => Promise<BaseAuthResponse>;
    confirmPasswordReset: (data: PasswordResetConfirm) => Promise<BaseAuthResponse>;
}

export interface SessionStatus {
    isValid: boolean;
    remainingTime?: number;
    warningIssued: boolean;
}

export interface AuthApiPaths {
    BASE: '/api/users/auth';
    LOGIN: '/api/users/auth/login/';
    REGISTER: '/api/users/member/register/';
    LOGOUT: '/api/users/auth/logout/';
    REFRESH: '/api/users/auth/token/refresh/';
    VERIFY_TOKEN: '/api/users/auth/token/verify/';
    VERIFY_EMAIL: '/api/users/auth/verify-email/';
    PROFILE: '/api/users/member/me/';
    SOCIAL_AUTH: '/api/users/auth/social-auth/';
    CHANGE_PASSWORD: '/api/users/member/change-password/';
    CHANGE_EMAIL: '/api/users/member/change-email/';
    TWO_FACTOR: {
        ENABLE: '/api/users/auth/2fa/enable/';
        DISABLE: '/api/users/auth/2fa/disable/';
    };
    PASSWORD_RESET: '/api/users/auth/password/reset/';
    PASSWORD_RESET_CONFIRM: '/api/users/auth/password/reset/confirm/';
}

// Enums for type safety
export enum UserTheme {
    LIGHT = 'light',
    DARK = 'dark'
}

export enum SupportedLanguage {
    EN = 'en',
    ES = 'es'
}

// Validation constants from documentation
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

// Error codes from documentation
export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'invalid_credentials',
    VALIDATION_ERROR = 'validation_error',
    TOKEN_EXPIRED = 'token_expired',
    PERMISSION_DENIED = 'permission_denied',
    NOT_FOUND = 'not_found',
    RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
    INVALID_TOKEN = 'invalid_token',
    ACCOUNT_DISABLED = 'account_disabled',
    NETWORK_ERROR = 'network_error',
    SERVER_ERROR = 'server_error',
    OFFLINE = 'offline',
    REQUEST_FAILED = 'request_failed'
}

// Response status codes from documentation
export enum AuthResponseStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_ERROR = 500
}


export interface SocialAuthRequest {
  provider: AuthProvider;
  access_token: string;
}

// Add error response type
export interface AuthErrorResponse {
    message: string;
    code: AuthErrorCode;
    field?: string;
}
