import { type Request, type Response } from 'express'
import multer from 'multer'
import { throwError, processError } from '../../Configs/errorHandlers.js'
import logger from '../../Configs/logger.js'
import { ImageRepository } from './ImageRepository.js'
import { ImgsService } from '../../Shared/Services/ImgsService.js'
// Configuración de Multer
const storage = multer.memoryStorage()
export const upload = multer({ storage })


export class ImageController<Images, CreateImages> {
  protected service: ImageRepository<Images, CreateImages>
  constructor(
    service: ImageRepository<Images, CreateImages>
  ) {
    this.service = service
  }
  static responder(res: Response, status: number, success: boolean, message: string, results: any) {
    return res.status(status).json({ success, message, results })
  }
  uploader = async (req: Request, res: Response) => {
    if (!req.file) {
      throwError('No se subió ningún archivo', 500)
    }
    try {
      const result = await ImgsService.uploadNewImage(req.file)
      res.status(200).json({
        message: 'Imagen guardada',
        results: {
          url: result
        }
      })
    } catch (error) {
      throwError('Error al subir la imagen', 500)
    }
  }

  saveImage = async (req: Request, res: Response) => {
    const response = await this.service.saveImage(req.body)
    return ImageController.responder(res, 201, true, 'Imagen guardada exitosamente', response)
  }
  getImages = async (req: Request, res: Response) => {
    const response = await this.service.getImages()
    return ImageController.responder(res, 200, true, 'Imagenes obtenidas', response)
  }
  deleteImages = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const identityUrl = await this.service.deleteImageFromDbById(id as any)
      if(!identityUrl) return
      await ImgsService.handleImages(identityUrl, false)
      return ImageController.responder(res, 200, true, 'Imagen borrada ', '')
    } catch (error) {
      processError(error, 'Error en ImageController.deleteImages')
    }
  }
}