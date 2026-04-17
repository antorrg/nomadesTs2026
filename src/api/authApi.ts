import { publicApi, adminApi } from './api';
import { type AuthUser, type LoginUser } from '../types/user'


export const authApi = {
    login: async (data: LoginUser): Promise<AuthUser> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: `auth/login`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error de autenticacion'
        })
        return response as AuthUser
    },
    logout: async () => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: `auth/logout`,
            },
            hasMessage: true,
            errorMessage: 'Error de autenticacion'
        })
        return response as AuthUser
    },

    me: async () => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `auth/me`,
            },
            hasMessage: false,
            errorMessage: 'Error de autenticacion'
        })
        return response as AuthUser
    },
};
