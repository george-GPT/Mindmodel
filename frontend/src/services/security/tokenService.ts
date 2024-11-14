import { TokenPair } from '@/types/auth';

class TokenService {
  private readonly TOKEN_KEY = 'auth_tokens';

  public getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.access || null;
  }

  public getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refresh || null;
  }

  public setTokens(tokens: TokenPair): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
  }

  public clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public async refreshAccessToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    // Implement refresh logic here
  }

  private getTokens(): TokenPair | null {
    const tokens = localStorage.getItem(this.TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }
}

// Export singleton instance
export const tokenService = new TokenService();

// Export class for type usage
export type { TokenService };

// Add default export for backward compatibility
export default TokenService; 