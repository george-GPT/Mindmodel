// src/services/auth/authService.ts

import { BaseService } from '../base/BaseService';
import { authAPI } from '@services/api/authApi';
import { RateLimitService, TokenService } from '@services/security';
import { ErrorCodes, ApiError } from '@/types';
import type { 
  LoginCredentials, 
  AuthResponse,
  GoogleAuthRequest,
  AuthServiceType,
  TokenResponse,
  RegisterRequest
} from '@/types';

/**
 * @description Service handling authentication-related operations
 * @extends {BaseService}
 */
class AuthService extends BaseService implements AuthServiceType {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const rateLimitService = RateLimitService.getInstance();
      
      if (!rateLimitService.checkLoginAttempt(credentials.email)) {
        throw this.createRateLimitError();
      }
      
      const response = await authAPI.login(credentials);
      const authResponse = this.validateResponse<AuthResponse>(response);
      
      if (!authResponse.data) {
        throw new Error('Invalid response data');
      }
      
      this.validateRequiredData(authResponse.data.user, 'Invalid user data received');
      await this.handleTokens(authResponse);
      
      return authResponse;
    } catch (error) {
      this.handleError(error, 'Authentication failed');
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
        TokenService.setTokens({
          success: true,
          data: {
            access: response.data.data.access,
            refresh: token,
            user: response.data.data.user
          }
        });
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

      TokenService.setTokens({
        success: true,
        data: {
          access: response.data.data.access,
          refresh: response.data.data.refresh,
          user: response.data.data.user
        }
      });
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

  public async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password2: string;
  }): Promise<void> {
    try {
      await authAPI.changePassword({
        old_password: data.old_password,
        new_password: data.new_password
      });
    } catch (error) {
      if ((error as ApiError).error?.code) {
        throw error;
      }
      throw {
        success: false,
        message: 'Password change failed',
        error: {
          code: ErrorCodes.VALIDATION_ERROR
        }
      } satisfies ApiError;
    }
  }

  public async registerUser(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const rateLimitService = RateLimitService.getInstance();
      
      if (!rateLimitService.checkRegisterAttempt(data.email)) {
        throw this.createRateLimitError();
      }
      
      const response = await authAPI.register(data);
      const authResponse = this.validateResponse<AuthResponse>(response);
      
      if (!authResponse.data) {
        throw new Error('Invalid response data');
      }
      
      this.validateRequiredData(authResponse.data.user, 'Invalid user data received');
      await this.handleTokens(authResponse);
      
      return authResponse;
    } catch (error) {
      this.handleError(error, 'Registration failed');
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
