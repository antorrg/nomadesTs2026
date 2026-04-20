import { throwError } from '../../Configs/errorHandlers.js'
import fs from 'fs/promises'
import path from 'path'
import envConfig from '../../Configs/envConfig.js'

const LocalBaseUrl = process.env.LOCAL_BASE_URL || `http://localhost:${envConfig.Port}`

export default class MockImgsService {
  static #uploadDirectory = `./${envConfig.TestImagesUploadDir}`
  static mockUploadNewImage = async (file: any) => {
    const uploadDir = MockImgsService.#uploadDirectory
    try {
      // Asegurarse que exista la carpeta
      await fs.mkdir(uploadDir, { recursive: true })
      const newPath = path.join(uploadDir, file.originalname)
      await fs.writeFile(newPath, file.buffer)
      return `${LocalBaseUrl}/${envConfig.TestImagesUploadDir}/${file.originalname}`
    } catch (error) {
      throw error
    }
  }

  static mockFunctionDelete = async (imageUrl: string) => {
    const filename = path.basename(imageUrl)
    if (!path.extname(filename)) {
      throw new Error(`URL inválida, no contiene archivo: ${imageUrl}`)
    }
    const filePath = path.join(MockImgsService.#uploadDirectory, filename)
    try {
      await new Promise(res => setTimeout(res, 1000))
      await fs.unlink(filePath)
     // console.log(`Image ${filePath} deleted successfully`)
      return `Image ${filePath} deleted successfully`
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return `Image ${filePath} already deleted or not found`
      }
      //console.error(`Error al borrar imagen local: ${filename}`, err)
      throwError('Error deleting images', 500)
    }
  }
}
