import { type Request, type Response } from 'express'
import multer from 'multer'
import { throwError, processError } from '../../Configs/errorHandlers.js'
import { ImageRepository } from './ImageRepository.js'
import { ImgsService } from '../../Shared/Services/ImgsService.js'
// Configuración de Multer
const storage = multer.memoryStorage()
export const upload = multer({ storage })


export class ImageController {
  protected service: ImageRepository
  constructor(
    service: ImageRepository
  ) {
    this.service = service
  }
  static responder(res: Response, status: number, success: boolean, message: string, results: unknown) {
    return res.status(status).json({ success, message, results })
  }
  uploader = async (req: Request, res: Response) => {
    const file = req.file
    if (!file) return throwError('No se subió ningún archivo', 500)

    try {
      const result = await ImgsService.uploadNewImage(file)
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
      const imageUrl =await this.service.deleteImageFromDbById(Number(id))
      await ImgsService.handleImages(imageUrl, false)
      return ImageController.responder(res, 200, true, 'Imagen eliminada exitosamente', '')
    } catch (error) {
      processError(error, 'Error en ImageController.deleteImages')
    }
  }
}
