import type { components } from './api';

// Use schema types directly
export type UserProfile = components['schemas']['UserProfile'];
export type UserSettings = components['schemas']['UserSettings'];

// Use type instead of interface for extension
export type ExtendedUserSettings = UserSettings & {
    accessibility?: {
        reduced_motion: boolean;
        high_contrast: boolean;
        font_size: 'small' | 'medium' | 'large';
    };
};