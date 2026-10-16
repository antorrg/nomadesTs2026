import { type Request, type Response, type NextFunction } from 'express'
import envConfig from '../../Configs/envConfig.js'
import { Hasher } from './Hasher.js'
import crypto from 'crypto'
import { middError } from '../../Configs/errorHandlers.js'
import { SessionData } from 'express-session'

export class UserMidd {
  static createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const passwordGenerated = req.body.password || UserMidd.generatePassword(12)

    req.body = {
      email,
      password: await Hasher.hashPassword(passwordGenerated),
      plainPassword: passwordGenerated,
      nickname: email.split('@')[0],
      picture: envConfig.BasePicture,
      enabled: true
    }
    next()
  }
  static profileGuard(req: Request, res: Response, next: NextFunction){
    const {id} = req.params
    const session = req.session as SessionData
    if(!session || !session.user){return next(middError('No autorizado', 401))}
    if(id !== session.user.id){return next(middError('Solo el propietario puede actualizar su perfil', 400))}
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
      if (!Number.isInteger(length) || length < 8) {
        throw new RangeError('La contraseña debe tener al menos 8 caracteres')
      }

      const lower = 'abcdefghijklmnopqrstuvwxyz'
      const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const digits = '0123456789'
      const all = lower + upper + digits

      const password = [
        upper[crypto.randomInt(upper.length)],
        digits[crypto.randomInt(digits.length)],
      ]

      while (password.length < length) {
        password.push(all[crypto.randomInt(all.length)])
      }

      // Mezcla Fisher–Yates
      for (let i = password.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1)
        ;[password[i], password[j]] = [password[j], password[i]]
      }

      return password.join('')
    }
}
