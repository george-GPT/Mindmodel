// src/hooks/useAuth.ts

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { 
  setError, 
  login as loginAction, 
  logout as logoutAction, 
  setLoading, 
  clearError 
} from '@/store/authSlice';
import { 
  startSession, 
  endSession, 
  updateSessionData 
} from '@/store/sessionSlice';
import type { 
  LoginCredentials, 
  AuthResponse, 
  LoadingStateType,
  UserProfile,
  TokenPair,
  GoogleSDKResponse,
  RegisterData,
  ChangePasswordData
} from '@/types/auth';
import { ApiError, ErrorCodes, isApiError } from '@/types/error';
import { authApi } from '@/services/api/authApi';
import { tokenService } from '@/services/security/tokenService';

interface UseAuthenticationOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiresMember?: boolean;
}

interface UseAuthenticationReturn {
  isAuthenticated: boolean;
  isMember: boolean;
  user: UserProfile | null;
  error: ApiError | null;
  loading: Record<LoadingStateType, boolean>;
  isLoading: boolean;
  isAnyLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google', token: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}

export const useAuth = (
  options: UseAuthenticationOptions = {}
): UseAuthenticationReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { redirectTo = '/login', requireAuth = true, requiresMember = false } = options;

  const { isAuthenticated, isMember, user, error, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const validateSession = async () => {
      if (requireAuth && !isAuthenticated) {
        navigate(redirectTo);
        return;
      }

      const token = tokenService.getRefreshToken();
      if (!token) {
        handleSessionExpired();
        return;
      }

      try {
        const response = await authApi.refresh(token);
        if (response?.data?.data?.access) {
          tokenService.setTokens({
            access: response.data.data.access,
            refresh: token
          });
          dispatch(updateSessionData({ lastActive: Date.now() }));
        } else {
          handleSessionExpired();
        }
      } catch (error) {
        handleSessionExpired();
      }
    };

    const handleSessionExpired = () => {
      const sessionError: ApiError = {
        success: false,
        message: 'Session expired',
        error: {
          code: ErrorCodes.token_expired
        }
      };
      dispatch(setError(sessionError));
      dispatch(logoutAction());
      dispatch(endSession());
      navigate(redirectTo);
    };

    validateSession();
  }, [isAuthenticated, isMember, requireAuth, requiresMember, redirectTo, dispatch, navigate]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'login', isLoading: true }));
      dispatch(clearError());

      const response = await authApi.login(credentials);

      if (!response?.data?.data?.user) {
        throw new Error('Invalid response data');
      }

      dispatch(loginAction({
        user: response.data.data.user,
        isMember: response.data.data.user.is_member || false,
        isAdmin: false
      }));

      const sessionId = crypto.randomUUID();
      dispatch(startSession({
        sessionId,
        data: { lastActive: Date.now() }
      }));
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Login failed',
        error: {
          code: ErrorCodes.not_authenticated
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'login', isLoading: false }));
    }
  }, [dispatch]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'auth', isLoading: true }));
      await authApi.logout();
      dispatch(logoutAction());
      dispatch(endSession());
      navigate(redirectTo);
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Logout failed',
        error: {
          code: ErrorCodes.not_authenticated
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'auth', isLoading: false }));
    }
  }, [dispatch, navigate, redirectTo]);

  const socialLogin = useCallback(async (provider: 'google', token: string): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'social', isLoading: true }));
      dispatch(clearError());

      const response = await authApi.googleAuth(token);

      if (!response?.data?.data?.user) {
        throw new Error('Invalid response data');
      }

      dispatch(loginAction({
        user: response.data.data.user,
        isMember: response.data.data.user.is_member || false,
        isAdmin: false
      }));

      const sessionId = crypto.randomUUID();
      dispatch(startSession({
        sessionId,
        data: { lastActive: Date.now() }
      }));
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Social login failed',
        error: {
          code: ErrorCodes.not_authenticated
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'social', isLoading: false }));
    }
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'register', isLoading: true }));
      dispatch(clearError());
      await authApi.register(data);
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Registration failed',
        error: {
          code: ErrorCodes.validation_error
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'register', isLoading: false }));
    }
  }, [dispatch]);

  const changePassword = useCallback(async (data: ChangePasswordData): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'passwordChange', isLoading: true }));
      dispatch(clearError());
      await authApi.changePassword(data);
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Password change failed',
        error: {
          code: ErrorCodes.validation_error
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'passwordChange', isLoading: false }));
    }
  }, [dispatch]);

  const isLoading = loading.login || loading.auth || loading.social;
  const isAnyLoading = Object.values(loading).some(Boolean);

  return {
    isAuthenticated,
    isMember,
    user,
    error,
    loading,
    isLoading,
    isAnyLoading,
    login,
    logout,
    socialLogin,
    register,
    changePassword
  };
};
