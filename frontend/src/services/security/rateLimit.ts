import { axiosInstance } from '../api/axiosInstance';
import { handleError } from '../../utils/errorHandler';
import type { components } from '../../types/api.d';

export const rateLimit = {
    checkLimit: async () => {
        try {
            const response = await axiosInstance.get<components['schemas']['SuccessResponse']>(
                '/api/rate-check/'
            );
            return response.data;
        } catch (error) {
            throw handleError(error, 'Rate Limit');
        }
    }
}; 