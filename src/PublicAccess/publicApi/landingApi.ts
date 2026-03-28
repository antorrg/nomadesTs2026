//import { api, publicApi } from './axios';
import { publicApi } from '../../api/api';
import type { ILanding, LandingResults,} from '../../types/landing';


export const landingPublicApi = {
    getAllPublic: async (): Promise<LandingResults[]> => {
        const response = await publicApi.execute<LandingResults[]>({

            request: {
                method: 'get',
                endpoint: 'landing/public'
            },
            hasMessage: false,
            // errorMessage: 'Algo paso'
        })
        return response || []
    },
    getPublicById: async (id: number): Promise<ILanding> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `landing/public/${id}`
            },
            hasMessage: true,
            // errorMessage: 'Algo paso'
        })
        return response as ILanding
    },

}

