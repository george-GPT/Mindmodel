import type { components } from '../types/api';

// API layer exports
export { axiosInstance } from './api/axiosInstance';
export { API_PATHS } from './api/apiPaths';
export { authApi } from './api/authApi';
export { aiApi } from './api/aiApi';
export { gamesApi } from './api/gamesApi';

// Monitoring exports
export { default as OAuthMonitor } from './monitoring/oauthMonitor';
export { oAuthMonitoringService } from './monitoring/oauthMonitoringService';
export type { OAuthEvent } from './monitoring/oauthMonitor';

// Security service exports
export { tokenService } from './security/tokenService';
export { TokenSecurity } from './security/tokenSecurity';

// Export commonly used types
export type { 
  LoginCredentials,
  AuthResponse,
  TokenResponse 
} from '../types/auth';