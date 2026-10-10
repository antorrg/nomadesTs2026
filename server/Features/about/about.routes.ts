import express from 'express'
import { Validator } from 'req-valid-express'
import { About } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { BaseServiceWithImages } from '../../Shared/Services/BaseServiceWithImages.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { type IAbout, type CreateAbout, type UpdateAbout, parser, parserQuery, mockAbout  } from './aboutMappers.js'
import { ImgsService } from '../../Shared/Services/ImgsService.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";
import * as sch from './schemas.js'
import { sanitizeRichText } from '../../Shared/Middlewares/sanitizeRichText.js'


const aboutRepository = new BaseRepository<IAbout, CreateAbout,UpdateAbout>(About, parser, parserQuery, 'About', 'title', mockAbout)
const aboutService = new BaseServiceWithImages<IAbout, CreateAbout,UpdateAbout>(aboutRepository, ImgsService, true, 'picture')
const aboutController = new BaseController<IAbout, CreateAbout,UpdateAbout>(aboutService)

const aboutRouter = express.Router()
/**
 * RUTAS PÚBLICAS
 */
aboutRouter.get(
    '/public',
    aboutController.getAllPublic
)

aboutRouter.get(
    '/public/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
   aboutController.getByIdPublic
)

/**
 * RUTAS ADMIN (CRUD Base - Sin filtros de scope)
 */
aboutRouter.get(
    '/',
    isAuthenticated,
    aboutController.getAll
)

aboutRouter.get(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
   aboutController.getById
)

aboutRouter.post(
    '/',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    sanitizeRichText(['text']),
    Validator.validateBody(sch.create),
    aboutController.create
)

aboutRouter.put(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.update),
     sanitizeRichText(['text']),
    aboutController.update
)

aboutRouter.delete(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.ADMIN),
    aboutController.delete
)



export default aboutRouter
