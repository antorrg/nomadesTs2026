import { adminApi } from '../../api/api';
import type { IAbout, CreateAbout, UpdateAbout } from '../../types/about';

export const aboutAdminApi = {
    getAll: async (): Promise<IAbout[]> => {
        const response = await adminApi.execute<IAbout[]>({
            request: {
                method: 'get',
                endpoint: 'about'
            },
            hasMessage: false,
        });
        return response || [];
    },
    getById: async (id: number): Promise<IAbout> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `about/${id}`
            },
            hasMessage: false,
            errorMessage: 'Ocurrió un error al cargar la información'
        });
        return response as IAbout;
    },
    create: async (data: CreateAbout): Promise<IAbout> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'about',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al crear la sección sobre nosotros'
        });
        return response as IAbout;
    },
    update: async (id: number, data: UpdateAbout): Promise<IAbout> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `about/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar la sección sobre nosotros'
        });
        return response as IAbout;
    },
    confirmAction: async (options: Record<string, unknown>): Promise<boolean> => {
        return await adminApi.confirmAction(options);
    }
};
