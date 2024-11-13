import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { setError } from '../store/authSlice';
import type { 
    LoginCredentials,
    User,
    AuthResponse,
    TokenResponse,
    LoadingStateType,
    AuthServiceType 
} from '../types/auth';
import AuthService from '../services/auth/authService';

interface UseAuthenticationOptions {
    redirectTo?: string;
    requireAuth?: boolean;
    requiresMember?: boolean;
}

interface UseAuthenticationReturn {
    isAuthenticated: boolean;
    isMember: boolean;
    user: User | null;
    loading: Record<LoadingStateType, boolean>;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<TokenResponse>;
    logout: () => Promise<void>;
    socialLogin: (provider: 'google', token: string) => Promise<TokenResponse>;
}

export const useAuthentication = (
    options: UseAuthenticationOptions = {}
): UseAuthenticationReturn => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { redirectTo = '/login', requireAuth = true, requiresMember = false } = options;

    const { 
        isAuthenticated, 
        isMember, 
        user, 
        loading 
    } = useSelector((state: RootState) => state.auth);

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

            const isValid = await AuthService.validateSession();
            if (!isValid) {
                dispatch(setError('Session expired'));
                navigate(redirectTo);
            }
        };

        validateSession();
    }, [isAuthenticated, isMember, requireAuth, requiresMember, redirectTo, dispatch, navigate]);

    const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
        try {
            const response = await AuthService.loginUser(credentials);
            if (!response?.data?.user) throw new Error('Login failed');
            
            return {
                success: true,
                message: 'Login successful',
                data: {
                    access: response.data.access,
                    refresh: response.data.refresh,
                    user: response.data.user
                }
            };
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const logout = useCallback(async () => {
        await AuthService.logout();
        navigate(redirectTo);
    }, [navigate, redirectTo]);

    const socialLogin = useCallback(async (provider: 'google', token: string): Promise<TokenResponse> => {
        try {
            const response = await AuthService.googleLogin({ token });
            if (!response?.data) throw new Error('Social login failed');
            return response as TokenResponse;
        } catch (error) {
            throw new Error('Social login failed');
        }
    }, []);

    // Get specific loading state for login
    const isLoading = useSelector((state: RootState) => state.auth.loading.login);

    return {
        isAuthenticated,
        isMember,
        user,
        loading,
        isLoading,
        login,
        logout,
        socialLogin
    };
}; 