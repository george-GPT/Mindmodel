interface GoogleUser {
    getAuthResponse(): {
        id_token: string;
    };
}

interface GoogleAuth {
    signIn(): Promise<GoogleUser>;
    signOut(): Promise<void>;
}

interface GoogleAccountsId {
    initialize(config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
    }): void;
    prompt(): void;
    renderButton(element: HTMLElement, config: GoogleButtonConfig): void;
}

interface GoogleCredentialResponse {
    credential: string;
    select_by?: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'btn_add_session' | 'btn_confirm_add_session';
}

interface GoogleButtonConfig {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
    locale?: string;
}

interface Google {
    accounts: {
        id: GoogleAccountsId;
        oauth2: {
            initTokenClient(config: object): void;
        };
    };
}

declare global {
    interface Window {
        google?: Google;
    }
}

export {};

export interface GoogleAuthRequest {
    token: string;
} 