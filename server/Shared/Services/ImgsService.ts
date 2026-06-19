import { uploadToCloudinary, deleteFromCloudinary } from '../../ExternalServices/cloudinary.js'
import MockImgsService from './MockImgsService.js'
import envConfig from '../../Configs/envConfig.js'
import { imageRepository } from '../dependencies.js'
import logger from '../../Configs/logger.js'
import { type UploadedImageFile } from '../Interfaces/base.interface.js'
import { type CreateImages } from '../../Features/images/Images.interface.js'

//Cambiar la segunda opcion por el servicio de imagenes creado
const deleteImageByUrl = envConfig.Status !== 'production' ? MockImgsService.mockFunctionDelete : deleteFromCloudinary
const selectUploaders = envConfig.Status !== 'production' ? MockImgsService.mockUploadNewImage : uploadToCloudinary

export type DataImage = string | number
export type ImageApi = {
  id: string | number
  imageUrl: string
}


export class ImgsService {

  static uploadNewImage = async (file: UploadedImageFile): Promise<string> => {
    return await selectUploaders(file)
  }

  static deleteImage = async (imageUrl: string): Promise<string | undefined> => {
    // 1. Borrar de almacenamiento (Cloudinary o Mock)
    const storageRes = await this.handleImages(imageUrl, false)
    // 2. Borrar del repositorio (DB)
    await imageRepository.deleteImageFromDbByUrl(imageUrl)
    return storageRes
  }
  static releaseImageFromDb = async (imageUrl: string): Promise<string | undefined> => {
    return await imageRepository.deleteImageFromDbByUrl(imageUrl)
  }
  static handleImages = async (data: string, isSaved: boolean): Promise<string | undefined> => {
    try {
      if (isSaved) {
        const image = await imageRepository.saveImage({ imageUrl: data } satisfies CreateImages)
        return image.imageUrl
      }

      return await deleteImageByUrl(data)
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

}
//*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// import { deleteFromCloudinary, uploadToCloudinary } from '../../cloudinary.js'
