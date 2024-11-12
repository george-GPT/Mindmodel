import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth/auth-service';
import { RootState, AppDispatch } from '../store/store';
import { setError } from '../store/auth-slice';
import { 
    LoginCredentials, 
    User, 
    AuthResponse,
    LoadingStateType 
} from '../types/auth.types';
import { TokenResponse } from '../types/api-types';

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
        const authFn = AuthService.loginUser(credentials);
        const response = await authFn(dispatch);
        if (!response) throw new Error('Login failed');
        return {
            access: response.access,
            refresh: response.refresh,
            user: {
                ...response.user,
                is_verified: response.user.email_verified,
                created_at: response.user.date_joined,
                updated_at: response.user.date_joined
            }
        };
    };

    const logout = useCallback(async () => {
        await AuthService.logout()(dispatch);
        navigate(redirectTo);
    }, [dispatch, navigate, redirectTo]);

    const socialLogin = useCallback(async (provider: 'google', token: string): Promise<TokenResponse> => {
        const authFn = AuthService.socialAuth(provider, token);
        const response = await authFn(dispatch);
        if (!response) throw new Error('Social login failed');
        return response as TokenResponse;
    }, [dispatch]);

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