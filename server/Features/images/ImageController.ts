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
      console.log('URL generada:', result)
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
      const tasks = [
        ImgsService.deleteImage(id as any)
      ]

      // Si el id parece un ID numérico, intentamos borrar también por ID primario en repo
      if (!isNaN(Number(id))) {
        tasks.push(this.service.deleteImage(id as any, true))
      }

      const results = await Promise.allSettled(tasks)
      const [cloudResult, repoResult] = results

      const errors: any[] = []
      if (cloudResult.status === 'rejected') errors.push({ service: 'ImgsService', reason: cloudResult.reason })
      if (repoResult && repoResult.status === 'rejected') errors.push({ service: 'Repository', reason: repoResult.reason })

      // Si todas las tareas fallaron, lanzamos un error explícito
      if (errors.length === tasks.length) {
        throwError('Error total al eliminar imagen: fallaron todas las tareas de eliminación', 500)
      }

      // Si hubo algún error (pero no total), lo logueamos pero permitimos que continúe si algo tuvo éxito
      if (errors.length > 0) {
        errors.forEach(err => logger.error(err))
      }

      // Preparamos los datos de respuesta
      const response = repoResult && repoResult.status === 'fulfilled' ? repoResult.value : null
      const cloudInfo = cloudResult.status === 'fulfilled' ? cloudResult.value : null

      // Determinamos el mensaje según el éxito parcial o total
      const message = errors.length > 0
        ? 'Imagen eliminada con errores parciales'
        : 'Imagen eliminada exitosamente'

      return ImageController.responder(res, 200, true, message, { response, cloudInfo, warnings: errors })
    } catch (error) {
      processError(error, 'Error en ImageController.deleteImages')
    }
  }
}