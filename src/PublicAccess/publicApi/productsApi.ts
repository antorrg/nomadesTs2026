import { publicApi } from '../../api/api';
import type {
    IProduct,
    ProductsResponse,
    IItem 
} from '../../types/product';


// Public API - No authentication required
export const productsPublicApi = {
    getAllPublic: async (): Promise<ProductsResponse[]> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: 'product/public'
            },
            hasMessage: false
        });
        return response as ProductsResponse[];
    },
    getPublicById: async (id: number): Promise<IProduct> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `product/public/${id}`
            },
            hasMessage: false
        });
        return response as IProduct;
    },
    getPublicItem: async (id: number): Promise<IItem> => {
        const response = await publicApi.execute({
            request: {
                method: 'get',
                endpoint: `product/public/item/${id}`
            },
            hasMessage: false
        });
        return response as IItem;
    }
};
