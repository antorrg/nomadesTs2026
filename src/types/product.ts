// Product types
export interface IItem {
    id: number;
    picture: string | null;
    text: string | null;
    ProductId: number;
    enabled: boolean;
}

export interface IProduct {
    id: number;
    title: string | null;
    picture: string | null;
    info_header: string | null;
    info_body: string | null;
    enabled: boolean;
    Items?: IItem[];
}

export type ProductsResponse = Omit<IProduct, 'Items'>;


// Create types
export type CreateItemInProduct = Omit<IItem, 'id' | 'enabled' | 'ProductId'> & { useImg?: boolean };
export type CreateItem = Omit<IItem, 'id' | 'enabled'> & { useImg?: boolean };
export type CreateProduct = Omit<IProduct, 'id' | 'enabled' | 'Items'> & {
    items: CreateItemInProduct[];
    useImg?: boolean;
};

// Update types
export type UpdateItem = Partial<Omit<IItem, 'id'>> & { useImg?: boolean; saver?: boolean };
export type UpdateProduct = Partial<Omit<IProduct, 'id' | 'Items'>> & {
    useImg?: boolean;
    saver?: boolean;
};
