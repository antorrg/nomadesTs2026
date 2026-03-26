import { type Request, type Response, type NextFunction } from 'express'
import envConfig from '../../Configs/envConfig.js'
import { Hasher } from './Hasher.js'
import crypto from 'crypto'
import { middError } from '../../Configs/errorHandlers.js'
import { SessionData } from 'express-session'

export class UserMidd {
  static createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    req.body = {
      email,
      password: await Hasher.hashPassword(password),
      nickname: email.split('@')[0],
      picture: envConfig.UserImg,
      enabled: true
    }
    next()
  }
  static profileGuard(req: Request, res: Response, next: NextFunction){
    const {id} = req.params
    const session = req.session as SessionData
    if(!session){return next(middError('No autorizado', 401))}
    if(id !== session.user!.id){return next(middError('Solo el propietario puede actualizar su perfil', 400))}
    next()
  }
    static resetPassword = async(req: Request, res: Response, next: NextFunction) => {
    const passwordGenerated = UserMidd.generatePassword(12)
    const hashedPass = await Hasher.hashPassword(passwordGenerated)
    if (!req.body) { req.body = {}; }
    req.body.hashedPassword = hashedPass
    req.body.plainPassword = passwordGenerated
    next()
  }
  static generatePassword(length = 12) {
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'
    // const symbols = '!@#$%^&*()-_=+[]{};:,.<>/?'

    const all = lower + digits + upper// + symbols

    let password = ''

    // 1. Garantizar al menos una mayúscula
    password += upper[crypto.randomInt(upper.length)]

    // 2. Completar el resto hasta el largo deseado
    for (let i = 1; i < length; i++) {
      password += all[crypto.randomInt(all.length)]
    }

    // 3. Mezclar el resultado para que la mayúscula no quede siempre al principio
    return password
      .split('')
      .sort(() => crypto.randomInt(2) - 1)
      .join('')
  }
}
