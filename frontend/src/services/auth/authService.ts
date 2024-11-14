// src/services/auth/authService.ts

import { authAPI } from '@services/api/authApi';
import { RateLimitService, TokenService } from '@services/security';
import { ErrorCodes, ApiError } from '@/types';
import type { 
  LoginCredentials, 
  AuthResponse,
  GoogleAuthRequest,
  AuthServiceType,
  TokenResponse
} from '@/types';

class AuthService implements AuthServiceType {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const rateLimitService = RateLimitService.getInstance();
    
    if (!rateLimitService.checkLoginAttempt(credentials.email)) {
      throw {
        success: false,
        message: 'Rate limit exceeded',
        error: {
          code: ErrorCodes.RATE_LIMIT_EXCEEDED
        }
      } satisfies ApiError;
    }
    
    try {
      const response = await authAPI.login(credentials);
      
      if (!response?.data?.data?.access || !response?.data?.data?.refresh || !response?.data?.data?.user) {
        throw {
          success: false,
          message: 'Invalid token data received',
          error: {
            code: ErrorCodes.VALIDATION_ERROR
          }
        } satisfies ApiError;
      }

      TokenService.setTokens(response.data.data.access, response.data.data.refresh);
      return response.data;
    } catch (error) {
      if ((error as ApiError).error?.code) {
        throw error;
      }
      throw {
        success: false,
        message: 'Authentication failed',
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR
        }
      } satisfies ApiError;
    }
  }

  public async logout(): Promise<void> {
    try {
      await authAPI.logout();
      TokenService.clearTokens();
    } catch (error) {
      TokenService.clearTokens();
      if ((error as ApiError).error?.code) {
        throw error;
      }
      throw {
        success: false,
        message: 'Logout failed',
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR
        }
      } satisfies ApiError;
    }
  }

  public async validateSession(): Promise<boolean> {
    try {
      const token = TokenService.getRefreshToken();
      if (!token) return false;
      
      const response = await authAPI.refreshToken(token);
      if (response?.data?.data?.access) {
        TokenService.setTokens(response.data.data.access, token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  public async googleLogin(data: GoogleAuthRequest): Promise<AuthResponse> {
    const rateLimitService = RateLimitService.getInstance();
    
    if (!rateLimitService.checkOAuthAttempt()) {
      throw {
        success: false,
        message: 'Rate limit exceeded',
        error: {
          code: ErrorCodes.RATE_LIMIT_EXCEEDED
        }
      } satisfies ApiError;
    }
    
    try {
      const response = await authAPI.googleAuth(data);
      
      if (!response?.data?.data?.access || !response?.data?.data?.refresh || !response?.data?.data?.user) {
        throw {
          success: false,
          message: 'Invalid token data received',
          error: {
            code: ErrorCodes.VALIDATION_ERROR
          }
        } satisfies ApiError;
      }

      TokenService.setTokens(response.data.data.access, response.data.data.refresh);
      return response.data;
    } catch (error) {
      if ((error as ApiError).error?.code) {
        throw error;
      }
      throw {
        success: false,
        message: 'Google authentication failed',
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR
        }
      } satisfies ApiError;
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
