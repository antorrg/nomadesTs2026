import express from 'express'
import { Validator } from 'req-valid-express'
import { HighRepository } from './HighRepository.js'
import {BaseServiceWithImages} from '../../Shared/Services/BaseServiceWithImages.js'
import {ImgsService} from '../../Shared/Services/ImgsService.js'
import {BaseController} from '../../Shared/Controllers/BaseController.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";
import { sanitizeRichText } from '../../Shared/Middlewares/sanitizeRichText.js'
import * as sch from './schemas.js'

const hightRepository = new HighRepository()
const hightService = new BaseServiceWithImages(hightRepository, ImgsService, true, 'picture')
const controller = new BaseController(hightService)
const hightlightRouter = express.Router()
/**
 * RUTAS PÚBLICAS
 */
hightlightRouter.get(
    '/public',
    controller .getAllPublic
)

hightlightRouter.get(
    '/public/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    controller .getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
hightlightRouter.get(
    '/',
    isAuthenticated,
    controller .getAll
)

hightlightRouter.get(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    controller .getById
)

hightlightRouter.post(
    '/',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.create),
    sanitizeRichText(['text']),
    controller.create
)

hightlightRouter.put(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.update),
     sanitizeRichText(['text']),
    controller.update
)

hightlightRouter.delete(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.ADMIN),
    controller.delete
)

export default hightlightRouter