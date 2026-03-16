import { type Request, type Response } from 'express'
import { type BaseService } from '../Services/BaseService.js'
import { type PaginateInfo } from '../Interfaces/base.interface.js'

export class BaseController<TDTO, TCreate, TUpdate> {
  protected service: BaseService<TDTO, TCreate, TUpdate>
  constructor(service: BaseService<TDTO, TCreate, TUpdate>) {
    this.service = service
  }

  static responder(res: Response, status: number, success: boolean, message: string, results: any) {
    return res.status(status).json({ success, message, results })
  }

  static responderWithInfo(res: Response, status: number, success: boolean, message: string, info: PaginateInfo, results: any) {
    return res.status(status).json({ success, message, info, results })
  }

  getAll = async (req: Request, res: Response) => {
    const query = req?.context?.query
    const { message, results } = await this.service.getAll(query)
    BaseController.responder(res, 200, true, message, results)
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const { message, results } = await this.service.getById(id as string)
    BaseController.responder(res, 200, true, message, results)
  }

  getWithPages = async (req: Request, res: Response) => {
    const queryObject = req?.context?.query
    const { message, info, data } = await this.service.getWithPages(queryObject)
    BaseController.responderWithInfo(res, 200, true, message, info, data)
  }

  create = async (req: Request, res: Response) => {
    const data = req.body
    const { message, results } = await this.service.create(data)
    BaseController.responder(res, 201, true, message, results)
  }

  update = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
    const { message, results } = await this.service.update(id as string, data)
    BaseController.responder(res, 200, true, message, results)
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    const { message, results } = await this.service.delete(id as string)
    BaseController.responder(res, 200, true, message, results)
  }

  // Métodos para acceso público (usan el scope por defecto 'enabledOnly')
  getAllPublic = async (_req: Request, res: Response) => {
    const { message, results } = await this.service.getAllScoped()
    BaseController.responder(res, 200, true, message, results)
  }

  getByIdPublic = async (req: Request, res: Response) => {
    const { id } = req.params
    const { message, results } = await this.service.getByIdScoped(id as string)
    BaseController.responder(res, 200, true, message, results)
  }
}
