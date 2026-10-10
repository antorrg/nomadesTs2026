import express from 'express'
import { Validator } from 'req-valid-express'
import { Media, MediaConfig } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { MediaService } from './MediaService.js'
import { MediaController } from './MediaController.js'
import { 
  type IMedia, 
  type CreateMedia, 
  type UpdateMedia, 
  type IMediaConfig, 
  type CreateMediaConfig, 
  type UpdateMediaConfig, 
  parser, 
  parserQuery, 
  parserConfig, 
  mockMedia 
} from './mediaMappers.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js"
import * as sch from './schemas.js'

const mediaRepository = new BaseRepository<IMedia, CreateMedia, UpdateMedia>(
  Media, 
  parser, 
  parserQuery, 
  'Media', 
  'title', 
  mockMedia
)

const mediaConfigRepository = new BaseRepository<IMediaConfig, CreateMediaConfig, UpdateMediaConfig>(
  MediaConfig, 
  parserConfig, 
  'MediaConfig', 
  'id'
)

const mediaService = new MediaService(mediaRepository, mediaConfigRepository)
const mediaController = new MediaController(mediaService)

const mediaRouter = express.Router()

/**
 * RUTAS PÚBLICAS
 */
mediaRouter.get(
    '/public',
    mediaController.getAllPublic
)

mediaRouter.get(
    '/public/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    mediaController.getByIdPublic
)

/**
 * RUTAS ADMIN
 */
mediaRouter.put(
    '/config',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.configs),
    mediaController.updateConfig
)

mediaRouter.get(
    '/',
    isAuthenticated,
    mediaController.getAll
)

mediaRouter.get(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    mediaController.getById
)

mediaRouter.post(
    '/',
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.create),
    mediaController.create
)

mediaRouter.put(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    Validator.validateBody(sch.create),
    mediaController.update
)

mediaRouter.delete(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    isAuthenticated,
    authorizeMinRole(UserRole.MODERATOR),
    mediaController.delete
)

export default mediaRouter
