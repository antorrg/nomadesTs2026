import { adminApi } from '../../api/api';
import type { ILogger, IPaginatedResponse, IPagesOptions, LoggerUpdate, IActionResponse } from '../../types/systemLogs';

// Authenticated API - Requires ADMIN authentication
export const systemLogsApi = {
    getAll: async (options?: IPagesOptions): Promise<IPaginatedResponse> => {
        const params: Record<string, unknown> = {};
        if (options?.page) params.page = options.page;
        if (options?.limit) params.limit = options.limit;
        if (options?.search) params.search = options.search;
        if (options?.searchField) params.searchField = options.searchField;
        if (options?.sortBy) params.sortBy = options.sortBy;
        if (options?.order) params.order = options.order;

        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'admin/logs', // Base mapped at /api/v1/admin/logs
                params
            },
            hasMessage: false
        });
        return response as IPaginatedResponse;
    },
    getById: async (id: number): Promise<ILogger> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `admin/logs/${id}`
            },
            hasMessage: false
        });
        return response as ILogger;
    },
    update: async (id: number, data: LoggerUpdate): Promise<IActionResponse> => {
        const response = await adminApi.execute({
            request: {
                method: 'patch',
                endpoint: `admin/logs/${id}`,
                data
            },
            hasMessage: true,
            errorMessage: 'Error al actualizar registro'
        });
        return response as IActionResponse;
    },
    delete: async (id: number): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `admin/logs/${id}`
            },
            hasMessage: true,
            errorMessage: 'Error al eliminar log'
        });
        return response as void;
    },
    deleteAll: async (): Promise<void> => {
        const response = await adminApi.execute({
            request: {
                method: 'delete',
                endpoint: `admin/logs/0/clean`
            },
            hasMessage: true,
            errorMessage: 'Error al limpiar logs'
        });
        return response as void;
    },
    confirmAction: async (options: Record<any, any>): Promise<boolean> => {
        return await adminApi.confirmAction(options);
    }
};
