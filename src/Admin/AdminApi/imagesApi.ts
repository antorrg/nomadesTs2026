import { adminApi } from '../../api/api';
import type { IImage, UploadImageResponse, SaveImageInput } from '../../types/image';

// All image endpoints require authentication
export const imagesApi = {
    getAll: async (): Promise<IImage[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'images'
            },
            hasMessage: false,
        });
        return response as IImage[];
    },
    delete: async (
        id: number,
        callbacks?: {
        success?: () => void; 
         reject?: () => void;
        }
    ): Promise<void> => {
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de borrar esta imagen?',
            },
            request: {
                method: 'delete',
                endpoint: `images/${id}`
            },
           success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al eliminar imagen'
        });
        return response as void;
    },
    upload: async (file: File): Promise<UploadImageResponse> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de subir esta imagen?',
            },
            request: {
                method: 'post',
                endpoint: 'images/upload',
                data: formData
            },
            hasMessage: true,
            errorMessage: 'Error al subir imagen'
        });
        return response as UploadImageResponse;
    },
    save: async (data: SaveImageInput): Promise<IImage> => {
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de guardar esta imagen?',
            },
            request: {
                method: 'post',
                endpoint: 'images/save',
                data
            },
            hasMessage: true,
            errorMessage: 'Error al guardar imagen'
        });
        return response as IImage;
    },
     confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }
};
