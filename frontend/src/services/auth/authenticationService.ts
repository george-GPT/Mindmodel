import { store } from '../../store/store';
import { setError } from '../../store/auth-slice';
import TokenService from '../tokens/tokenService';
import SessionSyncService from '../session/sessionSyncService';
import ActivityTrackingService from '../session/activityTrackingService';
import PersistenceService from '../session/persistenceService';
import OAuthMonitoringService from '../monitoring/oAuthMonitoringService';
import RateLimitService from '../security/rateLimitService';
import TokenSecurityService from '../security/tokenSecurityService';
import { 
    SessionStatus, 
    AuthResponse, 
    LoginCredentials 
} from '../../types/auth-types';

class AuthenticationService {
    private static instance: AuthenticationService;
    private sessionSync: SessionSyncService;
    private activityTracker: ActivityTrackingService;
    private persistence: PersistenceService;
    private oAuthMonitor: OAuthMonitoringService;
    private rateLimit: RateLimitService;
    private tokenSecurity: TokenSecurityService;

    private constructor() {
        this.sessionSync = SessionSyncService.getInstance();
        this.activityTracker = ActivityTrackingService.getInstance();
        this.persistence = PersistenceService.getInstance();
        this.oAuthMonitor = OAuthMonitoringService.getInstance();
        this.rateLimit = RateLimitService.getInstance();
        this.tokenSecurity = TokenSecurityService.getInstance();
    }

    static getInstance(): AuthenticationService {
        if (!AuthenticationService.instance) {
            AuthenticationService.instance = new AuthenticationService();
        }
        return AuthenticationService.instance;
    }

    public async initializeAuth(rememberMe: boolean = false): Promise<void> {
        this.persistence.setPersistence(rememberMe);
        if (rememberMe) {
            await this.persistence.restoreSession();
        }
    }

    public async validateSession(): Promise<boolean> {
        try {
            const token = TokenService.getAccessToken();
            if (!token) return false;

            return this.tokenSecurity.validateAndRefreshToken(token);
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    public async handleLogin(credentials: LoginCredentials): Promise<AuthResponse> {
        if (!this.rateLimit.checkLimit('login')) {
            throw new Error('Rate limit exceeded');
        }

        this.activityTracker.resetActivity();
        return {} as AuthResponse; // Placeholder - actual implementation will come from AuthService
    }

    public async handleOAuthLogin(provider: 'google', token: string): Promise<void> {
        await this.oAuthMonitor.startOAuthFlow(provider, token);
        this.activityTracker.resetActivity();
    }

    public handleLogout(): void {
        this.activityTracker.destroy();
        this.persistence.clearPersistedState();
        TokenService.clearTokens();
        this.sessionSync.broadcastLogout();
    }

    public getSessionStatus(): SessionStatus {
        return {
            isValid: !this.activityTracker.isInactive(),
            remainingTime: this.activityTracker.getTimeUntilExpiry(),
            warningIssued: this.activityTracker.hasWarningBeenIssued()
        };
    }

    public cleanup(): void {
        this.activityTracker.destroy();
        this.sessionSync.destroy();
    }
}

export default AuthenticationService; 