// Generated API types
export * from './api.d';

// Core type definitions
export * from './error';
export * from './game.d';
export * from '../components/Surveys/surveyApi/survey';
// Export auth types first as it has the extended UserProfile
export * from './auth.d';
// Then export user types, excluding UserProfile to avoid conflict
export type { 
  User,
  UserPreferences,
  // ... other user types except UserProfile
} from './user.d';
export * from './ai.types';

// Note: declarations.d.ts is not exported as it contains
// module declarations that are automatically included