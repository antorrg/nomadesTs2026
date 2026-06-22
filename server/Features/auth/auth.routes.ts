import express from 'express'
import { AuthService } from './AuthService.js'
import { AuthController } from './AuthController.js'
import { RateLimiter } from '../../Shared/Middlewares/RateLimiter.js'
import { userRepository } from '../../Shared/dependencies.js'

const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

const authRouter = express.Router()

authRouter.post(
    '/login', 
    RateLimiter.loginRateLimiter, 
    authController.login
)
authRouter.get(
    '/me', 
    authController.me
)
authRouter.post(
    '/logout', 
    authController.logout
)

export default authRouter
