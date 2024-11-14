import { tokenService, type TokenService } from './tokenService';
import { store } from '@/store/store';
import { setError } from '@/store/authSlice';
import type { TokenResponse } from '@/types/auth';

interface TokenSecurityConfig {
    refreshThreshold: number;
    blacklistEnabled: boolean;
    tokenValidityWindow: number;
    maxRefreshAttempts: number;
}

class TokenSecurityService {
    private static instance: TokenSecurityService;
    private blacklistedTokens: Set<string>;
    private refreshAttempts: Map<string, number>;
    private config: TokenSecurityConfig;
    private tokenService: TokenService;

    private readonly DEFAULT_CONFIG: TokenSecurityConfig = {
        refreshThreshold: 5 * 60 * 1000,  // 5 minutes
        blacklistEnabled: true,
        tokenValidityWindow: 30 * 1000,   // 30 seconds
        maxRefreshAttempts: 3
    };

    private constructor(config?: Partial<TokenSecurityConfig>) {
        this.tokenService = tokenService;
        this.config = { ...this.DEFAULT_CONFIG, ...config };
        this.blacklistedTokens = new Set();
        this.refreshAttempts = new Map();
        this.startCleanupInterval();
    }

    static getInstance(config?: Partial<TokenSecurityConfig>): TokenSecurityService {
        if (!TokenSecurityService.instance) {
            TokenSecurityService.instance = new TokenSecurityService(config);
        }
        return TokenSecurityService.instance;
    }

    public async validateAndRefreshToken(token: string): Promise<boolean> {
        if (this.isBlacklisted(token)) {
            store.dispatch(setError('Invalid token detected'));
            return false;
        }

        try {
            const tokenData = this.parseToken(token);
            
            if (!this.isTokenValid(tokenData)) {
                return false;
            }

            if (this.shouldRefreshToken(tokenData)) {
                await this.handleTokenRefresh();
            }

            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    private parseToken(token: string): any {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch {
            throw new Error('Invalid token format');
        }
    }

    private isTokenValid(tokenData: any): boolean {
        const now = Date.now() / 1000;
        const validityWindow = this.config.tokenValidityWindow / 1000;

        // Check if token is within validity window
        if (tokenData.exp < now - validityWindow) {
            store.dispatch(setError('Token has expired'));
            return false;
        }

        if (tokenData.iat > now + validityWindow) {
            store.dispatch(setError('Token issued in the future'));
            return false;
        }

        return true;
    }

    private shouldRefreshToken(tokenData: any): boolean {
        const expiresIn = tokenData.exp * 1000 - Date.now();
        return expiresIn < this.config.refreshThreshold;
    }

    private async handleTokenRefresh(): Promise<void> {
        const currentToken = this.tokenService.getAccessToken();
        if (!currentToken) return;

        const attempts = this.refreshAttempts.get(currentToken) || 0;
        if (attempts >= this.config.maxRefreshAttempts) {
            this.blacklistToken(currentToken);
            store.dispatch(setError('Maximum token refresh attempts exceeded'));
            return;
        }

        try {
            await this.tokenService.refreshAccessToken();
            this.refreshAttempts.delete(currentToken);
        } catch (error) {
            this.refreshAttempts.set(currentToken, attempts + 1);
            throw error;
        }
    }

    public blacklistToken(token: string): void {
        if (this.config.blacklistEnabled) {
            this.blacklistedTokens.add(token);
        }
    }

    private isBlacklisted(token: string): boolean {
        return this.config.blacklistEnabled && this.blacklistedTokens.has(token);
    }

    private startCleanupInterval(): void {
        setInterval(() => {
            this.cleanupBlacklist();
            this.cleanupRefreshAttempts();
        }, 60 * 60 * 1000); // Cleanup every hour
    }

    private cleanupBlacklist(): void {
        for (const token of this.blacklistedTokens) {
            try {
                const tokenData = this.parseToken(token);
                if (tokenData.exp * 1000 < Date.now()) {
                    this.blacklistedTokens.delete(token);
                }
            } catch {
                this.blacklistedTokens.delete(token);
            }
        }
    }

    private cleanupRefreshAttempts(): void {
        for (const [token] of this.refreshAttempts) {
            try {
                const tokenData = this.parseToken(token);
                if (tokenData.exp * 1000 < Date.now()) {
                    this.refreshAttempts.delete(token);
                }
            } catch {
                this.refreshAttempts.delete(token);
            }
        }
    }

    public updateConfig(newConfig: Partial<TokenSecurityConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export the singleton instance
export const TokenSecurity = TokenSecurityService.getInstance();
export default TokenSecurity; 