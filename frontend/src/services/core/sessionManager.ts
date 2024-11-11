import ActivityTrackingService from '../session/activityTrackingService';
import PersistenceService from '../session/persistenceService';
import SessionSyncService from '../session/sessionSyncService';
import TokenSecurityService from '../security/tokenSecurityService';
import RateLimitService from '../security/rateLimitService';
import OAuthMonitoringService from '../monitoring/oAuthMonitoringService';
import { AuthServiceType, LoginCredentials, SessionStatus } from '../../types/auth-types';

interface SessionConfig {
    activityTimeout?: number;
    rememberMe?: boolean;
    rateLimit?: {
        maxAttempts: number;
        timeWindow: number;
    };
    authService: AuthServiceType;
}

class SessionManager {
    private static instance: SessionManager;
    private readonly activityTracker: ActivityTrackingService;
    private readonly persistence: PersistenceService;
    private readonly sessionSync: SessionSyncService;
    private readonly tokenSecurity: TokenSecurityService;
    private readonly rateLimit: RateLimitService;
    private readonly oAuthMonitor: OAuthMonitoringService;
    private readonly authService: AuthServiceType;

    private constructor(config: SessionConfig) {
        this.authService = config.authService;
        this.activityTracker = ActivityTrackingService.getInstance();
        this.persistence = PersistenceService.getInstance();
        this.sessionSync = SessionSyncService.getInstance();
        this.tokenSecurity = TokenSecurityService.getInstance();
        this.rateLimit = RateLimitService.getInstance();
        this.oAuthMonitor = OAuthMonitoringService.getInstance();

        if (config.activityTimeout) {
            this.activityTracker.updateConfig({
                logoutTime: config.activityTimeout
            });
        }

        if (config.rateLimit) {
            this.rateLimit.updateConfig(config.rateLimit);
        }
    }

    static getInstance(config: SessionConfig): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager(config);
        }
        return SessionManager.instance;
    }

    public async validateSession(): Promise<boolean> {
        return this.authService.validateSession();
    }

    public async handleLogin(credentials: LoginCredentials): Promise<boolean> {
        if (!this.rateLimit.checkLimit('login')) {
            return false;
        }

        try {
            await this.authService.loginUser(credentials);
            this.persistence.setPersistence(!!credentials.rememberMe);
            this.activityTracker.resetActivity();
            return true;
        } catch (error) {
            this.rateLimit.resetLimit('login');
            throw error;
        }
    }

    public async handleOAuthLogin(provider: 'google', token: string): Promise<void> {
        try {
            await this.authService.socialAuth(provider, token);
            this.activityTracker.resetActivity();
        } catch (error) {
            throw error;
        }
    }

    public async handleLogout(): Promise<void> {
        try {
            await this.authService.logout();
        } finally {
            this.persistence.clearPersistedState();
            this.sessionSync.broadcastLogout();
            this.activityTracker.destroy();
            this.rateLimit.resetLimit('login');
        }
    }

    public getSessionStatus(): SessionStatus {
        return this.authService.getSessionStatus();
    }

    public cleanup(): void {
        this.activityTracker.destroy();
        this.sessionSync.destroy();
    }
}

export default SessionManager; 