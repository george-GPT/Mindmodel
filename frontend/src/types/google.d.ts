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
        callback: (response: { credential: string }) => void;
    }): void;
    prompt(): void;
    renderButton(element: HTMLElement, config: object): void;
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