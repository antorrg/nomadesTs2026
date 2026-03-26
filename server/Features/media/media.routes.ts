import express from 'express'
import { Media } from '../../Configs/database.js'
import {BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { BaseService } from '../../Shared/Services/BaseService.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import {type IMedia, type CreateMedia, type UpdateMedia, parser, mockMedia } from './mediaMappers.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";

const mediaRepository = new BaseRepository<IMedia, CreateMedia, UpdateMedia>(Media, parser as any, 'Media', 'title', mockMedia as any)

const mediaService = new BaseService<IMedia, CreateMedia, UpdateMedia>(
    mediaRepository as any)

// 3. Instanciamos el Controlador Base directamente
const mediaController = new BaseController<IMedia, CreateMedia, UpdateMedia>(mediaService)

const mediaRouter = express.Router()

/**
 * RUTAS PÚBLICAS (Usan scope 'enabledOnly' por defecto en la base)
 */
mediaRouter.get(
    '/public',
    mediaController.getAllPublic
)

mediaRouter.get(
    '/public/:id',
    mediaController.getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
mediaRouter.get(
    '/',
    isAuthenticated,
    mediaController.getAll
)

mediaRouter.get(
    '/:id',
    isAuthenticated,
    mediaController.getById
)

mediaRouter.post(
    '/',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    mediaController.create
)

mediaRouter.put(
    '/:id',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    mediaController.update
)

mediaRouter.delete(
    '/:id',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    mediaController.delete
)

export default mediaRouter