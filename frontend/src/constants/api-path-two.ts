export const API_PATHS = {
    AUTH: {
        BASE: '/api/users',
        LOGIN: '/api/users/auth/login',
        REGISTER: '/api/users/auth/register',
        REFRESH: '/api/users/auth/refresh',
        SOCIAL_AUTH: '/api/users/auth/social-auth'
    },
    GAMES: {
        BASE: '/api/games',
        SCORES: '/api/games/scores',
        CONFIG: '/api/games/config',
        PROGRESS: '/api/games/progress',
        DETAIL: (id: string) => `/api/games/${id}`
    },
    SURVEYS: {
        BASE: '/api/surveys',
        RESPONSES: '/api/surveys/responses',
        DETAIL: (id: number) => `/api/surveys/${id}`
    },
    AI: {
        BASE: '/api/ai',
        GENERATE: '/api/ai/generate-analysis',
        ANALYSIS: (id: number) => `/api/ai/analysis/${id}`,
        AGGREGATE: '/api/ai/aggregate'
    }
}; 