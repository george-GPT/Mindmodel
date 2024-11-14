import { store } from '../../store/store';
import { setError } from '../../store/authSlice';
import { ErrorCodes, type ApiError } from '../../types/error';

interface RateLimitConfig {
    maxAttempts: number;
    timeWindow: number; // in milliseconds
    cooldownPeriod: number; // in milliseconds
}

interface RateLimitEntry {
    attempts: number;
    firstAttempt: number;
    lastAttempt: number;
    blocked: boolean;
    cooldownEnd?: number;
}

// Default configurations aligned with security best practices
const DEFAULT_LOGIN_CONFIG: RateLimitConfig = {
    maxAttempts: 5,
    timeWindow: 5 * 60 * 1000, // 5 minutes
    cooldownPeriod: 15 * 60 * 1000 // 15 minutes
};

const DEFAULT_OAUTH_CONFIG: RateLimitConfig = {
    maxAttempts: 3,
    timeWindow: 5 * 60 * 1000, // 5 minutes
    cooldownPeriod: 30 * 60 * 1000 // 30 minutes
};

class RateLimitService {
    private static instance: RateLimitService;
    private loginAttempts: Map<string, RateLimitEntry>;
    private oauthAttempts: RateLimitEntry;

    private constructor() {
        this.loginAttempts = new Map();
        this.oauthAttempts = {
            attempts: 0,
            firstAttempt: 0,
            lastAttempt: 0,
            blocked: false
        };
    }

    public static getInstance(): RateLimitService {
        if (!RateLimitService.instance) {
            RateLimitService.instance = new RateLimitService();
        }
        return RateLimitService.instance;
    }

    public checkLoginAttempt(email: string): boolean {
        const now = Date.now();
        const entry = this.loginAttempts.get(email) || {
            attempts: 0,
            firstAttempt: now,
            lastAttempt: now,
            blocked: false
        };

        // Check if in cooldown period
        if (entry.blocked && entry.cooldownEnd && now < entry.cooldownEnd) {
            this.setRateLimitError('login');
            return false;
        }

        // Reset if outside time window
        if (now - entry.firstAttempt > DEFAULT_LOGIN_CONFIG.timeWindow) {
            entry.attempts = 0;
            entry.firstAttempt = now;
            entry.blocked = false;
            entry.cooldownEnd = undefined;
        }

        entry.attempts++;
        entry.lastAttempt = now;

        if (entry.attempts > DEFAULT_LOGIN_CONFIG.maxAttempts) {
            entry.blocked = true;
            entry.cooldownEnd = now + DEFAULT_LOGIN_CONFIG.cooldownPeriod;
            this.setRateLimitError('login');
            this.loginAttempts.set(email, entry);
            return false;
        }

        this.loginAttempts.set(email, entry);
        return true;
    }

    public checkOAuthAttempt(): boolean {
        const now = Date.now();

        // Check if in cooldown period
        if (this.oauthAttempts.blocked && this.oauthAttempts.cooldownEnd && now < this.oauthAttempts.cooldownEnd) {
            this.setRateLimitError('oauth');
            return false;
        }

        // Reset if outside time window
        if (now - this.oauthAttempts.firstAttempt > DEFAULT_OAUTH_CONFIG.timeWindow) {
            this.oauthAttempts = {
                attempts: 0,
                firstAttempt: now,
                lastAttempt: now,
                blocked: false
            };
        }

        this.oauthAttempts.attempts++;
        this.oauthAttempts.lastAttempt = now;

        if (this.oauthAttempts.attempts > DEFAULT_OAUTH_CONFIG.maxAttempts) {
            this.oauthAttempts.blocked = true;
            this.oauthAttempts.cooldownEnd = now + DEFAULT_OAUTH_CONFIG.cooldownPeriod;
            this.setRateLimitError('oauth');
            return false;
        }

        return true;
    }

    private setRateLimitError(type: 'login' | 'oauth'): void {
        const error: ApiError = {
            success: false,
            message: `Too many ${type} attempts. Please try again later.`,
            error: {
                code: ErrorCodes.RATE_LIMIT_EXCEEDED,
                details: {
                    type,
                    cooldownEnd: type === 'login' 
                        ? DEFAULT_LOGIN_CONFIG.cooldownPeriod 
                        : DEFAULT_OAUTH_CONFIG.cooldownPeriod
                }
            }
        };
        store.dispatch(setError(error.message));
    }
}

export default RateLimitService; 