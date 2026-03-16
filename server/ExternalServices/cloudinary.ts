import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { Request } from 'express'
import envConfig from '../Configs/envConfig.js'
import path from 'path'
import {throwError} from '../Configs/errorHandlers.js'

// Tipos
interface CloudinaryUploadOptions {
  resource_type: 'auto' | 'image' | 'video' | 'raw'
  public_id: string
  format: string
}

interface UploadResponse {
  success: boolean
  message: string
  result: UploadApiResponse
}

interface DeleteResponse {
  success: boolean
  message: string
  result: Record<string, unknown>
}

// Funciones con tipos correctos
async function testCloudinaryConnection(): Promise<boolean> {
  try {
    const result = await cloudinary.api.ping()
    console.log('Conexión exitosa con Cloudinary:', result)
    return true
  } catch (error) {
    console.error('Error al conectar con Cloudinary:', error)
    return false
  }
}

const uploadStream = (buffer: Buffer, options: CloudinaryUploadOptions): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error: UploadApiErrorResponse | undefined, result?: UploadApiResponse) => {
      if (error) {
        reject(error)
      } else {
        resolve(result!)
      }
    })
    stream.write(buffer)
    stream.end()
  })
}

async function uploadToCloudinary(file: Express.Multer.File): Promise<UploadApiResponse> {
  const options: CloudinaryUploadOptions = {
    resource_type: 'auto',
    public_id: path.parse(file.originalname).name,
    format: 'webp'
  }
  try {
    const result = await uploadStream(file.buffer, options)
    return result
  } catch (error) {
    throw error
  }
}

function extractPublicIdFromUrl(url: string): string {
  try {
    const urlParts = url.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    const lastDotIndex = lastPart.lastIndexOf('.')
    
    if (lastDotIndex === -1) {
      throw new Error('La URL no contiene una extensión válida')
    }
    
    const publicId = lastPart.substring(0, lastDotIndex)
    console.log(publicId)
    return publicId
  } catch (error) {
    throw new Error('URL de Cloudinary inválida')
  }
}

async function deleteFromCloudinary(imageUrl: string): Promise<DeleteResponse> {
  try {
    const publicId = decodeURIComponent(extractPublicIdFromUrl(imageUrl))
    console.log('publicId:', publicId)
    
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(result)
    
    if (result.result === 'ok') {
      return {
        success: true,
        message: 'Imagen eliminada correctamente',
        result
      }
    } else {
     return throwError('Error al eliminar imagen', 500)
    }
  } catch (error) {
    throw error
  }
}

const configureCloudinary = async (): Promise<void> => {
  cloudinary.config({
    cloud_name: envConfig.CloudName,
    api_key: envConfig.CloudApiKey,
    api_secret: envConfig.CloudApiSecret
  })
  console.log('Configuración de Cloudinary aplicada')
}

export { uploadToCloudinary, configureCloudinary, deleteFromCloudinary }