// src/services/authService.ts

import { authAPI } from '../api/authPath';
import TokenService from '../api/token-service';
import { 
    login, 
    logout, 
    setLoading, 
    clearError
} from '../../store/authSlice';
import { store } from '../../store/store';
import { operations, components } from 'types/api';

// API Response Types
type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    error?: {
        code: string;
        details: Record<string, any>;
    };
};

// Type aliases from API schema
type User = components['schemas']['User'];
type LoginRequest = components['schemas']['EmailTokenObtainPairRequest'];
type LoginResponse = ApiResponse<{
    access: string;
    refresh: string;
    user: User;
}>;
type GoogleAuthResponse = ApiResponse<{
    access: string;
    refresh: string;
    user: User;
    provider: 'google';
    provider_id: string;
}>;
type RegisterRequest = operations['api_users_auth_auth_register_create']['requestBody']['content']['application/json'];
type BaseResponse = ApiResponse<Record<string, any>>;

import { 
    AuthProvider,
    AuthServiceType,
    SessionStatus,
    PermissionLevel
} from '@/types/auth';

import { handleAuthError } from '../../utils/error-handler';
import AuthenticationService from '../auth/authentication-service';

class AuthService implements AuthServiceType {
    private static instance: AuthService;
    private authManager: AuthenticationService;
    private dispatch = store.dispatch;

    private constructor() {
        this.authManager = AuthenticationService.getInstance();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private handleAuthResponse<T extends LoginResponse>(response: T): T {
        TokenService.setTokens({
            access: response.data.access,
            refresh: response.data.refresh
        });
        return response;
    }

    private determineAdminStatus(user: User): boolean {
        return user.meta?.custom?.permissionLevel === PermissionLevel.Admin;
    }

    public async loginUser(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());

            const canProceed = await this.authManager.handleLogin(credentials);
            if (!canProceed) {
                throw new Error('Login preconditions not met');
            }
            
            const { data } = await authAPI.login(credentials);
            this.handleAuthResponse(data);
            
            await this.authManager.initializeAuth(credentials.remember_me);
            
            this.dispatch(login({
                user: data.data.user,
                isMember: data.data.user.is_member,
                isAdmin: this.determineAdminStatus(data.data.user)
            }));
            
            return data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async socialAuth(provider: AuthProvider, accessToken: string): Promise<LoginResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());
            
            await this.authManager.handleOAuthLogin(provider, accessToken);
            
            const { data } = await authAPI.socialAuth(provider, accessToken);
            this.handleAuthResponse(data);
            
            this.dispatch(login({
                user: data.data.user,
                isMember: data.data.user.is_member,
                isAdmin: this.determineAdminStatus(data.data.user)
            }));
            
            return data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async googleLogin(credential: string): Promise<GoogleAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());
            
            const { data } = await authAPI.googleAuth(credential);
            if (!data.data.provider || !data.data.provider_id) {
                throw new Error('Invalid Google auth response');
            }
            
            this.handleAuthResponse(data);
            
            this.dispatch(login({
                user: data.data.user,
                isMember: data.data.user.is_member,
                isAdmin: this.determineAdminStatus(data.data.user)
            }));
            
            return {
                ...data.data,
                provider: 'google' as const,
                provider_id: data.data.provider_id
            };
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async registerUser(data: RegisterRequest): Promise<LoginResponse> {
        try {
            this.dispatch(setLoading({ type: 'register', isLoading: true }));
            const response = await authAPI.register(data);
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'register', isLoading: false }));
        }
    }

    public async logout(): Promise<void> {
        try {
            await authAPI.logout();
            await this.authManager.handleLogout();
            this.dispatch(logout());
        } catch (error) {
            console.error('Logout error:', error);
            await this.authManager.handleLogout();
            this.dispatch(logout());
        }
    }

    public async changePassword(data: PasswordChangeRequest): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordChange', isLoading: true }));
            const response = await authAPI.changePassword(data);
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordChange', isLoading: false }));
        }
    }

    public async changeEmail(data: EmailChangeRequest): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'emailChange', isLoading: true }));
            const response = await authAPI.changeEmail(data);
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'emailChange', isLoading: false }));
        }
    }

    public async enableTwoFactor(): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: true }));
            const response = await authAPI.twoFactor.enable();
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: false }));
        }
    }

    public async disableTwoFactor(): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: true }));
            const response = await authAPI.twoFactor.disable();
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: false }));
        }
    }

    public async validateSession(): Promise<boolean> {
        return this.authManager.validateSession();
    }

    public getSessionStatus(): SessionStatus {
        return this.authManager.getSessionStatus();
    }

    public cleanup(): void {
        this.authManager.cleanup();
    }

    public async requestPasswordReset(email: string): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: true }));
            const response = await authAPI.requestPasswordReset(email);
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: false }));
        }
    }

    public async confirmPasswordReset(data: PasswordResetConfirm): Promise<BaseResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: true }));
            const response = await authAPI.confirmPasswordReset(data);
            return response;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: false }));
        }
    }
}

export default AuthService;
