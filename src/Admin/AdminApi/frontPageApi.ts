import { adminApi } from '../../api/api';
import type { IFrontPage, FrontPageResults, CreateFrontPage, UpdateFrontPage } from '../../types/frontPage';

export const frontPageApi = {
    getAll: async (): Promise<FrontPageResults[]> => {
        const response = await adminApi.execute<FrontPageResults[]>({
            request: {
                method: 'get',
                endpoint: `landing` // kept as landing per backend implementation
            },
            hasMessage: false,
        })
        return response || []
    },
    getById: async (id: number): Promise<IFrontPage> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `landing/${id}` // kept as landing per backend implementation
            },
            hasMessage: false,
            errorMessage: 'Algo paso'
        })
        return response as IFrontPage
    },
    create: async (data: CreateFrontPage): Promise<IFrontPage> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: `landing`, // kept as landing per backend implementation
                data
            },
            hasMessage: true,
            errorMessage: 'Algo paso'
        })
        return response as IFrontPage
    },
    update: async (id: number, data: UpdateFrontPage): Promise<IFrontPage> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `landing/${id}`, // kept as landing per backend implementation
                data
            },
            hasMessage: true,
            errorMessage: 'Algo paso'
        })
        return response as IFrontPage
    },
    confirmAction: async (options: Record<any, any>): Promise<boolean> => {
        return await adminApi.confirmAction(options)
    }
}
