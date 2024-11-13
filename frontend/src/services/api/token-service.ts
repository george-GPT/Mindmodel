import type { components } from 'types/api';
import type { TokenResponse } from 'types/auth';
import { authAPI } from './auth-api';
import SessionSyncService from '../session/session-sync-service';
import CryptoJS from 'crypto-js';

type TokenRefreshRequest = components['schemas']['TokenRefreshRequest'];

class TokenService {
    private static refreshPromise: Promise<TokenResponse> | null = null;
    private static sessionSync = SessionSyncService.getInstance();
    private static readonly STORAGE_KEY_PREFIX = 'auth_';
    private static readonly ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key';

    private static encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.ENCRYPTION_KEY).toString();
    }

    private static decrypt(value: string): string {
        const bytes = CryptoJS.AES.decrypt(value, this.ENCRYPTION_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    static getAccessToken(): string | null {
        const token = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}accessToken`);
        return token ? this.decrypt(token) : null;
    }

    static getRefreshToken(): string | null {
        const token = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}refreshToken`);
        return token ? this.decrypt(token) : null;
    }

    static setTokens(tokens: { access: string; refresh?: string }): void {
        localStorage.setItem(`${this.STORAGE_KEY_PREFIX}accessToken`, this.encrypt(tokens.access));
        if (tokens.refresh) {
            localStorage.setItem(`${this.STORAGE_KEY_PREFIX}refreshToken`, this.encrypt(tokens.refresh));
        }
        this.sessionSync.broadcastLogin(tokens);
    }

    static clearTokens(): void {
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}accessToken`);
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}refreshToken`);
        this.sessionSync.broadcastLogout();
    }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const bufferTime = 60; // 60 seconds buffer
            return (payload.exp - bufferTime) * 1000 < Date.now();
        } catch {
            return true;
        }
    }

    static async refreshAccessToken(): Promise<TokenResponse> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                return {
                    success: false,
                    message: 'No refresh token available',
                    data: undefined
                };
            }

            const response = await authAPI.refresh(refreshToken);
            
            // Handle axios response
            const tokenResponse: TokenResponse = response.data;
            
            if (tokenResponse.data?.access) {
                this.setTokens({ access: tokenResponse.data.access });
                this.sessionSync.broadcastTokenRefresh(tokenResponse.data.access);
            }

            return tokenResponse;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Token refresh failed',
                data: undefined
            };
        } finally {
            this.refreshPromise = null;
        }
    }
}

export default TokenService; 