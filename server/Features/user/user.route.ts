import { Router } from 'express'
import { User } from '../../Configs/database.js'
import { UserService } from './UserService.js'
import { ImgsService } from '../../Shared/Services/ImgsService.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { UserController } from './UserController.js'
import { userParser, mockData, type IUserDTO } from './UserMappers.js'
import { UserRepository } from './UserRepository.js'
import { Validator } from 'req-valid-express'
import { create, update, upgrade, banner, changePassword as changePasswordSchema } from './schemas.js'
import { UserMidd } from './UserMidd.js'
import { MailController } from '../../ExternalServices/nodeMailer/MailController.js'
import { authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";
import { allowedQueryValues } from '../../Shared/Utils/allowedQueryValues.js'

export const userRepository = new UserRepository(User, userParser, 'User', 'email', mockData as any)
export const userService = new UserService(userRepository, ImgsService as any, false, 'picture', MailController.resetPasswordEmail)
const user = new UserController(userService as any)

const password: RegExp = /^(?=.*[A-Z]).{8,}$/
const email: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userRouter = Router()

userRouter.get(
  '/',
  user.getAll
)
userRouter.get(
  '/pages',
  user.getWithPages
)
userRouter.get(
  '/:id',
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.getById
)

userRouter.post(
  '/create',
  authorizeMinRole(UserRole.ADMIN),
  Validator.validateBody(create),
  Validator.validateRegex(
    email,
    'email',
    'Enter a valid email'
  ),
  Validator.validateRegex(
    password,
    'password',
    'Enter a valid password'
  ),
  UserMidd.createUser,
  user.create
)

userRouter.patch(
  '/:id/profile',
  UserMidd.profileGuard,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(update),
  user.update
)
userRouter.patch(
  '/:id/change-password',
  UserMidd.profileGuard,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(changePasswordSchema),
  Validator.validateRegex(
    password,
    'newPassword',
    'Enter a valid password'
  ),
  user.changePassword
)

userRouter.patch(
  '/:id/reset-password',
  authorizeMinRole(UserRole.ADMIN),
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  UserMidd.resetPassword,
  user.resetPassword
)

userRouter.patch(
  '/:id/blocker',
  authorizeMinRole(UserRole.ADMIN),
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(banner),
  user.update
)
userRouter.patch(
  '/:id/upgrade',
  authorizeMinRole(UserRole.ADMIN),
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(upgrade),
  allowedQueryValues({role: ['ADMIN', 'MODERATOR', 'USER', 'EMPLOYEE']}),
  user.update
)

userRouter.delete(
  '/:id',
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.delete
)

export default userRouter
