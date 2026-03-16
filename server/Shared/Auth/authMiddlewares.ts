import { type Request, type Response, type NextFunction } from 'express'
import { middError } from '../../Configs/errorHandlers.js'
import csurf from 'csurf'

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER'
}
export interface SessionUser {
  id: string
  email: string
  role: UserRole
}
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.EMPLOYEE]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4
}

// CSRF Protection via cookies
export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
})

// Add CSRF token to response for the first request
export const setCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  next()
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const sessionUser = req.session.user
  if (!sessionUser) return next(middError('No autenticado', 401))
  next()
}


// RBAC
export const authorize =
  (...allowedRoles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = req.session.user
      if (!user) return next(middError('No autenticado', 401))

      if (!allowedRoles.includes(user.role)) {
        return next(middError('Accion no permitida', 403))
      }

      next()
    }
// src/middlewares/authorize.ts


export const authorizeMinRole =
  (minimumRole: UserRole) =>
    (req: Request, res: Response, next: NextFunction) => {
      const sessionUser = req.session.user

      if (!sessionUser) {
        return next(middError('No autenticado', 401))
      }

      const userLevel = RoleHierarchy[sessionUser.role as UserRole]
      const requiredLevel = RoleHierarchy[minimumRole]

      if (userLevel < requiredLevel) {
        return next(middError('Faltan permisos para esta accion', 403))
      }

      next()
    }

export class Auth {
  static login(req: Request, user: { id: string, email: string, role: UserRole }) {
    req.session.user = user
    // No es estrictamente necesario en producción pero ayuda en tests asíncronos
    req.session.save()
  }

  static logout(req: Request) {
    return new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  static getSessionUser(req: Request) {
    return req.session?.user ?? null
  }
}

