import { store } from '../../store/store';
import { setError } from '../../store/authSlice';
import TokenService from '../api/token-service';
import SessionSyncService from './session-sync-service';

interface ActivityConfig {
    warningTime: number;    // Time before warning in ms
    logoutTime: number;     // Time before auto-logout in ms
    minThreshold: number;   // Minimum time between activity checks
}

const DEFAULT_CONFIG: ActivityConfig = {
    warningTime: 14 * 60 * 1000,    // 14 minutes
    logoutTime: 15 * 60 * 1000,     // 15 minutes
    minThreshold: 1000              // 1 second
};

class ActivityTrackingService {
    public static getInstance(): ActivityTrackingService {
        return new ActivityTrackingService();
    }

    public stopTracking(): void {
        // Implement tracking stop logic
    }
}

export default ActivityTrackingService; 