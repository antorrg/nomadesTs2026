import { throwError } from '../../Configs/errorHandlers.js'
import { BaseService } from './BaseService.js'
import { type IBaseRepository, type IRepositoryResponse, type IPaginatedOptions, type IPaginatedResults, type IExternalImageDeleteService } from '../Interfaces/base.interface.js'

/**
 * Interface representing the optional image control fields in requests.
 */
interface ImageControl {
  useImg?: boolean
  saver?: boolean
}

export class BaseServiceWithImages<TDTO, TCreate, TUpdate> extends BaseService<TDTO, TCreate, TUpdate>{
  protected repository: IBaseRepository<TDTO, TCreate, TUpdate>
  protected imageHandlerService: IExternalImageDeleteService<any>

  protected useImage: boolean
  protected nameImage: keyof TDTO

  constructor(
    repository: IBaseRepository<TDTO, TCreate, TUpdate>,
    imageHandlerService: IExternalImageDeleteService<any>,
    useImage: boolean = false,
    nameImage: keyof TDTO
  ) {
    super(repository)
    this.repository = repository
    this.imageHandlerService = imageHandlerService
    this.useImage = useImage
    this.nameImage = nameImage
  }

  /**
   * Delegates image handling to the external service.
   * @param imageUrl The URL of the image.
   * @param isSaved If true, the image is marked as saved/kept. If false, it's deleted.
   */
  async handleImages(imageUrl: string, isSaved: boolean) {
    if (this.useImage && imageUrl?.trim()) {
      return await this.imageHandlerService.handleImages(imageUrl, isSaved)
    }
  }

  async getAll(field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAll(field, whereField)
  }

  async getById(id: string | number): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getById(id)
  }

  async getByField(field: unknown, whereField: keyof TDTO | string): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByField(field, whereField)
  }

  async getWithPages(options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    return await this.repository.getWithPages(options)
  }

  async create(data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    const response = await this.repository.create(data)

    // Si usamos imágenes y el flag useImg es true, consumimos la imagen
    const payload = data as TCreate & ImageControl
    if (this.useImage && payload.useImg) {
      const imageUrl = payload[this.nameImage as unknown as keyof TCreate] as unknown as string
      if (imageUrl) {
        // "Un solo uso": asumo que handleImages(url, false) la "consume" (la borra de la DB temporal)
        await this.handleImages(imageUrl, false)
      }
    }

    return response
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      const payload = data as TUpdate & ImageControl
      const oldImageUrl = register.results[this.nameImage] as unknown as string
      const newImageUrl = payload[this.nameImage as unknown as keyof TUpdate] as unknown as string

      const isNewImage = newImageUrl && oldImageUrl !== newImageUrl

      const updated = await this.repository.update(id, data)

      let imageMessage = ''

      // 1. Manejar imagen NUEVA (si viene useImg)
      if (this.useImage && payload.useImg && newImageUrl) {
        await this.handleImages(newImageUrl, false) // Consumirla
      }

      // 2. Manejar imagen VIEJA (si ha cambiado)
      if (this.useImage && isNewImage && oldImageUrl) {
        // Si saver es true, conservamos la vieja. Si es false (o undefined), la borramos.
        const shouldSaveOld = payload.saver === true
        const res = await this.handleImages(oldImageUrl, shouldSaveOld)
        if (res) imageMessage = `\nImagen antigua: ${res}`
      }

      return {
        message: `${updated.message}${imageMessage}`,
        results: updated.results
      }
    } catch (error) {
      console.error('Update error', error)
      throw error
    }
  }

  async delete(id: string | number): Promise<IRepositoryResponse<string>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      const imageUrl = register.results[this.nameImage] as unknown as string

      const deleted = await this.repository.delete(id)

      let imageMessage = ''
      if (this.useImage && imageUrl) {
        const res = await this.handleImages(imageUrl, false) // Borrar al eliminar registro
        if (res) imageMessage = ` and ${res}`
      }

      return {
        message: `${deleted.message}${imageMessage}`,
        results: deleted.results
      }
    } catch (error) {
      console.error('Error deleting: ', error)
      throw error
    }
  }

  async getAllScoped(scope: string = 'enabledOnly'): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAllScoped(scope)
  }

  async getByIdScoped(id: string | number, scope: string = 'enabledOnly'): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByIdScoped(id, scope)
  }
}
