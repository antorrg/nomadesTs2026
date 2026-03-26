import express from 'express'
import userRouter from './Features/user/user.route.js'
import imagesRouter from './Features/images/images.routes.js'
import logRouter from './Features/systemLogs/log.routes.js'
import authRouter from './Features/auth/auth.routes.js'
import landingRouter from './Features/landing/landing.routes.js'
import workRouter from './Features/work/work.routes.js'
import mediaRouter from './Features/media/media.routes.js'
import productRouter from './Features/product/product.routes.js'
import mailRouter from './ExternalServices/nodeMailer/mail.routes.js'
import { isAuthenticated, authorizeMinRole, UserRole } from "./Shared/Auth/authMiddlewares.js";

const mainRouter = express.Router()

mainRouter.use('/api/v1/auth', authRouter)
mainRouter.use('/api/v1/product', productRouter)
mainRouter.use('/api/v1/landing', landingRouter)
mainRouter.use('/api/v1/work', workRouter)
mainRouter.use('/api/v1/media', mediaRouter)
mainRouter.use('/api/v1/user', userRouter)
mainRouter.use('/api/v1/mail', mailRouter)
mainRouter.use('/api/v1/images', isAuthenticated, imagesRouter)
mainRouter.use('/api/v1/admin/logs', isAuthenticated, authorizeMinRole(UserRole.ADMIN),logRouter)

export default mainRouter
