import { BaseRepository } from "../../Shared/Repositories/BaseRepository.js";
import { throwError, processError } from "../../Configs/errorHandlers.js";
import { Product, Item, sequelize } from '../../Configs/database.js'
import {
    ProductParser,
    ItemParser,
    type IProduct,
    type CreateProduct,
    type UpdateProduct,
    type IItem,
    type CreateItem,
    type UpdateItem,
    type ProductsResponse,
    type IProductRepository
} from './ProductMappers.js'
import { type IRepositoryResponse } from "../../Shared/Interfaces/base.interface.js";

export class ProductRepository extends BaseRepository<IProduct, CreateProduct, UpdateProduct> implements IProductRepository {
    constructor(emptyObject: IProduct) {
        // Por defecto usamos el parser de lista para los métodos de base (p.ej. getAll / getWithPages)
        super(Product as any, ProductParser.toListDTO as any, 'Product', 'title', emptyObject)
    }

    // --- Implementación de IProductRepository ---

    async getProducts(): Promise<IRepositoryResponse<ProductsResponse[]>> {
        // getAll ya usa ProductParser.toListDTO configurado en el constructor
        return await this.getAll() as any
    }

    async getProductById(id: number): Promise<IRepositoryResponse<IProduct>> {
        try {
            const model = await this.Model.findByPk(id, {
                include: [{ model: Item, as: 'Items' }]
            })
            if (!model) throwError('Product not found', 404)

            return {
                message: 'Product retrieved successfully',
                results: ProductParser.toDetailDTO(model)
            }
        } catch (error) {
            return processError(error, 'GetProductById repository error')
        }
    }

    async getItem(id: number): Promise<IRepositoryResponse<IItem>> {
        try {
            const model = await Item.findByPk(id)
            if (!model) throwError('Item not found', 404)
            return {
                message: 'Item retrieved successfully',
                results: ItemParser.toDTO(model)
            }
        } catch (error) {
            return processError(error, 'GetItem repository error')
        }
    }

    async createProduct(data: CreateProduct): Promise<IRepositoryResponse<IProduct>> {
        const t = await sequelize.transaction()
        try {
            const { items, ...productData } = data

            const product = await Product.create(productData as any, { transaction: t })

            if (items && items.length > 0) {
                const itemsToCreate = items.map(item => ({
                    ...item,
                    ProductId: (product as any).id
                }))
                await Item.bulkCreate(itemsToCreate as any, { transaction: t })
            }

            await t.commit()

            return await this.getProductById((product as any).id)
        } catch (error) {
            await t.rollback()
            return processError(error, 'CreateProduct repository error')
        }
    }

    async updateProduct(id: number, data: UpdateProduct): Promise<IRepositoryResponse<IProduct>> {
        // Actualizamos el producto y devolvemos el detalle completo
        await this.update(id, data)
        return await this.getProductById(id)
    }

    async deleteProduct(id: number): Promise<IRepositoryResponse<string>> {
        return await this.delete(id)
    }

    async createItem(data: CreateItem): Promise<IRepositoryResponse<IItem>> {
        try {
            const model = await Item.create(data as any)
            return {
                message: 'Item created successfully',
                results: ItemParser.toDTO(model)
            }
        } catch (error) {
            return processError(error, 'CreateItem repository error')
        }
    }

    async updateItem(id: number, data: UpdateItem): Promise<IRepositoryResponse<IItem>> {
        try {
            const model = await Item.findByPk(id)
            if (!model) throwError('Item not found', 404)
            const updated = await model!.update(data as any)
            return {
                message: 'Item updated successfully',
                results: ItemParser.toDTO(updated)
            }
        } catch (error) {
            return processError(error, 'UpdateItem repository error')
        }
    }

    async deleteItem(id: number): Promise<IRepositoryResponse<string>> {
        // ... (existing implementation remains same)
        try {
            const model = await Item.findByPk(id)
            if (!model) throwError('Item not found', 404)
            await model!.destroy()
            return {
                message: 'Item deleted successfully',
                results: ''
            }
        } catch (error) {
            return processError(error, 'DeleteItem repository error')
        }
    }
    override async getByIdScoped(id: string | number, scope: string = 'enabledOnly'): Promise<IRepositoryResponse<IProduct>> {
        try {
            const model = await this.Model.scope(scope).findByPk(id, {
                include: [{ model: Item, as: 'Items', where: { enabled: true } }]
            })
            if (!model) throwError('Product not found', 404)

            return {
                message: 'Product retrieved successfully',
                results: ProductParser.toDetailDTO(model)
            }
        } catch (error) {
            return processError(error, 'GetProductById repository error')
        }
    }

    async getItemScoped(id: number, scope: string = 'enabledOnly'): Promise<IRepositoryResponse<IItem>> {
        try {
            const model = await Item.scope(scope).findByPk(id)
            if (!model) throwError(`Item not found or not available`, 404)
            return {
                message: `Item retrieved successfully`,
                results: ItemParser.toDTO(model)
            }
        } catch (error) {
            return processError(error, 'GetItemScoped repository error')
        }
    }

    // --- Sobrescribir métodos de BaseRepository para integrarlos ---

    override async create(data: CreateProduct): Promise<IRepositoryResponse<IProduct>> {
        return this.createProduct(data)
    }

    override async getById(id: string | number): Promise<IRepositoryResponse<IProduct>> {
        return this.getProductById(Number(id))
    }
}