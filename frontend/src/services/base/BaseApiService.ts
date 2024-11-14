import type { AxiosInstance, AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import type { components } from '@/types/api';
import { createApiError } from '@/types/error';
import axiosInstance from '@services/api/axiosInstance';

/**
 * @description Base class for API services with common HTTP functionality
 * @extends {BaseService}
 */
export abstract class BaseApiService extends BaseService {
    protected readonly api: AxiosInstance;
    protected readonly basePath: string;

    constructor(basePath: string, api: AxiosInstance = axiosInstance) {
        super();
        this.api = api;
        this.basePath = basePath;
    }

    /**
     * Makes a GET request with proper error handling and response validation
     */
    protected async get<T>(
        path: string, 
        params?: Record<string, unknown>
    ): Promise<T> {
        try {
            const response = await this.api.get<components['schemas']['SuccessResponse']>(
                `${this.basePath}${path}`,
                { params }
            );
            return this.validateResponse<T>(response);
        } catch (error) {
            throw this.handleError(error, 'GET request failed');
        }
    }

    /**
     * Makes a POST request with proper error handling and response validation
     */
    protected async post<T>(
        path: string, 
        data?: unknown
    ): Promise<T> {
        try {
            const response = await this.api.post<components['schemas']['SuccessResponse']>(
                `${this.basePath}${path}`,
                data
            );
            return this.validateResponse<T>(response);
        } catch (error) {
            throw this.handleError(error, 'POST request failed');
        }
    }

    /**
     * Makes a PUT request with proper error handling and response validation
     */
    protected async put<T>(
        path: string, 
        data: unknown
    ): Promise<T> {
        try {
            const response = await this.api.put<components['schemas']['SuccessResponse']>(
                `${this.basePath}${path}`,
                data
            );
            return this.validateResponse<T>(response);
        } catch (error) {
            throw this.handleError(error, 'PUT request failed');
        }
    }

    /**
     * Makes a PATCH request with proper error handling and response validation
     */
    protected async patch<T>(
        path: string, 
        data: unknown
    ): Promise<T> {
        try {
            const response = await this.api.patch<components['schemas']['SuccessResponse']>(
                `${this.basePath}${path}`,
                data
            );
            return this.validateResponse<T>(response);
        } catch (error) {
            throw this.handleError(error, 'PATCH request failed');
        }
    }

    /**
     * Makes a DELETE request with proper error handling
     */
    protected async delete(path: string): Promise<void> {
        try {
            await this.api.delete(`${this.basePath}${path}`);
        } catch (error) {
            throw this.handleError(error, 'DELETE request failed');
        }
    }

    /**
     * Validates paginated response data
     */
    protected validatePaginatedResponse<T>(
        response: AxiosResponse<components['schemas']['PaginatedResponse']>
    ): T[] {
        if (!response?.data?.success || !Array.isArray(response?.data?.data?.results)) {
            throw createApiError('Invalid paginated response format');
        }
        return response.data.data.results as T[];
    }
} 