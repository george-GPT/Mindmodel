export interface TokenResponse {
    access: string;
    refresh: string;
    user: UserResponse;
}

export interface UserResponse {
    id: number;
    email: string;
    username: string;
    is_member: boolean;
    is_verified: boolean;
    profile_complete: boolean;
    meta?: any;
    member_profile?: MemberProfileResponse;
    created_at: string;
    updated_at: string;
}

export interface MemberProfileResponse {
    bio: string;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    password2: string;
}

export interface SocialAuthData {
    token: string;
    provider: 'google' | 'apple';
}

export interface PasswordChangeData {
    old_password: string;
    new_password: string;
}

export interface EmailChangeData {
    new_email: string;
    password: string;
} 