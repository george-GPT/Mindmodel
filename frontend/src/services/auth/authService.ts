// src/services/authService.ts

import type { AxiosResponse } from 'axios';
import { authAPI } from '../api/authPath';
import TokenService from '../api/token-service';
import { login, logout, setLoading, clearError } from '../../store/authSlice';
import { store } from '../../store/store';
import type { 
    AuthServiceType,
    LoginCredentials,
    GoogleAuthRequest,
    AuthResponse,
    TokenResponse
} from '../../types/auth';
import AuthenticationService from '../auth/authentication-service';

class AuthServiceImpl implements AuthServiceType {
    private static instance: AuthServiceImpl;
    private authManager: AuthenticationService;
    private dispatch = store.dispatch;

    private constructor() {
        this.authManager = AuthenticationService.getInstance();
    }

    public static getInstance(): AuthServiceImpl {
        if (!AuthServiceImpl.instance) {
            AuthServiceImpl.instance = new AuthServiceImpl();
        }
        return AuthServiceImpl.instance;
    }

    private handleAuthResponse(response: AxiosResponse<TokenResponse>): AuthResponse {
        if (!response.data?.data) {
            throw new Error('Invalid auth response format');
        }

        const { data, success, message } = response.data;
        
        TokenService.setTokens(response.data);

        return {
            success,
            message,
            data: {
                access: data.access,
                refresh: data.refresh,
                user: data.user
            }
        };
    }

    public async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());

            const canProceed = await this.authManager.handleLogin(credentials);
            if (!canProceed) {
                throw new Error('Login preconditions not met');
            }
            
            const response = await authAPI.login(credentials);
            const authResponse = this.handleAuthResponse(response);
            
            if (authResponse.data?.user) {
                this.dispatch(login({
                    user: authResponse.data.user,
                    isMember: authResponse.data.user.is_member,
                    isAdmin: false
                }));
            }
            
            return authResponse;
        } catch (error) {
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
        }
    }

    public async googleLogin(data: GoogleAuthRequest): Promise<AuthResponse> {
        try {
            this.dispatch(setLoading({ type: 'login', isLoading: true }));
            this.dispatch(clearError());
            
            await this.authManager.handleOAuthLogin('google', data.token);
            const response = await authAPI.googleAuth(data.token);
            return this.handleAuthResponse(response);
        } catch (error) {
            throw error;
        } finally {
            this.dispatch(setLoading({ type: 'login', isLoading: false }));
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

    public async validateSession(): Promise<boolean> {
        return this.authManager.validateSession();
    }
}

const authService = AuthServiceImpl.getInstance();
export default authService;
