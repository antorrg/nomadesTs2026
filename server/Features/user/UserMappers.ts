import { type Model } from 'sequelize'
import { type User } from '../../Configs/database.js'
import envConfig from '../../Configs/envConfig.js'
export interface IUserDTO {
  id: string
  email: string
  nickname?: string | null
  name: string
  picture?: string | null
  role: string
  enabled: boolean
}
export type IResetPassword = {
  hashedPassword: string,
  plainPassword:string
}
export interface IUserWithCredentials extends IUserDTO {
  password?: string | null
}
export interface CreateUserInput {
  email: string
  password?: string
  nickname?: string | null
  name: string
  picture?: string | null
  enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const userParser = (
  u: InstanceType<typeof User> | Model | unknown
): IUserDTO => {
  const raw = toUserRaw(u)
  return {
    id: raw.id,
    email: raw.email,
    nickname: raw.nickname,
    name: raw.name,
    picture: raw.picture,
    role: raw.role,
    enabled: raw.enabled
  }
}

export const authParser = (
  u: InstanceType<typeof User> | Model
): IUserWithCredentials => {
  const raw = toUserRaw(u)
  return {
    ...userParser(u),
    password: raw.password
  }
}

const toUserRaw = (value: InstanceType<typeof User> | Model | unknown): IUserWithCredentials => {
  if (isSequelizeModel(value)) {
    return value.get({ plain: true }) as IUserWithCredentials
  }
  return value as IUserWithCredentials
}

const isSequelizeModel = (value: unknown): value is Model => (
  typeof value === 'object' &&
  value !== null &&
  'get' in value &&
  typeof (value as { get: unknown }).get === 'function'
)

export const mockData: IUserDTO[] = [{
  id: 'false',
  email: 'email@example.com',
  nickname: 'no hay datos',
  name: 'no hay datos',
  picture: envConfig.BasePicture,
  role: 'USER',
  enabled: true
}]
