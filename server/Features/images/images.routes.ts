import express from 'express'
import { Image } from '../../Configs/database.js'
import { ImageRepository } from './ImageRepository.js'
import { ImageController } from './ImageController.js'
import { parser } from './Images.interface.js'
import { upload } from './ImageController.js'

export const imageRepository = new ImageRepository(Image, parser as any)
const controller = new ImageController(imageRepository)

const imagesRouter = express.Router()

imagesRouter.get(
    '/',
    controller.getImages
)

imagesRouter.delete(
    '/:id',
    controller.deleteImages
)

imagesRouter.post(
    '/upload',
    upload.single('image'),
    controller.uploader
)

imagesRouter.post(
    '/save',
    controller.saveImage
)


export default imagesRouter