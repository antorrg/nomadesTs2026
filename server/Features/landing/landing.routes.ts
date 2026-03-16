import express from 'express'
import { Landing } from '../../Configs/database.js'
import {BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { ImgsService } from '../../Shared/Services/ImgsService.js'
import { type ILanding, type CreateLanding, type UpdateLanding, parser, mockLanding } from './landingMappers.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";


const landRepository = new BaseRepository<ILanding, CreateLanding, UpdateLanding>(Landing, parser as any, 'Landing', 'title', mockLanding as any)

const landService = new BaseServiceWithImages<ILanding, CreateLanding, UpdateLanding>(
    landRepository as any,
    ImgsService as any,
    true,
    'picture'
)

// 3. Instanciamos el Controlador Base directamente
const landController = new BaseController<ILanding, CreateLanding, UpdateLanding>(landService)

const landRouter = express.Router()

/**
 * RUTAS PÚBLICAS (Usan scope 'enabledOnly' por defecto en la base)
 */
landRouter.get(
    '/public',
    landController.getAllPublic
)

landRouter.get(
    '/public/:id',
    landController.getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
landRouter.get(
    '/',
    landController.getAll
)

landRouter.get(
    '/:id',
    landController.getById
)

landRouter.post(
    '/',
    landController.create
)

landRouter.put(
    '/:id',
    landController.update
)

landRouter.delete(
    '/:id',
    landController.delete
)

export default landRouter