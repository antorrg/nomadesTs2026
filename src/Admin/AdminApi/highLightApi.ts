import { adminApi } from '../../api/api';
import type { IHightLight, CreateHighLight, UpdateHighLight } from '../../types/hightLight';


// Authenticated API - Requires authentication
export const highLightApi = {
    getAll: async (): Promise<IHightLight[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'hightlight'
            },
            hasMessage: false
        });
        return response as IHightLight[];
    },
    getById: async (id: number): Promise<IHightLight> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `hightlight/${id}`
            },
            hasMessage: false
        });
        return response as IHightLight;
    },
    create: async (data: CreateHighLight): Promise<IHightLight> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'hightlight',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al crear destacado'
        });
        return response as IHightLight;
    },
    update: async (id: number, data: UpdateHighLight): Promise<IHightLight> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `hightlight/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar destacado'
        });
        return response as IHightLight;
    },
    delete: async (id: number): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `hightlight/${id}`
            },
            hasMessage: true,
            errorMessage: 'Error al eliminar destacado'
        });
        return response as void;
    },
    confirmAction: async (options: Record<any, any>): Promise<boolean> => {//eslint-disable-line
        return await adminApi.confirmAction(options)
    }
};
