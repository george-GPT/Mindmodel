import type { components } from './api';
import { ApiError } from './error';

// Core auth state
export interface AuthState {
  isAuthenticated: boolean;
  user: components['schemas']['UserProfile'] | null;
  isMember: boolean;
  isAdmin: boolean;
  error: ApiError | null;
  loading: Record<LoadingStateType, boolean>;
  session: SessionState;
  verification: VerificationState;
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

// Request/Response types (from OpenAPI schema)
export type {
  UserProfile,
  TokenResponse,
  AuthResponse,
  LoginCredentials
} from './api';

// Frontend-specific types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

// Token management
export interface TokenPair {
  access: string;
  refresh: string;
}

// OAuth types
export interface GoogleSDKResponse {
  credential: string;
  select_by?: string;
}

// Auth provider type
export type AuthProvider = 'google' | 'email';

// Session management
export interface SessionState {
  expiresAt: number;
  refreshExpiresAt: number;
  lastActivity: number;
}

// Verification types
export interface VerificationState {
  isVerified: boolean;
  verificationSent: boolean;
  verificationExpiry: number;
}

// Auth error types
export type AuthErrorType = 
  | 'invalid_credentials'
  | 'token_expired'
  | 'email_not_verified'
  | 'verification_failed'
  | 'session_expired';

