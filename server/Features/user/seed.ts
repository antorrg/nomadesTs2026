import {User} from '../../Configs/database.js'
import envConfig from '../../Configs/envConfig.js'
import logger from '../../Configs/logger.js'
import bcrypt from 'bcrypt'

export const initialUser = async () => {
  const hasheredPass = await bcrypt.hash(envConfig.RootPass, 12)
  const data = {
    email: envConfig.RootEmail,
    nickname: envConfig.RootEmail.split('@')[0],
    name: 'Admin',
    password: hasheredPass,
    role: 'ADMIN',
    picture: envConfig.UserImg
  }
  try {
    const users = await User.findAll()
    if (users.length > 0) {
      return logger.info('The user already exists!')
    }
    const superUser = await User.create(data)
    if (!superUser) {
        return logger.error('no se pudo crear el usuario')
    }
    return logger.info('The user was successfully created!!')
  } catch (error) {
    console.error('Algo ocurrió al inicio: ', error)
    logger.error(error)
  }
}
  