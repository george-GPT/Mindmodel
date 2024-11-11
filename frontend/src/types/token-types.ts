export interface TokenOperations {
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    setTokens(tokens: { access: string; refresh?: string }): void;
    clearTokens(): void;
    refreshAccessToken(): Promise<any>;
    isTokenExpired(token: string): boolean;
} 