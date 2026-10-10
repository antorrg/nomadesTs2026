import { publicApi } from '../../api/api';
import type { IAbout } from '../../types/about';

// Public API for About - No authentication required
export const aboutPublicApi = {
    getAllPublic: async (): Promise<IAbout[]> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: 'about/public'
            },
            hasMessage: false
        });
        return response as IAbout[];
    },
    getPublicById: async (id: number): Promise<IAbout> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `about/public/${id}`
            },
            hasMessage: false
        });
        return response as IAbout;
    }
};
