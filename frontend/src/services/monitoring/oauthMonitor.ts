import { captureException } from '@sentry/react';

export interface OAuthEvent {
    provider: 'google';
    status: 'initiated' | 'success' | 'failed';
    error?: string;
    duration?: number;
}

class OAuthMonitor {
    private static startTime: number;

    static trackStart() {
        this.startTime = performance.now();
    }

    static trackEvent(event: OAuthEvent) {
        if (this.startTime) {
            event.duration = performance.now() - this.startTime;
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('OAuth Event:', event);
        }

        // Track in Sentry
        if (event.status === 'failed') {
            captureException(new Error(`OAuth ${event.provider} failed: ${event.error}`), {
                extra: {
                    provider: event.provider,
                    status: event.status,
                    error: event.error,
                    duration: event.duration
                }
            });
        }

        // Reset timer
        this.startTime = 0;
    }
}

export default OAuthMonitor; 