import type { AuthProvider } from '../../types/auth';

class OAuthMonitoringService {
    public static getInstance(): OAuthMonitoringService {
        return new OAuthMonitoringService();
    }

    public async startMonitoring(provider: AuthProvider): Promise<void> {
        // Implement OAuth monitoring logic
    }
}

export default OAuthMonitoringService; 