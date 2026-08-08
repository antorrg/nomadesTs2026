import { type Request, type Response } from 'express'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import type { IMedia, CreateMedia, UpdateMedia } from './mediaMappers.js'
import { MediaService } from './MediaService.js'

export class MediaController extends BaseController<IMedia, CreateMedia, UpdateMedia> {
  protected mediaService: MediaService

  constructor(service: MediaService) {
    super(service)
    this.mediaService = service
  }

  updateConfig = async (req: Request, res: Response) => {
    const data = req.body
    const { message, results } = await this.mediaService.updateConfig(data)
    BaseController.responder(res, 200, true, message, results)
  }
}
