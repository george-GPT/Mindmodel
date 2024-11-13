import axios from 'axios';
import { operations, components } from 'types/api';

import {
    AuthProvider,
    RegisterRequest
} from 'types/auth';

export const API_PATHS = {
    LOGIN: '/api/users/auth/login/',
    REGISTER: '/api/users/auth/register/',
    LOGOUT: '/api/users/auth/logout/',
    GOOGLE_AUTH: '/api/users/auth/google/',
    VERIFY_EMAIL: '/api/users/auth/verify-email/',
    RESEND_VERIFICATION: '/api/users/auth/resend-verification/',
    CHANGE_PASSWORD: '/api/users/auth/change-password/',
    CHANGE_EMAIL: '/api/users/auth/change-email/',
    PROFILE: '/api/users/auth/profile/',
} as const;

// Type-safe API client
export const authAPI = {
    login: (credentials: components['schemas']['EmailTokenObtainPairRequest']) => 
        axios.post<operations['api_users_auth_auth_login_create']['responses'][200]['content']['application/json']>(
            API_PATHS.LOGIN, 
            credentials
        ),

    register: (data: operations['api_users_auth_auth_register_create']['requestBody']['content']['application/json']) => 
        axios.post<operations['api_users_auth_auth_register_create']['responses'][201]['content']['application/json']>(
            API_PATHS.REGISTER, 
            data
        ),

    logout: () => 
        axios.post<operations['api_users_auth_auth_logout_create']['responses'][200]['content']['application/json']>(
            API_PATHS.LOGOUT
        ),

    googleAuth: (credential: string) => 
        axios.post<operations['api_users_auth_auth_google_create']['responses'][200]['content']['application/json']>(
            API_PATHS.GOOGLE_AUTH, 
            { credential }
        ),

    verifyEmail: (token: string) => 
        axios.post<operations['api_users_auth_verify_email_create']['responses'][200]['content']['application/json']>(
            API_PATHS.VERIFY_EMAIL, 
            { token }
        ),

    resendVerification: (email: string) =>
        axios.post<operations['api_users_auth_resend_verification_create']['responses'][200]['content']['application/json']>(
            API_PATHS.RESEND_VERIFICATION, 
            { email }
        ),

    changePassword: (data: operations['api_users_auth_change_password_create']['requestBody']['content']['application/json']) => 
        axios.post<operations['api_users_auth_change_password_create']['responses'][200]['content']['application/json']>(
            API_PATHS.CHANGE_PASSWORD, 
            data
        ),

    changeEmail: (data: operations['api_users_auth_change_email_create']['requestBody']['content']['application/json']) => 
        axios.post<operations['api_users_auth_change_email_create']['responses'][200]['content']['application/json']>(
            API_PATHS.CHANGE_EMAIL, 
            data
        ),

    getProfile: () => 
        axios.get<operations['api_users_auth_profile_retrieve']['responses'][200]['content']['application/json']>(
            API_PATHS.PROFILE
        ),

    updateProfile: (data: operations['api_users_auth_profile_partial_update']['requestBody']['content']['application/json']) => 
        axios.patch<operations['api_users_auth_profile_partial_update']['responses'][200]['content']['application/json']>(
            API_PATHS.PROFILE, 
            data
        ),
} as const;