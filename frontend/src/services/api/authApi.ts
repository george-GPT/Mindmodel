import type { AxiosResponse } from 'axios';
import { axiosInstance } from './axiosInstance';
import { API_PATHS } from './apiPaths';
import type { components } from '@/types/api';
import type { 
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  TokenResponse,
  AuthResponse,
  UserProfile
} from '@/types/auth';

export const authApi = {
  // Core Authentication
  login: (credentials: LoginCredentials): Promise<AxiosResponse<components['schemas']['AuthResponse']>> => 
    axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials),

  register: (data: RegisterData): Promise<AxiosResponse<components['schemas']['AuthResponse']>> => 
    axiosInstance.post(API_PATHS.AUTH.REGISTER, data),

  // OAuth
  googleAuth: (token: string): Promise<AxiosResponse<components['schemas']['AuthResponse']>> =>
    axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, { token }),

  // Session Management
  refresh: (refreshToken: string): Promise<AxiosResponse<components['schemas']['TokenResponse']>> =>
    axiosInstance.post(API_PATHS.AUTH.REFRESH, { refresh: refreshToken }),

  logout: () => 
    axiosInstance.post<components['schemas']['SuccessResponse']>(API_PATHS.AUTH.LOGOUT),

  // Account Management
  changePassword: (data: ChangePasswordData) => 
    axiosInstance.post<components['schemas']['SuccessResponse']>(
      API_PATHS.AUTH.CHANGE_PASSWORD, 
      data
    ),

  getProfile: () => 
    axiosInstance.get<components['schemas']['UserProfile']>(API_PATHS.AUTH.PROFILE),

  updateProfile: (data: Partial<UserProfile>) => 
    axiosInstance.patch<components['schemas']['UserProfile']>(
      API_PATHS.AUTH.PROFILE, 
      data
    )
}; 