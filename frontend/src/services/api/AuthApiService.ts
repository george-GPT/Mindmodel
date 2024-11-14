import { BaseApiService } from '../base/BaseApiService';
import type { 
    LoginCredentials, 
    TokenResponse, 
    GoogleAuthRequest,
    AuthResponse,
    User
} from '@/types';
import { API_PATHS } from './apiPaths';

/**
 * @description Service for handling authentication-related API requests
 * @extends {BaseApiService}
 */
export class AuthApiService extends BaseApiService {
    private static instance: AuthApiService;

    private constructor() {
        super('/auth');  // Base path for auth endpoints
    }

    public static getInstance(): AuthApiService {
        if (!AuthApiService.instance) {
            AuthApiService.instance = new AuthApiService();
        }
        return AuthApiService.instance;
    }

    /**
     * Authenticates user with email/password
     */
    public async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return this.post<AuthResponse>(API_PATHS.AUTH.LOGIN, credentials);
    }

    /**
     * Registers a new user
     */
    public async register(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<AuthResponse> {
        return this.post<AuthResponse>(API_PATHS.AUTH.REGISTER, data);
    }

    /**
     * Logs out the current user
     */
    public async logout(): Promise<void> {
        await this.post(API_PATHS.AUTH.LOGOUT);
    }

    /**
     * Authenticates user with Google token
     */
    public async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
        return this.post<AuthResponse>(API_PATHS.AUTH.GOOGLE_AUTH, data);
    }

    /**
     * Verifies user's email
     */
    public async verifyEmail(token: string): Promise<void> {
        await this.post(API_PATHS.AUTH.VERIFY_EMAIL, { token });
    }

    /**
     * Resends verification email
     */
    public async resendVerification(email: string): Promise<void> {
        await this.post(API_PATHS.AUTH.RESEND_VERIFICATION, { email });
    }

    /**
     * Changes user's password
     */
    public async changePassword(data: {
        old_password: string;
        new_password: string;
    }): Promise<void> {
        await this.post(API_PATHS.AUTH.CHANGE_PASSWORD, data);
    }

    /**
     * Changes user's email
     */
    public async changeEmail(data: {
        new_email: string;
        password: string;
    }): Promise<void> {
        await this.post(API_PATHS.AUTH.CHANGE_EMAIL, data);
    }

    /**
     * Gets user profile
     */
    public async getProfile(): Promise<User> {
        return this.get<User>(API_PATHS.AUTH.PROFILE);
    }

    /**
     * Updates user profile
     */
    public async updateProfile(data: Partial<User>): Promise<User> {
        return this.patch<User>(API_PATHS.AUTH.PROFILE, data);
    }

    /**
     * Refreshes access token
     */
    public async refreshToken(refreshToken: string): Promise<TokenResponse> {
        return this.post<TokenResponse>(API_PATHS.AUTH.REFRESH, { refresh: refreshToken });
    }
}

// Export singleton instance
export const authAPI = AuthApiService.getInstance(); 