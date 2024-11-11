// src/services/authService.ts

import { authAPI } from '../api/auth';
import TokenService from '../api/token-service';
import { 
    login, 
    logout, 
    setLoading, 
    clearError
} from '../../store/auth-slice';
import { store } from '../../store/store';
import { 
    AuthResponse,
    AuthProvider,
    LoginCredentials,
    RegisterData,
    PasswordChangeData,
    EmailChangeData,
    GoogleAuthResponse,
    SessionStatus,
    BaseAuthResponse,
    TwoFactorAuthResponse,
    User,
    PermissionLevel,
    AuthServiceType,
    PasswordResetConfirm
} from '../../types/auth-types';
import { handleAuthError } from '../../utils/error-handler';
import AuthenticationService from './authentication-service';

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

    private handleAuthResponse<T extends AuthResponse>(response: T): T {
        TokenService.setTokens({
            access: response.access,
            refresh: response.refresh
        });
        return response;
    }

    private determineAdminStatus(user: User): boolean {
        return user.meta?.custom?.permissionLevel === PermissionLevel.Admin;
    }

    public async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
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
                user: data.user,
                isMember: data.user.is_member,
                isAdmin: this.determineAdminStatus(data.user)
            }));
            
            return data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async socialAuth(provider: AuthProvider, accessToken: string): Promise<AuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());
            
            await this.authManager.handleOAuthLogin(provider, accessToken);
            
            const { data } = await authAPI.socialAuth(provider, accessToken);
            this.handleAuthResponse(data);
            
            this.dispatch(login({
                user: data.user,
                isMember: data.user.is_member,
                isAdmin: this.determineAdminStatus(data.user)
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
            if (!data.provider || !data.provider_id) {
                throw new Error('Invalid Google auth response');
            }
            
            this.handleAuthResponse(data);
            
            this.dispatch(login({
                user: data.user,
                isMember: data.user.is_member,
                isAdmin: this.determineAdminStatus(data.user)
            }));
            
            return {
                ...data,
                provider: 'google' as const,
                provider_id: data.provider_id
            };
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async registerUser(data: RegisterData): Promise<AuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'register', isLoading: true }));
            const response = await authAPI.register(data);
            return response.data;
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

    public async changePassword(data: PasswordChangeData): Promise<BaseAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordChange', isLoading: true }));
            const response = await authAPI.changePassword(data);
            return response.data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordChange', isLoading: false }));
        }
    }

    public async changeEmail(data: EmailChangeData): Promise<BaseAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'emailChange', isLoading: true }));
            const response = await authAPI.changeEmail(data);
            return response.data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'emailChange', isLoading: false }));
        }
    }

    public async enableTwoFactor(): Promise<TwoFactorAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: true }));
            const response = await authAPI.twoFactor.enable();
            return response.data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: false }));
        }
    }

    public async disableTwoFactor(): Promise<BaseAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'twoFactor', isLoading: true }));
            const response = await authAPI.twoFactor.disable();
            return response.data;
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

    public async requestPasswordReset(email: string): Promise<BaseAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: true }));
            const response = await authAPI.requestPasswordReset(email);
            return response.data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: false }));
        }
    }

    public async confirmPasswordReset(data: PasswordResetConfirm): Promise<BaseAuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: true }));
            const response = await authAPI.confirmPasswordReset(data);
            return response.data;
        } catch (error) {
            handleAuthError(error, this.dispatch);
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'passwordReset', isLoading: false }));
        }
    }
}

export default AuthService;
