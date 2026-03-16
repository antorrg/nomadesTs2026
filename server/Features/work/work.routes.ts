import express from 'express'
import { Work } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { parser, mockData } from './workMappers.js'
import {BaseServiceWithImages} from '../../Shared/Services/BaseServiceWithImages.js'
import {ImgsService} from '../../Shared/Services/ImgsService.js'
import {BaseController} from '../../Shared/Controllers/BaseController.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";


const workRepository = new BaseRepository(Work, parser as any, 'Work', 'title', mockData)
const workService = new BaseServiceWithImages(workRepository, ImgsService as any, true, 'picture')
const workController = new BaseController(workService)

const workRouter = express.Router()

/**
 * RUTAS PÚBLICAS (Usan scope 'enabledOnly' por defecto en la base)
 */
workRouter.get(
    '/public',
    workController .getAllPublic
)

workRouter.get(
    '/public/:id',
    workController .getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
workRouter.get(
    '/',
    workController .getAll
)

workRouter.get(
    '/:id',
    workController .getById
)

workRouter.post(
    '/',
    workController .create
)

workRouter.put(
    '/:id',
    workController .update
)

workRouter.delete(
    '/:id',
    workController .delete
)

export default workRouter