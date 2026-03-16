import {Landing } from '../../../Models/landing.model.js'
import envConfig from '../../Configs/envConfig.js'

export interface ILanding {
  id: number
  picture: string
  title: string
  info_header: string
  description: string
  enabled: boolean
}
export type CreateLanding = Partial<ILanding>
export type UpdateLanding = Partial<ILanding>



export const parser = (
  u: InstanceType<typeof Landing>
): ILanding => {
  const raw = u.get({ plain: true })
  return {
    id: raw.id,
    picture: raw.picture,
    title: raw.title,
    info_header: raw.info_header,
    description: raw.description,
    enabled: raw.enabled
  }
}

export const mockLanding: ILanding[] = [{
  id: 0,
  picture: envConfig.BasePicture,
  title: 'Aun no hay datos',
  info_header: 'Aun no hay datos',
  description: 'Aun no hay datos',
  enabled: true
}]