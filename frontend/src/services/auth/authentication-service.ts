import OAuthMonitoringService from '../monitoring/oauthMonitoring-service';
import RateLimitService from '../security/rateLimit';
import TokenSecurityService from '../security/tokenSecurity';
import TokenService from '../api/token-service';
import type { 
    AuthState,
    AuthProvider,
    AuthResponse,
    LoadingStateType,
    LoginCredentials,
    SessionStatus
} from '../../types/auth';
import SessionSyncService from '../session/session-sync-service';
import ActivityTrackingService from '../session/activityTrackingService';
import PersistenceService from '../session/persistenceService';

class AuthenticationService {
    private static instance: AuthenticationService;
    private sessionSync: SessionSyncService;
    private activityTracker: ActivityTrackingService;
    private persistence: PersistenceService;
    private oauthMonitor: OAuthMonitoringService;
    private rateLimit: RateLimitService;
    private tokenSecurity: TokenSecurityService;

    private constructor() {
        this.sessionSync = SessionSyncService.getInstance();
        this.activityTracker = ActivityTrackingService.getInstance();
        this.persistence = PersistenceService.getInstance();
        this.oauthMonitor = OAuthMonitoringService.getInstance();
        this.rateLimit = RateLimitService.getInstance();
        this.tokenSecurity = TokenSecurityService.getInstance();
    }

    public static getInstance(): AuthenticationService {
        if (!AuthenticationService.instance) {
            AuthenticationService.instance = new AuthenticationService();
        }
        return AuthenticationService.instance;
    }

    public async handleLogin(credentials: LoginCredentials): Promise<boolean> {
        if (!this.rateLimit.checkLoginAttempt(credentials.email)) {
            throw new Error('Rate limit exceeded');
        }

        await this.persistence.clearLoginState();
        return true;
    }

    public async handleOAuthLogin(provider: AuthProvider, token: string): Promise<boolean> {
        if (!this.rateLimit.checkOAuthAttempt()) {
            throw new Error('Rate limit exceeded');
        }

        await this.oauthMonitor.startMonitoring(provider);
        await this.persistence.clearLoginState();
        return true;
    }

    public async handleLogout(): Promise<void> {
        await this.persistence.clearAuthState();
        this.sessionSync.clearSession();
        this.activityTracker.stopTracking();
    }

    public async validateSession(): Promise<boolean> {
        const sessionStatus = await this.sessionSync.checkSession();
        return sessionStatus.isValid;
    }

    public getSessionStatus(): SessionStatus {
        return this.sessionSync.getSessionStatus();
    }
}

export default AuthenticationService; 