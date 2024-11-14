import { BaseService } from '../base/BaseService';
import type { TokenResponse } from '@/types';
import { authAPI } from '@/services/api/AuthApiService';

/**
 * @description Service for managing authentication tokens
 * @extends {BaseService}
 */
class TokenService extends BaseService {
    private static instance: TokenService;
    private static readonly STORAGE_KEY_PREFIX = 'auth_';

    private constructor() {
        super();
    }

    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    /**
     * Sets access and refresh tokens in storage
     */
    public setTokens(tokenResponse: TokenResponse): void {
        this.validateRequiredData(tokenResponse.data, 'Invalid token response');
        this.validateRequiredData(tokenResponse.data.access, 'Missing access token');
        this.validateRequiredData(tokenResponse.data.refresh, 'Missing refresh token');
        
        const { access, refresh } = tokenResponse.data;
        
        localStorage.setItem(
            `${TokenService.STORAGE_KEY_PREFIX}accessToken`, 
            access
        );
        
        localStorage.setItem(
            `${TokenService.STORAGE_KEY_PREFIX}refreshToken`, 
            refresh
        );
    }

    /**
     * Gets the current access token
     */
    public getAccessToken(): string | null {
        return localStorage.getItem(`${TokenService.STORAGE_KEY_PREFIX}accessToken`);
    }

    /**
     * Gets the current refresh token
     */
    public getRefreshToken(): string | null {
        return localStorage.getItem(`${TokenService.STORAGE_KEY_PREFIX}refreshToken`);
    }

    /**
     * Clears all tokens from storage
     */
    public clearTokens(): void {
        localStorage.removeItem(`${TokenService.STORAGE_KEY_PREFIX}accessToken`);
        localStorage.removeItem(`${TokenService.STORAGE_KEY_PREFIX}refreshToken`);
    }

    /**
     * Refreshes the access token using the refresh token
     */
    public async refreshAccessToken(): Promise<TokenResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw this.createValidationError('No refresh token available');
        }

        try {
            const response = await authAPI.refreshToken(refreshToken);
            const tokenResponse = this.validateResponse<TokenResponse>(response);
            
            if (tokenResponse.data?.access) {
                this.setTokens(tokenResponse);
            }

            return tokenResponse;
        } catch (error) {
            throw this.handleError(error, 'Token refresh failed');
        }
    }
}

export default TokenService.getInstance(); 