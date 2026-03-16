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
  u: InstanceType<typeof User>
): IUserDTO => {
  const raw = u.get({ plain: true })
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
  u: InstanceType<typeof User>
): IUserWithCredentials => {
  const raw = u.get({ plain: true })
  return {
    ...userParser(u),
    password: raw.password
  }
}

export const mockData: IUserDTO[] = [{
  id: 'false',
  email: 'email@example.com',
  nickname: 'no hay datos',
  name: 'no hay datos',
  picture: envConfig.BasePicture,
  role: 'USER',
  enabled: true
}]