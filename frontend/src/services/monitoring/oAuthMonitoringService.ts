import { captureException } from '@sentry/react';
import * as Sentry from '@sentry/react';
import { store } from '../../store/store';
import { setError } from '../../store/auth-slice';

interface OAuthMetrics {
    provider: 'google';
    startTime: number;
    endTime: number;
    duration: number;
    status: 'success' | 'failure';
    errorDetails?: string;
    retryCount?: number;
}

interface OAuthEvent {
    type: 'init' | 'success' | 'failure' | 'retry';
    provider: 'google';
    timestamp: number;
    metadata?: Record<string, any>;
}

class OAuthMonitoringService {
    private static instance: OAuthMonitoringService;
    private metrics: Map<string, OAuthMetrics>;
    private events: OAuthEvent[];
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 1000;

    private constructor() {
        this.metrics = new Map();
        this.events = [];
    }

    static getInstance(): OAuthMonitoringService {
        if (!OAuthMonitoringService.instance) {
            OAuthMonitoringService.instance = new OAuthMonitoringService();
        }
        return OAuthMonitoringService.instance;
    }

    public startOAuthFlow(provider: 'google', sessionId: string): void {
        Sentry.startSpan(
            {
                op: 'oauth.flow',
                name: `OAuth ${provider} Authentication`
            },
            (span) => {
                this.metrics.set(sessionId, {
                    provider,
                    startTime: Date.now(),
                    endTime: 0,
                    duration: 0,
                    status: 'success',
                    retryCount: 0
                });

                this.logEvent({
                    type: 'init',
                    provider,
                    timestamp: Date.now(),
                    metadata: { 
                        sessionId,
                        spanId: span?.spanContext()?.spanId
                    }
                });
            }
        );
    }

    public trackSuccess(sessionId: string, metadata?: Record<string, any>): void {
        const metric = this.metrics.get(sessionId);
        if (!metric) return;

        const endTime = Date.now();
        const duration = endTime - metric.startTime;

        this.metrics.set(sessionId, {
            ...metric,
            endTime,
            duration,
            status: 'success'
        });

        this.logEvent({
            type: 'success',
            provider: metric.provider,
            timestamp: endTime,
            metadata: { ...metadata, duration, sessionId }
        });

        // Log performance metrics
        if (duration > 5000) { // Flag slow authentications
            console.warn(`Slow OAuth authentication: ${duration}ms`);
        }
    }

    public async trackFailure(
        sessionId: string, 
        error: Error, 
        metadata?: Record<string, any>
    ): Promise<boolean> {
        const metric = this.metrics.get(sessionId);
        if (!metric) return false;

        const endTime = Date.now();
        const duration = endTime - metric.startTime;
        const retryCount = (metric.retryCount || 0) + 1;

        // Update metrics
        this.metrics.set(sessionId, {
            ...metric,
            endTime,
            duration,
            status: 'failure',
            errorDetails: error.message,
            retryCount
        });

        this.logEvent({
            type: 'failure',
            provider: metric.provider,
            timestamp: endTime,
            metadata: { 
                ...metadata, 
                error: error.message, 
                duration,
                sessionId,
                retryCount 
            }
        });

        // Capture error in Sentry
        captureException(error, {
            extra: {
                oauthProvider: metric.provider,
                duration,
                retryCount,
                ...metadata
            }
        });

        // Handle retry logic
        if (retryCount < this.MAX_RETRIES) {
            await this.handleRetry(sessionId, retryCount);
            return true;
        }

        store.dispatch(setError('OAuth authentication failed after multiple attempts'));
        return false;
    }

    private async handleRetry(sessionId: string, retryCount: number): Promise<void> {
        const delay = this.RETRY_DELAY * Math.pow(2, retryCount - 1);
        
        this.logEvent({
            type: 'retry',
            provider: this.metrics.get(sessionId)!.provider,
            timestamp: Date.now(),
            metadata: { sessionId, retryCount, delay }
        });

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    private logEvent(event: OAuthEvent): void {
        this.events.push(event);
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('OAuth Event:', event);
        }
    }

    public getMetrics(sessionId: string): OAuthMetrics | undefined {
        return this.metrics.get(sessionId);
    }

    public getEvents(sessionId: string): OAuthEvent[] {
        return this.events.filter(event => 
            event.metadata?.sessionId === sessionId
        );
    }

    public clearMetrics(sessionId: string): void {
        this.metrics.delete(sessionId);
        this.events = this.events.filter(event => 
            event.metadata?.sessionId !== sessionId
        );
    }
}

export default OAuthMonitoringService; 