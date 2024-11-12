import TokenService from '../api/token-service';
import { AuthState } from '../../types/auth.types';

interface PersistenceConfig {
    storage: 'local' | 'session';
    secure: boolean;
    expirationDays?: number;
}

const DEFAULT_CONFIG: PersistenceConfig = {
    storage: 'session',
    secure: true,
    expirationDays: 30
};

class PersistenceService {
    private static instance: PersistenceService;
    private config: PersistenceConfig;
    private readonly STORAGE_KEY = 'auth_persistence';
    private readonly REMEMBER_KEY = 'remember_me';

    private constructor(config: PersistenceConfig = DEFAULT_CONFIG) {
        this.config = config;
    }

    static getInstance(config?: PersistenceConfig): PersistenceService {
        if (!PersistenceService.instance) {
            PersistenceService.instance = new PersistenceService(config);
        }
        return PersistenceService.instance;
    }

    public setPersistence(rememberMe: boolean): void {
        this.config.storage = rememberMe ? 'local' : 'session';
        localStorage.setItem(this.REMEMBER_KEY, JSON.stringify(rememberMe));
        
        if (!rememberMe) {
            // Clear persistent storage when remember me is disabled
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Move tokens to session storage if they exist
            const accessToken = TokenService.getAccessToken();
            const refreshToken = TokenService.getRefreshToken();
            if (accessToken) sessionStorage.setItem('accessToken', accessToken);
            if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);
        }
    }

    public saveAuthState(state: Partial<AuthState>): void {
        const storage = this.getStorage();
        const expirationDate = this.config.expirationDays 
            ? new Date(Date.now() + this.config.expirationDays * 24 * 60 * 60 * 1000)
            : null;

        const persistedState = {
            ...state,
            timestamp: Date.now(),
            expiration: expirationDate?.getTime()
        };

        storage.setItem(this.STORAGE_KEY, JSON.stringify(persistedState));
    }

    public getAuthState(): Partial<AuthState> | null {
        const storage = this.getStorage();
        const storedState = storage.getItem(this.STORAGE_KEY);

        if (!storedState) return null;

        try {
            const state = JSON.parse(storedState);
            
            // Check expiration
            if (state.expiration && Date.now() > state.expiration) {
                this.clearPersistedState();
                return null;
            }

            return state;
        } catch {
            this.clearPersistedState();
            return null;
        }
    }

    public isRememberMeEnabled(): boolean {
        const remembered = localStorage.getItem(this.REMEMBER_KEY);
        return remembered ? JSON.parse(remembered) : false;
    }

    public async restoreSession(): Promise<boolean> {
        const state = this.getAuthState();
        if (!state) return false;

        try {
            // Attempt to refresh the token first
            await TokenService.refreshAccessToken();
            return true;
        } catch {
            this.clearPersistedState();
            return false;
        }
    }

    private getStorage(): Storage {
        return this.config.storage === 'local' ? localStorage : sessionStorage;
    }

    public clearPersistedState(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        sessionStorage.removeItem(this.STORAGE_KEY);
    }

    public migrateStorage(from: 'local' | 'session', to: 'local' | 'session'): void {
        const fromStorage = from === 'local' ? localStorage : sessionStorage;
        const toStorage = to === 'local' ? localStorage : sessionStorage;

        const state = fromStorage.getItem(this.STORAGE_KEY);
        if (state) {
            toStorage.setItem(this.STORAGE_KEY, state);
            fromStorage.removeItem(this.STORAGE_KEY);
        }
    }

    public updateConfig(newConfig: Partial<PersistenceConfig>): void {
        const oldStorage = this.config.storage;
        this.config = { ...this.config, ...newConfig };

        if (oldStorage !== this.config.storage) {
            this.migrateStorage(oldStorage, this.config.storage);
        }
    }
}

export default PersistenceService; 