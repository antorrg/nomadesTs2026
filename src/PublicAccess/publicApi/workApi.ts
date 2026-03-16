import { publicApi } from '../../api/api';
import type { IWork } from '../../types/work';


// Public API - No authentication required
export const workPublicApi = {
    getAllPublic: async (): Promise<IWork[]> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: 'work/public'
            },
            hasMessage: false
        });
        return response as IWork[];
    },
    getPublicById: async (id: number): Promise<IWork> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `work/public/${id}`
            },
            hasMessage: false
        });
        return response as IWork;
    }
};
