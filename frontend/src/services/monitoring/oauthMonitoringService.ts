import { axiosInstance } from '../api/axiosInstance';
import { API_PATHS } from '../api/apiPaths';
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
        axiosInstance.post<components['schemas']['SuccessResponse']>(
            API_PATHS.MONITORING.OAUTH_EVENT,
            data
        ),

    getOAuthStats: () => 
        axiosInstance.get<OAuthStatsResponse>(
            `/api/monitoring/oauth/stats`
        )
}; 