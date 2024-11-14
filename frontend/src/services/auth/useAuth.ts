// src/services/auth/useAuth.ts

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { 
  setError, 
  login as loginAction, 
  logout as logoutAction, 
  setLoading, 
  clearError 
} from '../../store/authSlice';
import { 
  startSession, 
  endSession, 
  updateSessionData 
} from '../../store/sessionSlice';
import type { 
  LoginCredentials, 
  AuthResponse, 
  LoadingStateType,
  User,
  GoogleAuthRequest 
} from '../../types/auth';
import { ApiError, ErrorCodes } from '../../types/error';
import authService from './authService';

interface UseAuthenticationOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiresMember?: boolean;
}

interface UseAuthenticationReturn {
  isAuthenticated: boolean;
  isMember: boolean;
  user: User | null;
  error: ApiError | null;
  loading: Record<LoadingStateType, boolean>;
  isLoading: boolean;
  isAnyLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google', token: string) => Promise<void>;
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

      if (requiresMember && !isMember) {
        navigate('/upgrade');
        return;
      }

      const isValid = await authService.validateSession();
      
      if (!isValid) {
        const sessionError: ApiError = {
          success: false,
          message: 'Session expired',
          error: {
            code: ErrorCodes.TOKEN_EXPIRED
          }
        };
        dispatch(setError(sessionError));
        dispatch(logoutAction());
        dispatch(endSession());
        navigate(redirectTo);
      } else {
        dispatch(updateSessionData({ lastActive: Date.now() }));
      }
    };

    validateSession();
  }, [isAuthenticated, isMember, requireAuth, requiresMember, redirectTo, dispatch, navigate]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch(setLoading({ type: 'login', isLoading: true }));
      dispatch(clearError());

      const response = await authService.loginUser(credentials);

      if (!response?.data?.user) {
        throw new Error('Invalid response data');
      }

      dispatch(loginAction({
        user: response.data.user,
        isMember: response.data.user.is_member,
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
          code: ErrorCodes.AUTHENTICATION_ERROR
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
      await authService.logout();
      dispatch(logoutAction());
      dispatch(endSession());
      navigate(redirectTo);
    } catch (err) {
      const apiError: ApiError = {
        success: false,
        message: err instanceof Error ? err.message : 'Logout failed',
        error: {
          code: ErrorCodes.AUTHENTICATION_ERROR
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

      const response = await authService.googleLogin({ token });

      if (!response?.data?.user) {
        throw new Error('Invalid response data');
      }

      dispatch(loginAction({
        user: response.data.user,
        isMember: response.data.user.is_member,
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
          code: ErrorCodes.AUTHENTICATION_ERROR
        }
      };
      dispatch(setError(apiError));
      throw err;
    } finally {
      dispatch(setLoading({ type: 'social', isLoading: false }));
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
  };
};
