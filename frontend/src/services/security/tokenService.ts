import type { TokenResponse } from '@/types/auth';
import type { SuccessResponse } from '@/types/api';
import { authAPI } from '@/services/api/authApi';
import { handleError } from '@/utils/errorHandler';
import CryptoJS from 'crypto-js';

class TokenService {
    private static refreshPromise: Promise<TokenResponse> | null = null;
    private static readonly STORAGE_KEY_PREFIX = 'auth_';
    private static readonly ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';

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

    static setTokens(tokenResponse: TokenResponse): void {
        if (!tokenResponse.data?.access) {
            throw new Error('Invalid token response');
        }
        
        localStorage.setItem(
            `${this.STORAGE_KEY_PREFIX}accessToken`, 
            this.encrypt(tokenResponse.data.access)
        );
        
        if (tokenResponse.data.refresh) {
            localStorage.setItem(
                `${this.STORAGE_KEY_PREFIX}refreshToken`, 
                this.encrypt(tokenResponse.data.refresh)
            );
        }
    }

    static clearTokens(): void {
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}accessToken`);
        localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}refreshToken`);
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
                    data: {
                        access: '',
                        refresh: '',
                        user: null as any // We don't have user data during refresh
                    }
                };
            }

            const response = await authAPI.refresh(refreshToken);
            const tokenResponse = response.data;
            
            if (tokenResponse.data?.access) {
                this.setTokens(tokenResponse);
            }

            return tokenResponse;
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Token refresh failed',
                data: {
                    access: '',
                    refresh: '',
                    user: null as any // We don't have user data during refresh
                }
            };
        } finally {
            this.refreshPromise = null;
        }
    }
}

export default TokenService; 