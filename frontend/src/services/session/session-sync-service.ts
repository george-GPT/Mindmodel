import type { SessionStatus } from '../../types/auth';

class SessionSyncService {
    private static instance: SessionSyncService;

    public static getInstance(): SessionSyncService {
        if (!SessionSyncService.instance) {
            SessionSyncService.instance = new SessionSyncService();
        }
        return SessionSyncService.instance;
    }

    public async checkSession(): Promise<SessionStatus> {
        return {
            isValid: true,
            remainingTime: 3600,
            warningIssued: false
        };
    }

    public getSessionStatus(): SessionStatus {
        return {
            isValid: true,
            remainingTime: 3600,
            warningIssued: false
        };
    }

    public clearSession(): void {
        // Implement session clearing logic
    }

    public broadcastLogin(tokens: { access: string; refresh: string }): void {
        // Implement login broadcast logic
    }

    public broadcastLogout(): void {
        // Implement logout broadcast logic
    }

    public broadcastTokenRefresh(token: string): void {
        // Implement token refresh broadcast logic
    }
}

export default SessionSyncService; 