import { axiosInstance } from '../api/axiosInstance';
import type { components } from '../../types/api.d';
import { OAuthEvent } from './oauthMonitor';

// Define the expected response types
type SuccessResponse = components['schemas']['BaseResponse'] & {
    data?: unknown;
};

type OAuthStatsResponse = components['schemas']['BaseResponse'] & {
    data: {
        totalEvents: number;
        successRate: number;
        eventsByType: Record<string, number>;
    };
};

export const oAuthMonitoringService = {
    logOAuthEvent: (data: OAuthEvent) => 
        axiosInstance.post<SuccessResponse>(
            `/api/monitoring/oauth/event`,
            data
        ),

    getOAuthStats: () => 
        axiosInstance.get<OAuthStatsResponse>(
            `/api/monitoring/oauth/stats`
        )
}; 