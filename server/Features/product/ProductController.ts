import { type Request, type Response } from 'express'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { ProductService } from './ProductService.js'
import {
    type IProduct,
    type CreateProduct,
    type UpdateProduct,
    type CreateItem,
    type UpdateItem
} from './ProductMappers.js'

export class ProductController extends BaseController<IProduct, CreateProduct, UpdateProduct> {
    constructor(protected readonly productService: ProductService) {
        super(productService)
    }

    // --- Métodos Públicos (Scoped) ---

    scopedGet = async (_req: Request, res: Response) => {
        const { message, results } = await this.productService.getAllScoped()
        BaseController.responder(res, 200, true, message, results)
    }

    scopedGetById = async (req: Request, res: Response) => {
        const { id } = req.params
        const { message, results } = await this.productService.getByIdScoped(id as string)
        BaseController.responder(res, 200, true, message, results)
    }

    scopedGetItem = async (req: Request, res: Response) => {
        const { id } = req.params
        const { message, results } = await this.productService.getItemScoped(Number(id))
        BaseController.responder(res, 200, true, message, results)
    }

    // --- Métodos para Ítems individuales ---

    getItem = async (req: Request, res: Response) => {
        const { id } = req.params
        const { message, results } = await this.productService.getItem(Number(id))
        BaseController.responder(res, 200, true, message, results)
    }

    createItem = async (req: Request, res: Response) => {
        const data: CreateItem = req.body
        const { message, results } = await this.productService.createItem(data)
        BaseController.responder(res, 201, true, message, results)
    }

    updateItem = async (req: Request, res: Response) => {
        const { id } = req.params
        const data: UpdateItem = req.body
        const { message, results } = await this.productService.updateItem(Number(id), data)
        BaseController.responder(res, 200, true, message, results)
    }

    deleteItem = async (req: Request, res: Response) => {
        const { id } = req.params
        const { message, results } = await this.productService.deleteItem(Number(id))
        BaseController.responder(res, 200, true, message, results)
    }
}
