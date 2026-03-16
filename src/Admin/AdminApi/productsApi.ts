import { adminApi } from '../../api/api';
import type {
    IProduct,
    ProductsResponse,
    CreateProduct,
    UpdateProduct,
    IItem,
    CreateItem,
    UpdateItem
} from '../../types/product';




// Authenticated API - Requires authentication
export const productsApi = {
    // --- PRODUCTOS ---
    getAll: async (): Promise<ProductsResponse[]> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: 'product'
            },
            hasMessage: false
        });
        return response as ProductsResponse[];
    },
    getById: async (id: number): Promise<IProduct> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `product/${id}`
            },
            //hasMessage: true
        });
        return response as IProduct;
    },
    create: async (
        data: CreateProduct,   
        callbacks?: {
        success?: () => void; 
         reject?: () => void;
        }): Promise<IProduct> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'product',
                data
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al crear producto'
        });
        return response as IProduct;
    },
    update: async (
        id: number, 
        data: UpdateProduct,
        callbacks?: {
          success?: () => void; 
          reject?: () => void;
        }
    ): Promise<IProduct> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `product/${id}`,
                data
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al actualizar producto'
        });
        return response as IProduct;
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
                title: 'Esta seguro de eliminar este producto?',
            },
            request: {
                method: 'delete',
                endpoint: `product/${id}`
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
        
            errorMessage: 'Error al eliminar producto'
        });
        return response as void;
    },

    // --- ITEMS ---
    getItem: async (id: number): Promise<IItem> => {
        const response = await adminApi.execute({
            request: {
                method: 'get',
                endpoint: `product/item/${id}`
            },
            //hasMessage: true,
            errorMessage: 'Error al obtener item'
        });
        return response as IItem;
    },
    createItem: async (
        data: CreateItem,
        callbacks?: {
        success?: () => void; 
         reject?: () => void;
        }
    ): Promise<IItem> => {
        const response = await adminApi.execute({
            request: {
                method: 'post',
                endpoint: 'product/item',
                data
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al crear item'
        });
        return response as IItem;
    },
    updateItem: async (
        id: number, 
        data: UpdateItem,
        callbacks?: {
        success?: () => void; 
        reject?: () => void;
        }
    ): Promise<IItem> => {
        const response = await adminApi.execute({
            request: {
                method: 'put',
                endpoint: `product/item/${id}`,
                data
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al actualizar item'
        });
        return response as IItem;
    },
    deleteItem: async (
        id: number,
        callbacks?: {
        success?: () => void; 
         reject?: () => void;
        }
    ): Promise<void> => {
        const response = await adminApi.execute({
            confirm: {
                title: 'Esta seguro de eliminar este item?',
            },
            request: {
                method: 'delete',
                endpoint: `product/item/${id}`
            },
            success: callbacks?.success,
            reject: callbacks?.reject,
            hasMessage: true,
            errorMessage: 'Error al eliminar item'
        });
        return response as void;
    },
 confirmAction: async (options: Record<any, any>):Promise<boolean> =>{
   return await adminApi.confirmAction(options)
 }
};
