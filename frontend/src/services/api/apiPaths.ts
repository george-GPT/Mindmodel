export const API_PATHS = {
    AUTH: {
        BASE: '/api/users/auth',
        LOGIN: '/api/users/auth/login/',
        REGISTER: '/api/users/auth/register/',
        LOGOUT: '/api/users/auth/logout/',
        REFRESH: '/api/users/auth/refresh/',
        GOOGLE_AUTH: '/api/users/auth/google/',
        VERIFY_EMAIL: '/api/users/auth/verify-email/',
        RESEND_VERIFICATION: '/api/users/auth/resend-verification/',
        CHANGE_PASSWORD: '/api/users/auth/change-password/',
        CHANGE_EMAIL: '/api/users/auth/change-email/',
        PROFILE: '/api/users/auth/profile/',
        TWO_FACTOR: {
            ENABLE: '/api/users/auth/2fa/enable',
            DISABLE: '/api/users/auth/2fa/disable'
        }
    },
    GAMES: {
        BASE: '/api/games',
        SCORES: '/api/games/scores',
        CONFIG: '/api/games/config',
        PROGRESS: '/api/games/progress',
        DETAIL: (id: string) => `/api/games/${id}`,
        RECORD_SCORE: (id: string) => `/api/games/${id}/record_score`
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
} as const; 