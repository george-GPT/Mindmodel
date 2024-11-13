import type { components } from 'types/api';

// Use schema types directly
export type UserProfile = components['schemas']['UserProfile'];
export type UserSettings = components['schemas']['UserSettings'];

// Frontend-only extensions
export interface ExtendedUserSettings extends components['schemas']['UserSettings'] {
    accessibility?: {
        reduced_motion: boolean;
        high_contrast: boolean;
        font_size: 'small' | 'medium' | 'large';
    };
}