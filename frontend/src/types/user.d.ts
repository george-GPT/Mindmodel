import type { components } from './api.d';

// Base user type from OpenAPI schema
export type User = components['schemas']['UserProfile'];

// Frontend-specific user preferences
export interface UserPreferences {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
    accessibility: {
        highContrast: boolean;
        fontSize: number;
    };
}

// Re-export other user-related types
export type {
    UserProfile,  // From api.d.ts
    UserSettings  // From api.d.ts
} from './api.d';