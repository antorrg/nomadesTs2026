import { adminApi } from '../../api/api';
import type { ILanding, LandingResults, CreateLanding, UpdateLanding } from '../../types/landing';



export const landingApi = {
    getAll: async (): Promise<LandingResults[]> => {
        const response = await adminApi.execute<LandingResults[]>({
            request: {
                method: 'get',
                endpoint: `landing`
            },
            hasMessage: false,
            // errorMessage: 'Algo paso'
        })
        return response || []
    },
    getById: async (id: number): Promise<ILanding> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `/landing/${id}`
            },
            hasMessage: false,
            errorMessage: 'Algo paso'
        })
        return response as ILanding
    },
    create: async (data: CreateLanding): Promise<ILanding> => {
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de crear este elemento?',
            },
            request: {
                method: 'post',
                endpoint: `/landing`,
                data
            },
            hasMessage: true,
            errorMessage: 'Algo paso'
        })
        return response as ILanding
    },
    update: async (id: number, data: UpdateLanding): Promise<ILanding> => {
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de actualizar este elemento?',
            },
            request: {
                method: 'put',
                endpoint: `/landing/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Algo paso'
        })
        return response as ILanding
    },
     confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }

}
