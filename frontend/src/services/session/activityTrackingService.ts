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
    private static instance: ActivityTrackingService;
    private lastActivity: number;
    private warningTimer: NodeJS.Timeout | null = null;
    private logoutTimer: NodeJS.Timeout | null = null;
    private config: ActivityConfig;
    private sessionSync: SessionSyncService;
    private isWarningShown: boolean = false;

    private constructor(config: ActivityConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.lastActivity = Date.now();
        this.sessionSync = SessionSyncService.getInstance();
        this.setupActivityListeners();
        this.initializeTimers();
    }

    static getInstance(config?: ActivityConfig): ActivityTrackingService {
        if (!ActivityTrackingService.instance) {
            ActivityTrackingService.instance = new ActivityTrackingService(config);
        }
        return ActivityTrackingService.instance;
    }

    private setupActivityListeners(): void {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        
        const handleActivity = this.debounce(() => {
            this.updateActivity();
        }, this.config.minThreshold);

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Track API calls through axios interceptors
        const axiosInstance = require('../api/axios').default;
        axiosInstance.interceptors.request.use((config: any) => {
            this.updateActivity();
            return config;
        });
    }

    private initializeTimers(): void {
        this.resetTimers();
    }

    private resetTimers(): void {
        if (this.warningTimer) clearTimeout(this.warningTimer);
        if (this.logoutTimer) clearTimeout(this.logoutTimer);

        this.warningTimer = setTimeout(() => {
            this.showWarning();
        }, this.config.warningTime);

        this.logoutTimer = setTimeout(() => {
            this.handleInactiveLogout();
        }, this.config.logoutTime);
    }

    private updateActivity(): void {
        this.lastActivity = Date.now();
        if (this.isWarningShown) {
            this.hideWarning();
        }
        this.resetTimers();
    }

    private showWarning(): void {
        this.isWarningShown = true;
        // Dispatch warning to Redux store
        store.dispatch(setError('Session will expire soon due to inactivity'));
        
        // You can implement a custom warning UI component here
        const timeLeft = Math.floor((this.config.logoutTime - this.config.warningTime) / 1000);
        console.warn(`Session will expire in ${timeLeft} seconds`);
    }

    private hideWarning(): void {
        this.isWarningShown = false;
        // Clear warning from Redux store if needed
    }

    private handleInactiveLogout(): void {
        TokenService.clearTokens();
        this.sessionSync.broadcastTimeout();
        window.location.href = '/login?reason=timeout';
    }

    private debounce(func: Function, wait: number): (...args: any[]) => void {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Public methods
    public resetActivity(): void {
        this.updateActivity();
    }

    public destroy(): void {
        if (this.warningTimer) clearTimeout(this.warningTimer);
        if (this.logoutTimer) clearTimeout(this.logoutTimer);
    }

    public getLastActivity(): number {
        return this.lastActivity;
    }

    public updateConfig(newConfig: Partial<ActivityConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.resetTimers();
    }

    public isInactive(): boolean {
        return Date.now() - this.lastActivity > this.config.logoutTime;
    }

    public getTimeUntilExpiry(): number {
        return Math.max(0, this.config.logoutTime - (Date.now() - this.lastActivity));
    }

    public hasWarningBeenIssued(): boolean {
        return this.isWarningShown;
    }
}

export default ActivityTrackingService; 