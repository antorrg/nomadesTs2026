import { type Request, type Response } from 'express'
import { AuthService } from './AuthService.js'
import { Auth } from '../../Shared/Auth/authMiddlewares.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'

export class AuthController {
    private readonly authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const userSessionData = await this.authService.login(email, password)

        // Guardamos en la sesión
        Auth.login(req, userSessionData)

        // Cookie visible para el cliente (para evitar requests innecesarios)
        res.cookie('logged_in', 'true', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días (ajustar según sesión)
        })

        BaseController.responder(res, 200, true, 'Login exitoso', userSessionData)
    }

    logout = async (req: Request, res: Response) => {
        await Auth.logout(req)
        res.clearCookie('connect.sid', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.clearCookie('logged_in');
        BaseController.responder(res, 200, true, 'Sesión cerrada', null)
    }

    me = async (req: Request, res: Response) => {
        const user = Auth.getSessionUser(req)
        if (!user) {
            return BaseController.responder(res, 401, false, 'No autenticado', null)
        }
        BaseController.responder(res, 200, true, 'Usuario recuperado', user)
    }
}

