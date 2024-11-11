import { store } from '../../store/store';
import { setError } from '../../store/auth-slice';

interface RateLimitConfig {
    maxAttempts: number;
    timeWindow: number; // in milliseconds
    cooldownPeriod: number; // in milliseconds
}

interface RateLimitEntry {
    attempts: number;
    firstAttempt: number;
    lastAttempt: number;
    blocked?: boolean;
    cooldownEnd?: number;
}

class RateLimitService {
    private static instance: RateLimitService;
    private limits: Map<string, RateLimitEntry>;
    private config: RateLimitConfig;

    private readonly DEFAULT_CONFIG: RateLimitConfig = {
        maxAttempts: 5,
        timeWindow: 5 * 60 * 1000, // 5 minutes
        cooldownPeriod: 15 * 60 * 1000 // 15 minutes
    };

    private constructor(config?: Partial<RateLimitConfig>) {
        this.config = { ...this.DEFAULT_CONFIG, ...config };
        this.limits = new Map();
        this.cleanupExpiredEntries();
    }

    static getInstance(config?: Partial<RateLimitConfig>): RateLimitService {
        if (!RateLimitService.instance) {
            RateLimitService.instance = new RateLimitService(config);
        }
        return RateLimitService.instance;
    }

    public checkLimit(actionKey: string): boolean {
        const entry = this.limits.get(actionKey) || this.createEntry();
        const now = Date.now();

        // Check if in cooldown
        if (entry.blocked && entry.cooldownEnd && now < entry.cooldownEnd) {
            const remainingCooldown = Math.ceil((entry.cooldownEnd - now) / 1000);
            store.dispatch(setError(`Too many attempts. Please try again in ${remainingCooldown} seconds`));
            return false;
        }

        // Reset if time window has passed
        if (now - entry.firstAttempt > this.config.timeWindow) {
            this.limits.set(actionKey, this.createEntry());
            return true;
        }

        // Increment attempts
        entry.attempts++;
        entry.lastAttempt = now;

        // Check if max attempts exceeded
        if (entry.attempts > this.config.maxAttempts) {
            entry.blocked = true;
            entry.cooldownEnd = now + this.config.cooldownPeriod;
            this.limits.set(actionKey, entry);
            
            const cooldownMinutes = Math.ceil(this.config.cooldownPeriod / 60000);
            store.dispatch(setError(`Too many attempts. Please try again in ${cooldownMinutes} minutes`));
            return false;
        }

        this.limits.set(actionKey, entry);
        return true;
    }

    private createEntry(): RateLimitEntry {
        return {
            attempts: 1,
            firstAttempt: Date.now(),
            lastAttempt: Date.now()
        };
    }

    private cleanupExpiredEntries(): void {
        setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.limits.entries()) {
                if (entry.cooldownEnd && now > entry.cooldownEnd) {
                    this.limits.delete(key);
                }
            }
        }, this.config.timeWindow);
    }

    public getRemainingAttempts(actionKey: string): number {
        const entry = this.limits.get(actionKey);
        if (!entry) return this.config.maxAttempts;
        return Math.max(0, this.config.maxAttempts - entry.attempts);
    }

    public getCooldownTime(actionKey: string): number | null {
        const entry = this.limits.get(actionKey);
        if (!entry?.cooldownEnd) return null;
        return Math.max(0, entry.cooldownEnd - Date.now());
    }

    public resetLimit(actionKey: string): void {
        this.limits.delete(actionKey);
    }

    public updateConfig(newConfig: Partial<RateLimitConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

export default RateLimitService; 