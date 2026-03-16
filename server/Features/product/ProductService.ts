import { BaseServiceWithImages } from "../../Shared/Services/BaseServiceWithImages.js";
import { ImgsService } from "../../Shared/Services/ImgsService.js";
import {
    type IProduct,
    type CreateProduct,
    type UpdateProduct,
    type IItem,
    type CreateItem,
    type UpdateItem
} from "./ProductMappers.js";
import { ProductRepository } from "./ProductRepository.js";
import { type IRepositoryResponse } from "../../Shared/Interfaces/base.interface.js";
import { throwError } from "../../Configs/errorHandlers.js";

export class ProductService extends BaseServiceWithImages<IProduct, CreateProduct, UpdateProduct> {
    constructor(protected readonly repository: ProductRepository) {
        // 'picture' es el campo de imagen común tanto en Product como en Item
        super(repository, ImgsService as any, true, 'picture');
    }

    override async create(data: CreateProduct): Promise<IRepositoryResponse<IProduct>> {
        // 1. Manejar imagen del Producto base y creación del agregado a través de super.create
        const response = await super.create(data);

        // 2. Manejar imágenes de los Ítems creados mediante useImg
        if (data.items && data.items.length > 0) {
            for (const item of data.items) {
                if (item.useImg && item.picture) {
                    await this.handleImages(item.picture, false);
                }
            }
        }

        return response;
    }

    override async delete(id: number): Promise<IRepositoryResponse<string>> {
        // 1. Obtener el producto completo para tener acceso a los ítems antes de borrar
        const productRes = await this.repository.getProductById(Number(id));
        if (!productRes) throwError('Product not found', 404);

        // 2. Borrar producto e imagen del producto base a través de super.delete
        const response = await super.delete(id);

        // 3. Borrar imágenes de todos los ítems asociados que se borraron en cascada
        if (productRes.results.Items && productRes.results.Items.length > 0) {
            for (const item of productRes.results.Items) {
                if (item.picture) {
                    await this.handleImages(item.picture, false);
                }
            }
        }

        return response;
    }
    async getByIdScoped(id: string | number, scope?: string): Promise<IRepositoryResponse<IProduct>> {
        return await this.repository.getByIdScoped(id, scope)
    }

    // --- Métodos de Service para Ítems individuales ---

    async createItem(data: CreateItem): Promise<IRepositoryResponse<IItem>> {
        const response = await this.repository.createItem(data);

        // Manejar lógica useImg para el ítem
        if (data.useImg && data.picture) {
            await this.handleImages(data.picture, false);
        }

        return response;
    }

    async updateItem(id: number, data: UpdateItem): Promise<IRepositoryResponse<IItem>> {
        // 1. Obtener item actual para comparar imágenes
        const oldItemRes = await this.repository.getItem(id);
        const oldImageUrl = oldItemRes.results.picture;
        const newImageUrl = data.picture;

        const response = await this.repository.updateItem(id, data);

        // 2. Manejar imagen nueva (galería)
        if (data.useImg && newImageUrl) {
            await this.handleImages(newImageUrl, false);
        }

        // 3. Manejar imagen vieja si cambió o se eliminó
        if (oldImageUrl && oldImageUrl !== newImageUrl) {
            const shouldSaveOld = data.saver === true;
            await this.handleImages(oldImageUrl, shouldSaveOld);
        }

        return response;
    }

    async deleteItem(id: number): Promise<IRepositoryResponse<string>> {
        // 1. Obtener item para recuperar la URL de la imagen
        const itemRes = await this.repository.getItem(id);
        const imageUrl = itemRes.results.picture;

        const response = await this.repository.deleteItem(id);

        // 2. Borrar la imagen asociada
        if (imageUrl) {
            await this.handleImages(imageUrl, false);
        }

        return response;
    }



    async getItem(id: number): Promise<IRepositoryResponse<IItem>> {
        return await this.repository.getItem(id);
    }

    async getItemScoped(id: number, scope: string = 'enabledOnly'): Promise<IRepositoryResponse<IItem>> {
        return await this.repository.getItemScoped(id, scope);
    }
}
