import { publicApi } from '../../api/api';
import type { IHightLight } from '../../types/hightLight';


// Public API - No authentication required
export const highPublicApi = {
    getAllPublic: async (): Promise<IHightLight[]> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: 'hightlight/public'
            },
            hasMessage: false
        });
        return response as IHightLight [];
    },
    getPublicById: async (id: number): Promise<IHightLight > => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `hightlight/public/${id}`
            },
            hasMessage: false
        });
        return response as IHightLight ;
    }
};
