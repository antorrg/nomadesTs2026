import { adminApi } from '../../api/api';
import type { IMedia, CreateMedia, UpdateMedia } from '../../types/media';


// Authenticated API - Requires authentication
export const mediaApi = {
    getAll: async (): Promise<IMedia[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'media'
            },
            hasMessage: false
        });
        return response as IMedia[];
    },
    getById: async (id: number): Promise<IMedia> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `media/${id}`
            },
            hasMessage: false
        });
        return response as IMedia;
    },
    create: async (data: CreateMedia): Promise<IMedia> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'media',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al crear media'
        });
        return response as IMedia;
    },
    update: async (id: number, data: UpdateMedia): Promise<IMedia> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `media/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar media'
        });
        return response as IMedia;
    },
    delete: async (id: number): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `media/${id}`
            },
            hasMessage: true,
            errorMessage: 'Error al eliminar media'
        });
        return response as void;
    },
     confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }
};
