import { uploadToCloudinary, deleteFromCloudinary } from '../../ExternalServices/cloudinary.js'
import MockImgsService from './MockImgsService.js'
import envConfig from '../../Configs/envConfig.js'
import { throwError } from '../../Configs/errorHandlers.js'
import { imageRepository } from '../dependencies.js'
import logger from '../../Configs/logger.js'

//Cambiar la segunda opcion por el servicio de imagenes creado
const deleteImageByUrl = envConfig.Status !== 'production' ? MockImgsService.mockFunctionDelete : deleteFromCloudinary
const selectUploaders = envConfig.Status !== 'production' ? MockImgsService.mockUploadNewImage : uploadToCloudinary

export type DataImage = string | number
export type ImageApi = {
  id: string | number
  imageUrl: string
}


export class ImgsService {

  static uploadNewImage = async (file: any) => {
    return await selectUploaders(file)
  }

  static deleteImage = async (imageUrl: string) => {
    // 1. Borrar de almacenamiento (Cloudinary o Mock)
    const storageRes = await this.handleImages(imageUrl, false)
    // 2. Borrar del repositorio (DB)
    await imageRepository.deleteImageFromDbByUrl(imageUrl as any)
    return storageRes
  }
  static releaseImageFromDb = async (imageUrl: string) => {
    await imageRepository.deleteImageFromDbByUrl(imageUrl as any)
  }
  static handleImages = async (data: DataImage, isSaved: boolean) => {
    try {
      let res;
      isSaved === true ?
        res = await imageRepository.saveImage({ imageUrl: data } as any)
        :
        res = await deleteImageByUrl(data as any)
      return res
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

}
//*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// import { deleteFromCloudinary, uploadToCloudinary } from '../../cloudinary.js'

