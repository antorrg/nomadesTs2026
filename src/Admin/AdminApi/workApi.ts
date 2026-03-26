import { adminApi } from '../../api/api';
import type { IWork, CreateWork, UpdateWork } from '../../types/work';


// Authenticated API - Requires authentication
export const workApi = {
    getAll: async (): Promise<IWork[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'work'
            },
            hasMessage: false
        });
        return response as IWork[];
    },
    getById: async (id: number): Promise<IWork> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `work/${id}`
            },
            hasMessage: false
        });
        return response as IWork;
    },
    create: async (data: CreateWork): Promise<IWork> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'work',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al crear trabajo'
        });
        return response as IWork;
    },
    update: async (id: number, data: UpdateWork): Promise<IWork> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `work/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar trabajo'
        });
        return response as IWork;
    },
    delete: async (id: number): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `work/${id}`
            },
            hasMessage: true,
            errorMessage: 'Error al eliminar trabajo'
        });
        return response as void;
    },
     confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }
};
