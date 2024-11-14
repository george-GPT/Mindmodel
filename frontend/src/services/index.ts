import type { components } from '@/types/api';

// API exports
export { authAPI } from './api/authApi';
export { aiAPI } from './api/aiApi';
export { surveyAPI } from './surveys/surveyApi';
export { gamesAPI } from './games/gamesApi';

// Service exports
export { default as AuthService } from './auth/authService';
export { default as TokenService } from './security/tokenService';

// Type exports from API schema
export type { LoginCredentials } from '@/types/auth';