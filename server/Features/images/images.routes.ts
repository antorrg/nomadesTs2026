import express from 'express'
import { imageRepository } from '../../Shared/dependencies.js'
import { ImageController } from './ImageController.js'

import { upload } from './ImageController.js'

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