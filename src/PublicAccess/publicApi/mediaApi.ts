import { publicApi } from '../../api/api';
import type { IMedia } from '../../types/media';

// Public API - No authentication required
export const mediaPublicApi = {
    getAllPublic: async (): Promise<IMedia[]> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: 'media/public'
            },
            hasMessage: false
        });
        return response as IMedia[];
    },
    getPublicById: async (id: number): Promise<IMedia> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `media/public/${id}`
            },
            hasMessage: false
        });
        return response as IMedia;
    }
};

