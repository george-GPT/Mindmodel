export const API_PATHS = {
    AUTH: {
        BASE: '/api/users/auth',
        LOGIN: '/api/users/auth/login',
        REGISTER: '/api/users/auth/register',
        LOGOUT: '/api/users/auth/logout',
        REFRESH: '/api/users/auth/refresh',
        SOCIAL_AUTH: '/api/users/auth/social-auth',
        CHANGE_PASSWORD: '/api/users/auth/change-password',
        CHANGE_EMAIL: '/api/users/auth/change-email',
        VERIFY_EMAIL: '/api/users/verify-email',
        RESEND_VERIFICATION: '/api/users/resend-verification',
        TWO_FACTOR: {
            ENABLE: '/api/users/auth/2fa/enable',
            DISABLE: '/api/users/auth/2fa/disable'
        }
    }
}; 