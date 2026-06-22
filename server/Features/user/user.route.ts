import { Router } from 'express'
import { UserController } from './UserController.js'
import { Validator } from 'req-valid-express'
import { create, update, upgrade, banner, changePassword as changePasswordSchema } from './schemas.js'
import { UserMidd } from './UserMidd.js'
import { authorizeMinRole, UserRole } from "../../Shared/Auth/authMiddlewares.js";
import { allowedQueryValues } from '../../Shared/Utils/allowedQueryValues.js'
import { userService } from '../../Shared/dependencies.js'

const user = new UserController(userService)

const password: RegExp = /^(?=.*[A-Z]).{8,}$/
const email: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userRouter = Router()

userRouter.get(
  '/',
  authorizeMinRole(UserRole.ADMIN),
  user.getAll
)
userRouter.get(
  '/pages',
  authorizeMinRole(UserRole.ADMIN),
  user.getWithPages
)
userRouter.get(
  '/:id',
  authorizeMinRole(UserRole.ADMIN),
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
  UserMidd.createUser,
  user.create
)

userRouter.patch(
  '/:id/profile',
  authorizeMinRole(UserRole.USER),
  UserMidd.profileGuard,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(update),
  user.update
)
userRouter.patch(
  '/:id/change-password',
  authorizeMinRole(UserRole.USER),
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
  authorizeMinRole(UserRole.ADMIN),
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.delete
)

export default userRouter
