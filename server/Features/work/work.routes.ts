import express from 'express'
import { Validator } from 'req-valid-express'
import { Work } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { parser, parserQuery, mockData } from './workMappers.js'
import {BaseServiceWithImages} from '../../Shared/Services/BaseServiceWithImages.js'
import {ImgsService} from '../../Shared/Services/ImgsService.js'
import {BaseController} from '../../Shared/Controllers/BaseController.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";
import { sanitizeRichText } from '../../Shared/Middlewares/sanitizeRichText.js'
import * as sch from './schemas.js'



const workRepository = new BaseRepository(Work, parser, parserQuery, 'Work', 'title', mockData)
const workService = new BaseServiceWithImages(workRepository, ImgsService, true, 'picture')
const workController = new BaseController(workService)

const workRouter = express.Router()

/**
 * RUTAS PÚBLICAS
 */
workRouter.get(
    '/public',
    workController .getAllPublic
)

workRouter.get(
    '/public/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    workController .getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
workRouter.get(
    '/',
    isAuthenticated,
    workController .getAll
)

workRouter.get(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    workController .getById
)

workRouter.post(
    '/',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.create),
    sanitizeRichText(['text']),
    workController.create
)

workRouter.put(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.update),
     sanitizeRichText(['text']),
    workController.update
)

workRouter.delete(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.ADMIN),
    workController.delete
)

export default workRouter
