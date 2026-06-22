import express from 'express'
import { imageRepository } from '../../Shared/dependencies.js'
import { ImageController } from './ImageController.js'
import { authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";

import { upload } from './ImageController.js'

const controller = new ImageController(imageRepository)

const imagesRouter = express.Router()

imagesRouter.get(
    '/',
    authorizeMinRole(UserRole.USER),
    controller.getImages
)

imagesRouter.delete(
    '/:id',
     authorizeMinRole(UserRole.USER),
    controller.deleteImages
)

imagesRouter.post(
    '/upload',
     authorizeMinRole(UserRole.USER),
    upload.single('image'),
    controller.uploader
)

imagesRouter.post(
    '/save',
     authorizeMinRole(UserRole.USER),
    controller.saveImage
)


export default imagesRouter