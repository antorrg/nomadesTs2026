import { adminApi } from '../../api/api';
import type { IUser, CreateUserInput, UpdateUserInput, UpgradeUserInput } from '../../types/user';


// All user endpoints require authentication
export const userApi = {
    getAll: async (): Promise<IUser[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'user'
            },
            hasMessage: false
        });
        return response as IUser[];
    },
    getAllWithPages: async (page?: number, limit?: number): Promise<{ users: IUser[], total: number }> => {
        const params: Record<string, unknown> = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;

        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `user/pages`,
                params
            },
            hasMessage: true
        });
        return response as { users: IUser[], total: number };
    },
    getById: async (id: string): Promise<IUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `user/${id}`
            },
            hasMessage: false
        });
        return response as IUser;
    },
    create: async (data: CreateUserInput): Promise<IUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'user/create',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al crear usuario'
        });
        return response as IUser;
    },
    updateProfile: async (id: string, data: UpdateUserInput): Promise<IUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `user/${id}/profile`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar perfil'
        });
        return response as IUser;
    },
    upgradeRole: async (id: string, data: UpgradeUserInput): Promise<IUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `user/${id}/upgrade`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar rol'
        });
        return response as IUser;
    },
    changePassword: async (id: string, data: UpgradeUserInput): Promise<IUser> => {
        console.log(data)
        const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `user/${id}/change-password`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar contraseña'
        });
        return response as IUser;
    },
        blockerUser: async (id: string, data: UpgradeUserInput): Promise<IUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `user/${id}/blocker`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar acceso'
        });
        return response as IUser;
    },
    resetPassword: async(id: string):Promise<void> => {
            const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `user/${id}/reset-password`
            },
            hasMessage: true,
            errorMessage: 'Error al resetear contraseña'
        });
        return response as void;
    },
    delete: async (id: string): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `user/${id}`
            },
            hasMessage: true,
            errorMessage: 'Error al eliminar usuario'
        });
        return response as void;
    },
     confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }
};
