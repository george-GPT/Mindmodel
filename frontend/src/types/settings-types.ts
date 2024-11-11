export interface UserSettings {
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        survey_reminders: boolean;
        game_reminders: boolean;
    };
    privacy: {
        show_progress: boolean;
        share_results: boolean;
        public_profile: boolean;
    };
    theme: {
        mode: 'light' | 'dark' | 'system';
        color: string;
    };
    accessibility: {
        reduced_motion: boolean;
        high_contrast: boolean;
        font_size: 'small' | 'medium' | 'large';
    };
}

export interface ProfileData {
    username: string;
    email: string;
    profile_picture?: string;
    bio?: string;
    joined_date: string;
    is_member: boolean;
} 