import { AuthState } from '../../types/auth-types';
import TokenService from '../tokens/tokenService';
import { store } from '../../store/store';
import { logout, setError } from '../../store/auth-slice';

interface SyncMessage {
    type: 'login' | 'logout' | 'refresh' | 'timeout';
    timestamp: number;
    data?: {
        tokens?: {
            access: string;
            refresh?: string;
        };
        authState?: AuthState;
    };
}

class SessionSyncService {
    private static instance: SessionSyncService;
    private channel: BroadcastChannel;
    private readonly CHANNEL_NAME = 'auth_sync_channel';

    private constructor() {
        this.channel = new BroadcastChannel(this.CHANNEL_NAME);
        this.initializeListeners();
        this.initializeStorageListener();
    }

    static getInstance(): SessionSyncService {
        if (!SessionSyncService.instance) {
            SessionSyncService.instance = new SessionSyncService();
        }
        return SessionSyncService.instance;
    }

    private initializeListeners(): void {
        // Listen for broadcast messages
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
            this.handleSyncMessage(event.data);
        };

        // Handle channel errors
        this.channel.onmessageerror = (error) => {
            console.error('Sync channel error:', error);
            store.dispatch(setError('Session sync error occurred'));
        };
    }

    private initializeStorageListener(): void {
        // Fallback for older browsers
        window.addEventListener('storage', (event) => {
            if (event.key === 'accessToken' || event.key === 'refreshToken') {
                this.handleStorageChange(event);
            }
        });
    }

    private handleSyncMessage(message: SyncMessage): void {
        switch (message.type) {
            case 'login':
                if (message.data?.tokens) {
                    TokenService.setTokens(message.data.tokens);
                }
                break;

            case 'logout':
                TokenService.clearTokens();
                store.dispatch(logout());
                break;

            case 'refresh':
                if (message.data?.tokens?.access) {
                    TokenService.setTokens({ access: message.data.tokens.access });
                }
                break;

            case 'timeout':
                this.handleSessionTimeout();
                break;
        }
    }

    private handleStorageChange(event: StorageEvent): void {
        // Handle token changes from other tabs
        if (event.key === 'accessToken' && event.newValue === null) {
            store.dispatch(logout());
        }
    }

    private handleSessionTimeout(): void {
        TokenService.clearTokens();
        store.dispatch(logout());
        store.dispatch(setError('Session timed out'));
    }

    // Public methods for broadcasting events
    broadcastLogin(tokens: { access: string; refresh?: string }): void {
        this.channel.postMessage({
            type: 'login',
            timestamp: Date.now(),
            data: { tokens }
        });
    }

    broadcastLogout(): void {
        this.channel.postMessage({
            type: 'logout',
            timestamp: Date.now()
        });
    }

    broadcastTokenRefresh(access: string): void {
        this.channel.postMessage({
            type: 'refresh',
            timestamp: Date.now(),
            data: { tokens: { access } }
        });
    }

    broadcastTimeout(): void {
        this.channel.postMessage({
            type: 'timeout',
            timestamp: Date.now()
        });
    }

    // Cleanup method
    destroy(): void {
        this.channel.close();
    }
}

export default SessionSyncService; 